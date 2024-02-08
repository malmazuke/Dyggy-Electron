const { app, Tray, Menu, nativeImage, nativeTheme } = require('electron');
const path = require('path');
const fileSelect = require('./fileSelect.js');

let tray = null;

const iconPath = path.join(__dirname, 'assets', 'iconTemplate.png');
const iconDarkPath = path.join(__dirname, 'assets', 'iconTemplateDark.png');

app.whenReady().then(() => {
  if (app.dock) app.dock.hide();

  tray = new Tray(nativeImage.createFromPath(getIcon()));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Select file', type: 'normal', click: () => { fileSelect.launchFileSelect() } },
    { type: 'separator' },
    { label: 'Settings', type: 'normal', checked: true, click: () => { /* Add action for Settings */ } },
    { label: 'Quit', type: 'normal', click: () => { quitApplication() } }
  ]);
  
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
});

function quitApplication() {
  try {
    app.quit();
  } catch (err) {
    console.error("Error while quitting the application:", err);
  }
}

const getIcon = () => {
  // TODO: Return an `.ico` for Windows
  if  (process.platform === 'win32')  return iconPath;
  if (nativeTheme.shouldUseDarkColors) return iconDarkPath;
  return iconPath;
}
