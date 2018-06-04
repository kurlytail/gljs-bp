// Basic init
const electron = require('electron');
const { app, BrowserWindow } = electron;

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname);
require('electron-debug')();

// To avoid being garbage collected
let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow();

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});
