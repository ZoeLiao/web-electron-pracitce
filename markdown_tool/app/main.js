const { app, BrowserWindow } = require('electron');

// 1. Declare here to avoid being collected by GC
// 2. The 'let' statement declares a block scope local variable,
//    optionally initializing it to a value
let mainWindow = null;
var currentPath = process.cwd();

app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false });

  mainWindow.webContents.loadFile(currentPath + '/app/index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
