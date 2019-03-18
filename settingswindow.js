const Sentry = require('@sentry/electron');
const electron = require('electron');
const remote = electron.remote;

const Config = require('electron-store');
const userSettings = new Config({
	name: "userSettings"
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
var map = {}
onkeydown = onkeyup = function (e) {
	map[e.keyCode] = e.type == 'keydown'
	if (map[16] && map[17] && map[67] && map[78] && map[79]) remote.getCurrentWebContents().toggleDevTools() // CTRL + SHIFT + C + O + N
}
function saveSettings() {
	if (document.getElementById('rpcClient').value === 'Private RPC') {
		userSettings.delete('rpctype');
		userSettings.set('rpctype', 'private');
	} else if (document.getElementById('rpcClient').value === 'Public RPC') {
		userSettings.delete('rpctype');
		userSettings.set('rpctype', 'public');
	}
	userSettings.delete('sendErr');
	userSettings.set('sendErr', document.getElementById('senderr').checked);
	userSettings.delete('sentryAnon');
	userSettings.set('sentryAnon', document.getElementById('sentryanon').checked);
	userSettings.delete('autoLaunch');
	userSettings.set('autoLaunch', document.getElementById('startup').checked);
	userSettings.delete('mainWindowOnStart');
	userSettings.set('mainWindowOnStart', document.getElementById('mainwindowstartup').checked);
	userSettings.delete('rpcid');
	userSettings.set('rpcid', document.getElementById('clientid').value);
	userSettings.delete('sentryUsername');
	userSettings.set('sentryUsername', document.getElementById('username').value);
	userSettings.delete('sentryEmail');
	userSettings.set('sentryEmail', document.getElementById('email').value);
}

function windowOpened() {
	function init() {
		document.getElementById("min-btn").addEventListener("click", function (e) {
			var window = remote.getCurrentWindow()
			window.minimize();
		});

		document.getElementById("max-btn").addEventListener("click", function (e) {
			var window = remote.getCurrentWindow()
			if (window.isMaximized()) window.unmaximize()
			else window.maximize()
		});

		document.getElementById("close-btn").addEventListener("click", function (e) {
			saveSettings();
			var window = remote.getCurrentWindow()
			window.close()
		});
		document.getElementById('discordapp').addEventListener('click', (e) => {
			electron.shell.openExternal('https://discordapp.com/developers/applications/')
		});
		document.getElementById('rpcClient').addEventListener('change', (e) => {
			if (e.target.value == 'Private RPC') {
				document.getElementById('clientidText').hidden = false;
				document.getElementById('clientid').hidden = false;
			} else if (e.target.value == 'Public RPC') {
				document.getElementById('clientidText').hidden = true;
				document.getElementById('clientid').hidden = true;
			}
		});
		document.getElementById('token').innerText = `Your sentry.io token is: ${userSettings.get('uniqueToken')}`;
		document.getElementById('username').value = userSettings.get('sentryUsername');
		document.getElementById('email').value = userSettings.get('sentryEmail');
		document.getElementById('senderr').checked = userSettings.get('sendErr');
		document.getElementById('sentryanon').checked = userSettings.get('sentryAnon');
		document.getElementById('senderr').addEventListener('change', (e) => {
			if (e.target.checked) {
				document.getElementById('privacyinfo').hidden = false;
			}else {
				document.getElementById('privacyinfo').hidden = true;
			}
		});
		document.getElementById('sentryanon').addEventListener('change', (e) => {
			if (!e.target.checked) {
				document.getElementById('username').disabled = false;
				document.getElementById('email').disabled = false;
			}else {
				document.getElementById('username').disabled = true;
				document.getElementById('email').disabled = true;
			}
		});
		if (!userSettings.get('sentryAnon')) {
			document.getElementById('username').disabled = false;
			document.getElementById('email').disabled = false;
		}else {
			document.getElementById('username').disabled = true;
			document.getElementById('email').disabled = true;
		}
		if (userSettings.get('sendErr')) {
			document.getElementById('privacyinfo').hidden = false;
		}else {
			document.getElementById('privacyinfo').hidden = true;
		}
		document.getElementById('clientid').value = userSettings.get('rpcid');
		document.getElementById('startup').checked = userSettings.get('autoLaunch');
		document.getElementById('mainwindowstartup').checked = userSettings.get('mainWindowOnStart');
		if (userSettings.get('rpctype') === 'public') {
			document.getElementById('clientidText').hidden = true;
			document.getElementById('clientid').hidden = true;
		} else if (userSettings.get('rpctype') === 'private') {
			document.getElementById('rpcClient').value = 'Private RPC'
		}
		document.getElementById('save').addEventListener('click', (e) => {
			saveSettings();
			remote.app.relaunch();
			remote.app.exit(0);
		});
	};

	document.onreadystatechange = () => {
		if (document.readyState == "interactive") {
			init()
		}
	};
}

windowOpened();