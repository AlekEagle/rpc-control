const {
    app
} = require('electron');
const vars = require('./util/variables');
const Sentry = require('@sentry/electron');
const updater = require('./util/updateChecker');
require('./util/autoLaunch')();
Sentry.init({
    dsn: 'https://3777e4687aa245f2b8030691ed48dc2f@sentry.io/1416510'
});

const Config = require('electron-store');
const userSettings = new Config({
    name: "userSettings"
});
const RPCConfig = new Config({
    name: 'RPCConfig'
});

app.requestSingleInstanceLock();

if (userSettings.get('autoStart') == undefined) userSettings.set('autoStart', true);
if (userSettings.get('autoUpdateCheck') == undefined) userSettings.set('autoUpdateCheck', true);
if (userSettings.get('rpctype') == undefined) userSettings.set('rpctype', 'public');
if (userSettings.get('rpcid') == undefined) userSettings.set('rpcid', '');
if (RPCConfig.get('details') == undefined) RPCConfig.set('details', 'LargeText');
if (RPCConfig.get('state') == undefined) RPCConfig.set('state', 'SmallText');
if (RPCConfig.get('largeimagekey') == undefined) RPCConfig.set('largeimagekey', 'none');
if (RPCConfig.get('largeimagetext') == undefined) RPCConfig.set('largeimagetext', 'Discord RPC Controller');
if (RPCConfig.get('smallimagekey') == undefined) RPCConfig.set('smallimagekey', 'none');
if (RPCConfig.get('smallimagetext') == undefined) RPCConfig.set('smallimagetext', 'Discord RPC Controller');

if (vars.PLATFORM == "darwin") {
    app.dock.setBadge("V" + vars.VERSION)
}

function appReady() {
    require('./tray/createTray').run();
    vars.createWindow();
}

if (userSettings.get('autoUpdateCheck')) updater.checkForUpdate(true)

app.on('ready', appReady);

app.on('window-all-closed', () => {});

app.on('activate', () => {
    if (mainWindow === null) {
        vars.createWindow();
    }
});