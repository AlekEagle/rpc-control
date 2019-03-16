const {
    app,
    BrowserWindow
} = require('electron');
const Sentry = require('@sentry/electron');

Sentry.init({
    dsn: 'https://3777e4687aa245f2b8030691ed48dc2f@sentry.io/1416510'
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        icon: require('path').join(__dirname, '/icons/Discord-Logo-White.png')
    });
    mainWindow.loadFile('index.html');
    mainWindow.maximize();
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});