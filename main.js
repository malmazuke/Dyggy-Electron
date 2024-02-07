const { app, Tray, Menu, nativeImage } = require('electron/main');
const path = require('path');
const fileSelect = require('./fileSelect.js');

let tray;

const iconPath = path.join(__dirname, 'assets', 'iconTemplate.png');
const iconDarkPath = path.join(__dirname, 'assets', 'iconTemplateDark.png');

app.whenReady().then(() => {
  tray = new Tray(nativeImage.createFromPath(iconPath));
  tray.setPressedImage(nativeImage.createFromPath(iconDarkPath));
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Select file', type: 'normal', click: () => { fileSelect.launchFileSelect() } },
    { type: 'separator' },
    { label: 'Settings', type: 'normal', checked: true, click: () => { /* Add action for Item3 */ } },
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
