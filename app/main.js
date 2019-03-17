const { app, BrowserWindow } = require('electron');

// main process - app:
//   1.handles the lifecycle and configuration of the application
//   2.does not have DOM and can't render a UI
// renderer process:
//   1.is created by main process with BrowserWindow
//   2.deals with the UI

let mainWindow = null;
var currentPath = process.cwd();

app.on('ready', () => {
  console.log('Hi Electron!');
  // build the window after ready event listener in case of being eligible for GC
  mainWindow = new BrowserWindow();
  mainWindow.webContents.loadFile(currentPath + '/app/index.html');
});
