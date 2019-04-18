const { remote, ipcRenderer } = require('electron');
const { Menu } = remote;
const mainProcess = remote.require('./main.js');
const currentWindow = remote.getCurrentWindow();

const marked = require('marked');
const path = require('path');

let filePath = null;
let originalContent = '';

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = (markdown) => {
  // To avoid accidetal injections
  htmlView.innerHTML = marked(markdown, { sanitize: true});
};

// keyup: detect the keyboard is pressed or not
markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
  updateUserInterface(currentContent !== originalContent);
});

newFileButton.addEventListener('click', () => {
  mainProcess.createWindow();
});

openFileButton.addEventListener('click', () => {
  //mainProcess.getFileFromUser();
  mainProcess.getFileFromUser(currentWindow);
})

ipcRenderer.on('file-opened', (event, file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHtml(content);

  updateUserInterface();
});

const updateUserInterface = (isEdited) => {
  let title = 'Fire Sale';
  if (filePath) { title = `${path.basename(filePath)} - ${title}`; }
  if (isEdited) { title = `${title} (Edited)`; }

  /// programmatically manipulate the window’s title
  currentWindow.setTitle(title);
  currentWindow.setDocumentEdited(isEdited);

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;
};

saveHtmlButton.addEventListener('click', () => {
  mainProcess.saveHtml(currentWindow, htmlView.innerHTML);
});

saveMarkdownButton.addEventListener('click', () => {
  mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value);
});

revertButton.addEventListener('click', () => {
  markdownView.value = originalContent;
  renderMardownToHtml(originalContent);
});

document.addEventListener('dragstart', event => event.preventDefault());
document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('dragleave', event => event.preventDefault());
document.addEventListener('drop', event => event.preventDefault());

const getDraggedFile = (event) => event.dataTransfer.items[0];
const getDroppedFile = (event) => event.dataTransfer.files[0];

const fileTypeIsSupported = (file) => {
  return ['text/plain', 'text/markdown'].includes(file.type);
};

markdownView.addEventListener('dragover', (event) => {
  const file = getDraggedFile(event);

  if (fileTypeIsSupported(file)){
    markdownView.classList.add('drag-over');
  } else {
    markdownView.classList.add('drag-error');
  }
});

markdownView.addEventListener('dragleave', () => {
  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
});

markdownView.addEventListener('drop', (event) => {
  const file = getDroppedFile(event);

  if (fileTypeIsSupported(file)) {
    mainProcess.openFile(currentWindow, file.path);
  } else {
    alert('The file type is not supported');
  }
  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
})

const renderFile = (file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHtml(content);

  showFileButton.disabled = false;
  openInDefaultButton.disabled = false;

  updateUserInterface(false);
}

//  set up two IPC listeners and send message
ipcRenderer.on('file-opened', (event, file, content) => {
  if (currentWindow.isDocumentEdited()){
    const result = remote.dialog.showMessageBox(currentWindow, {
      type: 'warning',
      title: 'Are You Sure You Want To Overwrite Current Unsaved Changes?',
      message: 'Opening a new file in this window will overwrite your unsaved changes. Open this file anyway?',
      buttons: [
        'Yes',
        'Cancel',
      ],
      defaultId: 0,
      cancelId: 1
    });

    if (result === 1) { return; }
  }
  renderFile(file, content);
});

ipcRenderer.on('file-changed', (event, file, content) => {
  if (currentWindow.isDocumentEdited()){
    const result = remote.dialog.showMessageBox(currentWindow, {
      type: 'warning',
      title: 'Are You Sure You Want To Overwrite Current Unsaved Changes?',
      message: 'Another application has changed this file. Load changes?',
      buttons: [
        'Yes',
        'Cancel',
      ],
      defaultId: 0,
      cancelId: 1
    });

    if (result === 1) { return; }
  }

  renderFile(file, content);
});

ipcRenderer.on('save-markdown', () => {
  mainProcess.saveMarkdown(currentWindow, filePath, markdownView.value);
});

ipcRenderer.on('save-html', () => {
  mainProcess.saveHtml(currentWindow, filePath, markdownView.value);
});


markdownView.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  //markdownContextMenu.popup();
  createContextMenu().popup();
})

//const markdownContextMenu = Menu.buildFromTemplate([
const createContextMenu = () => {
    return Menu.buildFromTemplate([
      { label: '打開檔案', click() { mainProcess.getFileFromUser(); } },
      { label: '從資料夾打開檔案', click: showFile, enabled: !!filePath },
      { label: '從預設編輯器打開檔案', click: openInDefaultApplication },
      { type: 'separator' },
      { label: '剪裁', role: 'cut' },
      { label: '複製', role: 'copy' },
      { label: '貼上', role: 'paste' },
      { label: '全選', role: 'selectall' },
    ])
}


const showFile = () => {
  if(!filePath) {
    return alert('This file has not been saved to the filesystem.');
  }
  shell.showItemInFolder(filePath);
}

const openInDefaultApplication = () => {
  if(!filePath) {
    return alert('This file has not been saved to the filesystem.');
  }
  shell.openItem(filePath);
}

showFileButton.addEventListener('click', showFile);
openInDefaultButton.addEventListener('click', openInDefaultApplication);

ipcRenderer.on('show-file', showFile);
ipcRenderer.on('open-in-defualt', openInDefaultApplication);
