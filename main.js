const { app, Tray, Menu, nativeImage, nativeTheme, BrowserWindow } = require('electron');
const path = require('path');
const fileSelect = require('./fileSelect.js');
const { KeyboardConnectionManager } = require('./KeyboardConnectionManager.js');

let keyboardConnection = new KeyboardConnectionManager();
let mainWindow;
let tray;

const iconPath = path.join(__dirname, 'assets', 'iconTemplate.png');
const iconDarkPath = path.join(__dirname, 'assets', 'iconTemplateDark.png');

app.on('ready', appReady);

function appReady() {
  if (app.dock) app.dock.hide();
  
  createMainWindow();
  createTray();
}

function createMainWindow() {
  mainWindow = new BrowserWindow( { show: false, webPreferences: { nodeIntegration: true } } );
}

function createTray() {
  tray = new Tray(nativeImage.createFromPath(getIcon()));
  
  updateTrayMenu("Disconnected"); // Initial status
  
  keyboardConnection.on('connecting', () => {
    updateTrayMenu("Connecting");
    // Optionally, show a notification for connection status
  });
  
  keyboardConnection.on('connected', () => {
    updateTrayMenu("Connected");
    // TODO: Show a notification for connection status
  });
  
  keyboardConnection.on('disconnecting', () => {
    updateTrayMenu("Disconnecting");
    // TODO: Show a notification for connection status
  });
  
  keyboardConnection.on('disconnected', () => {
    updateTrayMenu("Disconnected");
    // TODO: Show a notification for connection status
  });
  
  keyboardConnection.on('error', () => {
    updateTrayMenu("Error");
    // TODO: Show a notification for connection status
  });
}

function updateTrayMenu(connectionStatus) {
  let connectMenuItem = {
    label: `Keyboard: ${connectionStatus}`,
    type: 'normal',
    enabled: connectionStatus === "Disconnected",
    click: () => {
      if (connectionStatus === "Disconnected") {
        keyboardConnection.tryConnect();
      }
    }
  };
  
  const contextMenu = Menu.buildFromTemplate([
    connectMenuItem,
    { label: 'Select file', type: 'normal', click: () => { fileSelect.launchFileSelect() } },
    { type: 'separator' },
    { label: 'Settings', type: 'normal', click: () => { /* Add action for Settings */ } },
    { label: 'Quit', type: 'normal', click: () => { quitApplication() } }
  ]);
  
  tray.setToolTip(`Dygma Defy: ${connectionStatus}`);
  tray.setContextMenu(contextMenu);
}

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
