Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\Shyam\Desktop\full stack development\Cloud Resume\nowplaying-bridge"
Do
    WshShell.Run "C:\nvm4w\nodejs\node.exe index.js", 0, True
    WScript.Sleep 5000
Loop
