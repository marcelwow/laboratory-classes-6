const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    const serverUrl = 'http://localhost:3000';


    const waitForServer = () => {
        http.get(serverUrl, () => {
            mainWindow.loadURL(serverUrl);
        }).on('error', () => {
            setTimeout(waitForServer, 500);
        });
    };

    waitForServer();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}


const { spawn } = require('child_process');
const serverProcess = spawn('npm', ['start'], { shell: true });

serverProcess.stdout.on('data', data => {
    console.log(`[Express]: ${data}`);
});
serverProcess.stderr.on('data', data => {
    console.error(`[Express error]: ${data}`);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        serverProcess.kill();
        app.quit();
    }
});
