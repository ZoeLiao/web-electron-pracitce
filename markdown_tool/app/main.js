const { app, BrowserWindow, dialog, Menu } = require('electron');
//const applicationMenu = require('./application-menu');
const createApplicationMenu = require('./application-menu');
const fs = require('fs');

const windows = new Set();
const openFiles = new Map();

// 1. Declare here to avoid being collected by GC
// 2. The 'let' statement declares a block scope local variable,
//    optionally initializing it to a value
let mainWindow = null;
var currentPath = process.cwd();

app.on('ready', () => {
  createApplicationMenu();
  createWindow();
});

// mac
app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false;
  }
  app.quit();
})

// activate only works on mac
app.on('activate', (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) { createWindow(); }
});

app.on('will-finish-launching', () => {
  app.on('open-file', (event, file) => {
    const win = createWindow();
    win.once('ready-to-show', () => {
      openFile(win, file);
    });
  });
});

app.on('ready', () => {
  //Menu.setApplicationMenu(applicationMenu);
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
  let x, y;

  const currentWindow = BrowserWindow.getFocusedWindow();

  if(currentWindow) {
    const [ currentWindowX, currentWindowY ] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  let newWindow = new BrowserWindow({ x, y, show: false });

  newWindow.loadFile(currentPath + '/app/index.html');

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('focus', createApplicationMenu);

  newWindow.on('closed', (event) => {
    // TODO check bug
    if (newWindow.isDocumentEdited()){
      event.preventDefault();

      const result = dialog.showMessageBox(newWindow, {
        type: 'warning',
        title: 'Quit with Unsaved Changes?',
        message: 'Your changes will be lost if you do not save.',
        buttons: [
          'Quit Anyway',
          'Cancel',
        ],
        defaultId: 0, // Quit Anyway
        cancelId: 1 // Cancel Anyway
      });

      if (result === 0) newWindow.destroy();
    }
  });

  // stop watching window while it is closed
  newWindow.on('closed', () => {
    windows.delete(newWindow);
    createApplicationMenu();

    stopWatchingFile(newWindow);
    newWindow = null;
  })

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
  if (files) { openFile(targetWindow, files[0]); }
};

const openFile = exports.openFile = (targetWindow, file) => {
  // fs.readFileSync() return a buffer object
  const content = fs.readFileSync(file).toString();
  startWatchingFile(targetWindow, file);
  // setRepresentedFilename: not works in Windows
  app.addRecentDocument(file);
  targetWindow.setRepresentedFilename(file);
  targetWindow.webContents.send('file-opened', file, content);
  createApplicationMenu();
};

const saveHtml = exports.saveHtml = (targetWindow, content) => {
  const file = dialog.showSaveDialog(targetWindow, {
    title: 'Save HTML',
    // getPath: returns the corrent file path based on user's platform
    // supports: home, desktop, document, userData ...
    defaultPath: app.getPath('userData'),
    buttonLabel: 'Save!',
    filters: [
      { name: 'HTML Files', extensions: ['html', 'htm']}
    ]
  });

  if (!file) return; // cancel dialog

  fs.writeFileSync(file, content);
};

const saveMarkdown = exports.saveMarkdown = (targetWindow, file, content) => {
  if (!file) {
    file = dialog.showSaveDialog(targetWindow, {
      title: 'Save Markdown',
      defaultPath: app.getPath('userData'),
      filers: [
        { name: 'Markdown Files', extensions: ['md', 'markdown']}
      ]
    })
  };

  if (!file) return;

  // write the contents of the buffer to the filesystem
  fs.writeFileSync(file, content);
  openFile(targetWindow, file);
}

const startWatchingFile = (targetWindow, file) => {
  stopWatchingFile(targetWindow);

  // reread the file if it's change
  const watcher = fs.watchFile(file, (event) => {
    if (event === 'change'){
      const content = fs.readFileSync(file);
      targetWindow.webContents.send('file-opended', file, content);
    }
  });

  openFiles.set(targetWindow, watcher);
};

const stopWatchingFile = (targetWindow) => {
  if (openFiles.has(targetWindow)) {
    openFiles.get(targetWindow).stop();
    openFiles.delete(targetWindow);
  }
}
