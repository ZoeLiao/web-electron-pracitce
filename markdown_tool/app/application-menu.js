const {app, BrowserWindow, Menu, shell } = require('electron');
const mainProcess = require('./main');

const template = [
  {
    label: '編輯',
    role: 'Edit',
    submenu: [
      {
        label: '複製',
        accelerator: 'CommandOrControl+C',
        role: 'copy',
      },
      {
        label: '貼上',
        accelerator: 'CommandOrControl+V',
        role: 'paste',
      },
      {
        label: '全選',
        accelerator: 'CommandOrControl+A',
        role: 'selectAll',
      },
      {
        label: '復原',
        accelerator: 'CommandOrControl+Z',
        role: 'undo',
      },
      {
        label: '重做',
        accelerator: 'CommandOrControl+R',
        role: 'redo',
      },
      { type: 'separator' },
      {
        label: '剪裁',
        accelerator: 'CommandOrControl+X',
        role: 'cut',
      }
    
    ]
  },

  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: '縮小',
        accelerator: 'CommandOrControl+M',
        role: 'minimize',
      },
      {
        label: '關閉',
        accelerator: 'CommandOrControl+W',
        role: 'close',
      },

    ]
  },
  {
    label: '幫助',
    role: 'help',
    submenu: [
      {
        label: '訪問網站',
        click() {console.log('hi!')}
      },
      {
        label: '開發者工具',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        }
      }
    ]
  }
]

// for mac
if (process.platform === 'darwin') {
  // get the name of the application
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: `About ${name}`,
        role: 'about',
      },
      { type: 'separator' },
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      { type: 'separator' },
      {
        label: `Hide ${name}`,
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      { type: 'separator' },
      {
        label: `Quit ${name}`,
        accelerator: 'Command+Q',
        click () { app.quit(); } ,
      },

    ]
  })

  const windowMenu = template.find(item => item.label === 'Window');
  windowMenu.role = 'window';
  windowMenu.submenu.push(
    { type: 'separator' },
    {
      label: 'Bring All to Front',
      role: 'front',
    }
  );
}


// use in main.js
module.exports = Menu.buildFromTemplate(template);
