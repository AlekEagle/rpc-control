const {
    app,
    BrowserWindow
} = require('electron');
const Sentry = require('@sentry/electron');

Sentry.init({
    dsn: 'https://3777e4687aa245f2b8030691ed48dc2f@sentry.io/1416510'
});

const os = require('os');
var pjson = require('./package.json');
const Config = require('electron-store');
const userSettings = new Config({
    name: "userSettings"
});

let mainWindow;

global.PLATFORM = os.platform();
global.VERSION = pjson.productVersion;

if (pjson.devBuild)
    global.VERSIONSTRING = VERSION + "-DEV";
else
    global.VERSIONSTRING = VERSION;

global.BROWSERCONNECTIONSTATE = "NOT_CONNECTED";
global.TRAY = null;
global.MAINWINDOWSHOWING = false;

global.createWindow = () => {
    if (!MAINWINDOWSHOWING) {
        MAINWINDOWSHOWING = true;
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            icon: require('path').join(__dirname, '/icons/Discord-Logo-White.png')
        });
        mainWindow.loadFile('index.html');
        mainWindow.maximize();
        mainWindow.on('closed', () => {
            mainWindow = null;
            MAINWINDOWSHOWING = false;
        });
    }
}

function appReady() {
    require('./tray/createTray').run();
    createWindow();
}

app.on('ready', appReady);

app.on('window-all-closed', () => {});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});