# web-electron-pracitce

- Electron: https://electronjs.org/
- Electron is a framework for creating native applications with web technologies like JavaScript, HTML, and CSS.
- Reference: [Electron IN ACTION](https://www.manning.com/books/electron-in-action)

# Set up a small project
- `mkdir <project_name>`
- `cd <project_name>`
- `mkdir app`
- `touch app/main.js app/renderer.js app/style.css app/index.html`
- `npm init` Note: If you want to skip the process, add `--yes`
- `npm install electron --save` Note: 'save' will add the installed package to the list of dependencies in the package.json.
- `vim package.json` and Add `"start": "electron ."` in `"scripts"`,
- `npm start`

# How to Debug
- Open View and chocie Toggle Developer Tool
