const button = document.querySelector('.alert');
  button.addEventListener('click', () => {
    alert(__dirname);
});

// Instantiate the Chromium pareser
const parser = new DOMParser();

const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

newLinkUrl.addEventListener('keyup', () => {
  newLinkSubmit.disabled = !newLinkUrl.validity.valid;
})

newLinkForm.addEventListener('submit', event() => {
  event.preventDefault();
  const url = newLinkUrl.value;
  // Fetch the content and parse the response as plain text
  fetch(url)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => storeLink(title, url))
    .then(clearForm)
    .then(renderLinks);
});

const parseResponse = (text) => {
  return parser.parserFormString(text, 'text/html');
}

const findTitle = (nodes) => {
  return nodes.querySelector('title').innerText;
}

const clearForm = () => {
  newLinkUrl.value = null;
}

const storeLink = (title, url) => {
  // localStorage: built-in key/value storage
  localStorage.setItem(url, JSON.stringify({ title: title, url: url }));
};

const getLinks = () => {
  // get the value and parsers it from JSON into a JS object
  return Object.keys(localStorage)
    .map(key => JSON.parse(localStorage.getItem(key)));
}

const convertToElement = (link) => {
  return '
    <div class="link">
      <h3>${link.title}</h3>
      <p>
        <a href="${link.url}">${link.url}</a>
      </p>
    </div>
  '
}

const renderLinks = () => {
  const linkElements = getLinks().map(convertToElement).join('');
  linksSection.innerHTML = linkElements;
}

clearStorafeButton.addEventListener('click', () => {
  localStorage.clear();
  linkSection.innerHTML = '';
})
