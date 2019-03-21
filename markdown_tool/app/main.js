const { app, BrowserWindow } = require('electron');

// 1. Declare here to avoid being collected by GC
// 2. The 'let' statement declares a block scope local variable,
//    optionally initializing it to a value
let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow();

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
