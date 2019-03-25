const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const windows = new Set();

// 1. Declare here to avoid being collected by GC
// 2. The 'let' statement declares a block scope local variable,
//    optionally initializing it to a value
let mainWindow = null;
var currentPath = process.cwd();

app.on('ready', () => {
  createWindow();
});

const createOneWindow = () => {
  mainWindow = new BrowserWindow({ show: false });
  // Debug
  //mainWindow.webContents.openDevTools();

  mainWindow.webContents.loadFile(currentPath + '/app/index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Call getFileFromUser when the window is ready to show
    getFileFromUser();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const createWindow = exports.createWindow = () => {
  let newWindow = new BrowserWindow({ show: false });

  newWindow.loadFile('index.html');

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
}

//const getFileFromUser = exports.getFileFromUser = () => {
// const files = dialog.showOpenDialog(mainWindow, {
const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
 const files = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
  });

  if (!files) {
    return;
  }

  //const file = files[0];
  //const openFile = (file) => {
  //  // fs.readFileSync() return a buffer object
  //  const content = fs.readFileSync(file).toString();
  //  mainWindow.webContents.send('file-opened', file, content);
  //};
  if (files) { openFils(targetWindow, files[0]); }
  const openFile = exports.openFile = (targetWindow, file) => {
    // fs.readFileSync() return a buffer object
    const content = fs.readFileSync(file).toString();
    targetWindow.webContents.send('file-opened', file, content);
  };

}
