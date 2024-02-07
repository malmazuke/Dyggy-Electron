const { dialog } = require('electron');
const os = require('os');

let defaultPath;
switch (os.platform()) {
  case 'win32':
    defaultPath = 'C:\\Windows';
    break;
  default:
    defaultPath = `${os.homedir()}/Dygma/Backups`;
}

function launchFileSelect() {
  dialog.showOpenDialog({ properties: ['openFile'], defaultPath, filters: [{ name: 'JSON Files', extensions: ['json'] }] })
    .then((result) => {
      if (result) {
        console.log(result);
      }
    });
}

module.exports = { launchFileSelect };