const {
    app,
    BrowserWindow,
    dialog,
    Menu,
    shell } = require('electron');
const mainProcess = require('./main');

const createApplicationMenu = () => {
    const hasOneOrMoreWindows = !!BrowserWindow.getAllWindows().length;
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const hasFilePath = !!(focusedWindow && focusedWindow.getRepresentedFilename());

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
      },
      {
        label: '檔案',
        submenu: [
          {
            label: '新增文件',
            accelerator: 'CommandOrControl+N',
            click() {
              mainProcess.createWindow();
            }
          },
          {
            label: '打開文件',
            accelerator: 'CommandOrControl+O',
            click(item, focusedWindow) {
              if(focusedWindow) {
                mainProcess.getFileFromUser(focusedWindow)();
              }

              const newWindow = mainProcess.createWindow();

              newWindow.on('show', () => {
                mainProcess.getFileFromUser(focusedWindow)();
              })
            }
          },
          {
            label: '儲存',
            accelerator: 'CommandOrControl+S',
            enabled: hasOneOrMoreWindows,
            click(item, focusedWindow) {
              if(!focusedWindow) {
                return dialog.showErrorBox(
                  'Cannot Save or Export',
                  'There is currently no active document to save or export.'

                )
              }
              focusedWindow.webContents.send('save-markdown');
            }
          },
          {
            label: '轉存HTML',
            accelerator: 'Shift+CommandOrControl+S',
            enabled: hasOneOrMoreWindows,
            click(item, focusedWindow) {
              if(!focusedWindow) {
                return dialog.showErrorBox(
                  'Cannot Show File\'s Location',
                  'There is currently no active document to save or export.'

                )
              }
              focusedWindow.webContents.send('save-html');
            }
          },
          { type: 'separator' },
          {
            label: '顯示檔案',
            enabled: hasFilePath,
            accelerator: 'Shift+CommandOrControl+S',
            click(item, focusedWindow) {
              if(!focusedWindow) {
                return dialog.showErrorBox(
                  'Cannot Show File\'s Location',
                  'There is currently no active document to save or export.'

                )
              }
              focusedWindow.webContents.send('show-file');
            }
          },
          {
            label: '用預設編輯器打開檔案',
            accelerator: 'Shift+CommandOrControl+S',
            enabled: hasFilePath,
            click(item, focusedWindow) {
              if(!focusedWindow) {
                return dialog.showErrorBox(
                  'Cannot Show File\'s Location',
                  'There is currently no active document to save or export.'

                )
              }
              focusedWindow.webContents.send('open-in-default');
            },
          },
        ],
      },
    ];


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
   }

   const windowMenu = template.find(item => item.label === 'Window');
   windowMenu.role = 'window';
   windowMenu.submenu.push(
       { type: 'separator' },
       {
         label: 'Bring All to Front',
         role: 'front',
       }
   );
   return Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// use in main.js
//module.exports = Menu.buildFromTemplate(template);
module.exports = createApplicationMenu;
