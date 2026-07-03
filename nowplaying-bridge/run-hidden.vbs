Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\Shyam\Desktop\full stack development\Cloud Resume\nowplaying-bridge"
WshShell.Run "C:\nvm4w\nodejs\node.exe index.js", 0, False
