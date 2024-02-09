const { dialog, BrowserWindow } = require('electron');
const os = require('os');
const fs = require('fs');

let defaultPath;
switch (os.platform()) {
  case 'win32':
    defaultPath = 'C:\\Windows';
    break;
  default:
    defaultPath = `${os.homedir()}/Library/Application Support/Bazecor/`;
    // TODO: Add this back in for selecting the alternate config to switch to (after having selected a primary config)
    // defaultPath = `${os.homedir()}/Dygma/Backups`;
}

function launchFileSelect() {
  // TODO: We currently add this workaround in order to get focus on the openFile dialog. Let's delete it once we add a custom tray-window
  let tempWindow = new BrowserWindow({ show: false, frame: false, transparent: true, skipTaskbar: true, alwaysOnTop: true, webPreferences: { nodeIntegration: true } });
  tempWindow.loadURL('about:blank');
  tempWindow.focus();

  dialog.showOpenDialog(tempWindow, { properties: ['openFile'], defaultPath, filters: [{ name: 'JSON Files', extensions: ['json'] }] })
    .then((result) => {
      if (result) {
        console.log(result);

        parseConfigFile(result.filePaths[0]);
      }
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      tempWindow.close();
    });
}

function parseConfigFile(fileName) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      console.log('Parsed JSON data:', parsedData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });
}

module.exports = { launchFileSelect };