import azure.functions as func
import json
import os
import time
from azure.cosmos import CosmosClient, exceptions

ENDPOINT = os.environ['COSMOS_ENDPOINT']
KEY = os.environ['COSMOS_KEY']
DATABASE_NAME = 'resumeDB'
CONTAINER_NAME = 'views'
ITEM_ID = 'now-playing'

WRITE_SECRET = os.environ.get('NOWPLAYING_WRITE_SECRET')

STALE_AFTER_SECONDS = 180
MAX_LEN = {'title': 200, 'artist': 200, 'album': 200, 'albumImageUrl': 500, 'songUrl': 500}

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Write-Secret',
    'Cache-Control': 'no-store',
}


def json_response(body, status_code):
    return func.HttpResponse(
        body=json.dumps(body),
        status_code=status_code,
        headers={**CORS_HEADERS, 'Content-Type': 'application/json'},
    )


def validate(data):
    if not isinstance(data, dict):
        return 'Invalid request body'
    if not isinstance(data.get('isPlaying'), bool):
        return 'isPlaying is required'
    if data['isPlaying']:
        for field in ('title', 'artist'):
            value = data.get(field)
            if not isinstance(value, str) or not value.strip():
                return f'{field} is required when isPlaying is true'
        for field, limit in MAX_LEN.items():
            value = data.get(field)
            if value is not None and (not isinstance(value, str) or len(value) > limit):
                return f'{field} is invalid'
    return None


def get_container():
    client = CosmosClient(ENDPOINT, KEY)
    database = client.get_database_client(DATABASE_NAME)
    return database.get_container_client(CONTAINER_NAME)


def handle_get(container):
    try:
        item = container.read_item(item=ITEM_ID, partition_key=ITEM_ID)
    except exceptions.CosmosResourceNotFoundError:
        return json_response({'isPlaying': False}, 200)

    if not item.get('isPlaying'):
        return json_response({'isPlaying': False}, 200)

    if time.time() - item.get('updatedAt', 0) > STALE_AFTER_SECONDS:
        return json_response({'isPlaying': False}, 200)

    return json_response({
        'isPlaying': True,
        'title': item.get('title'),
        'artist': item.get('artist'),
        'album': item.get('album'),
        'albumImageUrl': item.get('albumImageUrl'),
        'songUrl': item.get('songUrl'),
    }, 200)


def handle_post(req, container):
    if not WRITE_SECRET:
        print("Nowplaying function is missing NOWPLAYING_WRITE_SECRET")
        return json_response({'error': 'Endpoint is not configured'}, 500)

    if req.headers.get('X-Write-Secret') != WRITE_SECRET:
        return json_response({'error': 'Unauthorized'}, 401)

    try:
        data = req.get_json()
    except ValueError:
        return json_response({'error': 'Invalid JSON body'}, 400)

    error = validate(data)
    if error:
        return json_response({'error': error}, 400)

    item = {
        'id': ITEM_ID,
        'isPlaying': data['isPlaying'],
        'updatedAt': time.time(),
    }
    if data['isPlaying']:
        item.update({
            'title': data['title'].strip(),
            'artist': data['artist'].strip(),
            'album': (data.get('album') or '').strip() or None,
            'albumImageUrl': data.get('albumImageUrl'),
            'songUrl': data.get('songUrl'),
        })

    container.upsert_item(body=item)
    return json_response({'ok': True}, 200)


def main(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == 'OPTIONS':
        return func.HttpResponse(status_code=204, headers=CORS_HEADERS)

    container = get_container()

    if req.method == 'GET':
        return handle_get(container)

    if req.method == 'POST':
        return handle_post(req, container)

    return json_response({'error': 'Method not allowed'}, 405)
