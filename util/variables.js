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
    VERSION: pjson.productVersion,
    VERSIONSTRING: pjson.devBuild ? module.exports.VERSION + "-DEV" : module.exports.VERSION,
    TRAY: null,
    CONSOLEPREFIX: chalk.bold(chalk.hex('#596cae')("Controller")) + chalk.hex('#ffffff')(": "),

    createWindow: () => {
        if (!module.exports.mainWindow) {
            module.exports.mainWindow = new BrowserWindow({
                width: 800,
                height: 600,
                frame: false,
                icon: require('path').join(__dirname, '../icons/Discord-Logo-White.png')
            });
            module.exports.mainWindow.loadFile(require('path').join(__dirname, '../index.html'));
            module.exports.mainWindow.maximize();
            module.exports.mainWindow.on('closed', () => {
                module.exports.mainWindow = null;
            });
        } else module.exports.mainWindow.focus()
    },

    createSettingsWindow: () => {
        if (!module.exports.settingsWindow) {
            module.exports.settingsWindow = new remote.BrowserWindow({
                width: 800,
                height: 600,
                frame: false,
                icon: require('path').join(__dirname, '../icons/Discord-Logo-White.png')
            });
            module.exports.settingsWindow.loadFile(require('path').join(__dirname, '../settings.html'));
            module.exports.settingsWindow.on('closed', () => {
                module.exports.settingsWindow = null;
            });
        } else module.exports.settingsWindow.focus()
    }
}