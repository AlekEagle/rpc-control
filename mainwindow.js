const Sentry = require('@sentry/electron');
const electron = require('electron');
const vars = require('./util/variables');
const remote = electron.remote;

var map = {}
onkeydown = onkeyup = function (e) {
	map[e.keyCode] = e.type == 'keydown'
	if (map[16] && map[17] && map[67] && map[78] && map[79]) remote.getCurrentWebContents().toggleDevTools() // CTRL + SHIFT + C + O + N
}

const Config = require('electron-store');
const userSettings = new Config({
	name: "userSettings"
});
const RPCConfig = new Config({
	name: 'RPCConfig'
});

if (userSettings.get('sendErr') === true) {
    Sentry.init({
        dsn: 'https://3777e4687aa245f2b8030691ed48dc2f@sentry.io/1416510'
    });
    Sentry.configureScope(scope => {
        scope.setUser({
            id: userSettings.get('uniqueToken'),
            username: userSettings.get('sentryAnon') ? '' : userSettings.get('sentryUsername'),
            email: userSettings.get('sentryAnon') ? '' : userSettings.get('sentryEmail')
        })
    })
}

function windowOpened() {
	function init() {
		document.getElementById("min-btn").addEventListener("click", function (e) {
			var window = remote.getCurrentWindow();
			window.minimize();
		})

		document.getElementById("max-btn").addEventListener("click", function (e) {
			var window = remote.getCurrentWindow();
			if (window.isMaximized()) window.unmaximize();
			else window.maximize();
		})

		document.getElementById("close-btn").addEventListener("click", function (e) {
			var window = remote.getCurrentWindow();
			window.close();
		})
		if (userSettings.get('rpctype') === 'private') {
			document.getElementById('largeimagename').disabled = false;
			document.getElementById('smallimagename').disabled = false;
			document.getElementById('largeimagename').value = RPCConfig.get('largeimagekey');
			document.getElementById('smallimagename').value = RPCConfig.get('smallimagekey');
		} else if (userSettings.get('rpctype') === 'public') {
			document.getElementById('largeimagename').disabled = true;
			document.getElementById('smallimagename').disabled = true;
			document.getElementById('largeimagename').value = 'none';
			document.getElementById('smallimagename').value = 'none';
		}
		document.getElementById('largetext').addEventListener('change', e => {
			RPCConfig.delete('details');
			RPCConfig.set('details', e.target.value === '' ? e.target.placeholder : e.target.value)
		});
		document.getElementById('smalltext').addEventListener('change', e => {
			RPCConfig.delete('state');
			RPCConfig.set('state', e.target.value === '' ? e.target.placeholder : e.target.value)
		});
		document.getElementById('largeimagename').addEventListener('change', e => {
			RPCConfig.delete('largeimagekey');
			RPCConfig.set('largeimagekey', e.target.value === '' ? e.target.placeholder : e.target.value)
		});
		document.getElementById('smallimagename').addEventListener('change', e => {
			RPCConfig.delete('smallimagekey');
			RPCConfig.set('smallimagekey', e.target.value === '' ? e.target.placeholder : e.target.value)
		});
		document.getElementById('largeimagetext').addEventListener('change', e => {
			RPCConfig.delete('largeimagetext');
			RPCConfig.set('largeimagetext', e.target.value === '' ? e.target.placeholder : e.target.value)
		});
		document.getElementById('smallimagetext').addEventListener('change', e => {
			RPCConfig.delete('smallimagetext');
			RPCConfig.set('smallimagetext', e.target.value === '' ? e.target.placeholder : e.target.value)
		});

		document.getElementById('largetext').value = RPCConfig.get('details');
		document.getElementById('smalltext').value = RPCConfig.get('state');
		document.getElementById('largeimagetext').value = RPCConfig.get('largeimagetext');
		document.getElementById('smallimagetext').value = RPCConfig.get('smallimagetext');

		document.getElementById('openSettings').addEventListener("click", vars.createSettingsWindow);
	};

	document.onreadystatechange = () => {
		if (document.readyState == "interactive") {
			init()
		}
	};
}

windowOpened();