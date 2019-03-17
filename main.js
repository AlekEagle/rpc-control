const {
    app
} = require('electron');
const RPCClient = require('./util/presenceHandler');
const vars = require('./util/variables');
const Sentry = require('@sentry/electron');
const updater = require('./util/updateChecker');
const chalk = require("chalk");
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
if (userSettings.get('mainWindowOnStart') == undefined) userSettings.set('mainWindowOnStart', true);
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
    if (vars.mainWindow === null && userSettings.get('mainWindowOnStart')) {
        console.log(vars.CONSOLEPREFIX + chalk.green('Opening control window on start!'));
        vars.createWindow();
    }else if (vars.mainWindow !== null) {
        console.log(vars.CONSOLEPREFIX + chalk.red('Control Window already open!'));
    }else if (!userSettings.get('mainWindowOnStart')) {
        console.log(vars.CONSOLEPREFIX + chalk.yellow('Staying minimized!'));
    }
}

if (userSettings.get('autoUpdateCheck')) updater.checkForUpdate(true)

//start RPC connection
RPCClient()

app.on('ready', appReady);

app.on('window-all-closed', () => {});

app.on('activate', () => {
    vars.createWindow()
});