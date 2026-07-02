import azure.functions as func
import json
import os
import re
import smtplib
from email.message import EmailMessage

GMAIL_ADDRESS = os.environ.get('GMAIL_ADDRESS')
GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD')
NOTIFY_TO_EMAIL = os.environ.get('NOTIFY_TO_EMAIL')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
MAX_LEN = {'name': 120, 'email': 200, 'subject': 200, 'message': 5000}


def json_response(body, status_code):
    return func.HttpResponse(
        body=json.dumps(body),
        status_code=status_code,
        headers={**CORS_HEADERS, 'Content-Type': 'application/json'},
    )


def validate(data):
    if not isinstance(data, dict):
        return 'Invalid request body'
    for field in ('name', 'email', 'subject', 'message'):
        value = data.get(field)
        if not isinstance(value, str) or not value.strip():
            return f'{field} is required'
        if len(value) > MAX_LEN[field]:
            return f'{field} is too long'
    if not EMAIL_RE.match(data['email'].strip()):
        return 'email is not valid'
    return None


def send_notification_email(entry):
    msg = EmailMessage()
    msg['Subject'] = f"Portfolio contact: {entry['subject']}"
    msg['From'] = GMAIL_ADDRESS
    msg['To'] = NOTIFY_TO_EMAIL
    msg['Reply-To'] = entry['email']
    msg.set_content(
        f"From: {entry['name']} <{entry['email']}>\n\n"
        f"{entry['message']}"
    )

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        smtp.send_message(msg)


def main(req: func.HttpRequest) -> func.HttpResponse:
    if req.method == 'OPTIONS':
        return func.HttpResponse(status_code=204, headers=CORS_HEADERS)

    if not (GMAIL_ADDRESS and GMAIL_APP_PASSWORD and NOTIFY_TO_EMAIL):
        print("Contact function is missing GMAIL_ADDRESS / GMAIL_APP_PASSWORD / NOTIFY_TO_EMAIL")
        return json_response({'error': 'Contact form is not configured'}, 500)

    try:
        data = req.get_json()
    except ValueError:
        return json_response({'error': 'Invalid JSON body'}, 400)

    error = validate(data)
    if error:
        return json_response({'error': error}, 400)

    entry = {
        'name': data['name'].strip(),
        'email': data['email'].strip(),
        'subject': data['subject'].strip(),
        'message': data['message'].strip(),
    }

    try:
        send_notification_email(entry)
    except Exception as e:
        print(f"Notification email failed: {e}")
        return json_response({'error': 'Could not send message'}, 500)

    return json_response({'ok': True}, 201)
