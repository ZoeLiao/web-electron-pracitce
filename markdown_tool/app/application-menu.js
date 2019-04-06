const {app, BrowserWindow, Menu, shell } = require('electron');
const mainProcess = require('./main');

const template = [
  {
    label: 'Edit',
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
  }
]

if (process.platform === 'darwin') {
  // get the name of the application
  const name = 'Fire Sale';
  template.unshift({ label: name });
}


// use in main.js
module.exports = Menu.buildFromTemplate(template);
