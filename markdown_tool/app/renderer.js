const { remote, ipcRenderer } = require('electron');
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

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
});

openFileButton.addEventListener('click', () => {
  //mainProcess.getFileFromUser();
  mainProcess.getFileFromUser(currentWindow);
  //mainProcess.createWindow();
})

ipcRenderer.on('file-opened', (event, file, content) => {
  filePath = file;
  originalContent = content;

  markdownView.value = content;
  renderMarkdownToHtml(content);

  updateUserInterface();
});

const updateUserInterface = () => {
  let title = 'Fire Sale';
  if (fileiPath) { title = `${path.basename(filePath)} - ${title}`;}
  // programmatically manipulate the window’s title
  currentWindow.setTitle(title);
}
