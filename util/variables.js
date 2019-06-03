'use strict';
const {
    BrowserWindow,
    remote
} = require('electron');
const os = require('os');
var pjson = require('../package.json');
const chalk = require("chalk");

module.exports = {
    mainWindow: null,
    settingsWindow: null,
    PLATFORM: os.platform(),
    UPDATEAVAIABLE: '',
    VERSION: pjson.version,
    DEVBUILD: pjson.devBuild,
    VERSIONSTRING: pjson.devBuild ? pjson.version + "-DEV" : pjson.version,
    TRAY: null,
    CONSOLEPREFIX: chalk.bold(chalk.hex('#596cae')("Controller")) + chalk.hex('#ffffff')(": "),
    PUBLICRPCID: '556520551451983881',

    createWindow: () => {
        if (!module.exports.mainWindow) {
            module.exports.mainWindow = new BrowserWindow({
                width: 900,
                height: 600,
                frame: false,
                backgroundColor: '#212121',
                icon: require('path').join(__dirname, '../icons/icon.png')
            });
            module.exports.mainWindow.loadFile(require('path').join(__dirname, '../index.html'));
            module.exports.mainWindow.maximize();
            module.exports.mainWindow.on('closed', () => {
                module.exports.mainWindow = null;
            });
        } else {
            if (module.exports.mainWindow.isMinimized()) module.exports.mainWindow.restore();
            module.exports.mainWindow.focus();
        }
    },

    createSettingsWindow: () => {
        if (!module.exports.settingsWindow) {
            module.exports.settingsWindow = new remote.BrowserWindow({
                width: 800,
                height: 600,
                frame: false,
                backgroundColor: '#212121',
                icon: require('path').join(__dirname, '../icons/icon.png')
            });
            module.exports.settingsWindow.loadFile(require('path').join(__dirname, '../settings.html'));
            module.exports.settingsWindow.maximize();
            module.exports.settingsWindow.on('closed', () => {
                module.exports.settingsWindow = null;
            });
        } else {
            if (module.exports.settingsWindow.isMinimized()) module.exports.settingsWindow.restore();
            module.exports.settingsWindow.focus();
        }
    }
}