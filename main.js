const {
    app
} = require('electron');
const vars = require('./util/variables');
const Sentry = require('@sentry/electron');

Sentry.init({
    dsn: 'https://3777e4687aa245f2b8030691ed48dc2f@sentry.io/1416510'
});

const Config = require('electron-store');
const userSettings = new Config({
    name: "userSettings"
});

app.requestSingleInstanceLock();

if (userSettings.get('autoStart') == undefined) userSettings.set('autoStart', true)
if (userSettings.get('autoUpdateCheck') == undefined) userSettings.set('autoUpdateCheck', true)

if (vars.PLATFORM == "darwin") {
    app.dock.setBadge("V" + vars.VERSION)
}

function appReady() {
    require('./tray/createTray').run();
    vars.createWindow();
}

app.on('ready', appReady);

app.on('window-all-closed', () => {});

app.on('activate', () => {
    if (mainWindow === null) {
        vars.createWindow();
    }
});