const Sentry = require('@sentry/electron');
const electron = require('electron');
const remote = electron.remote;

Sentry.init({
	dsn: 'https://3777e4687aa245f2b8030691ed48dc2f@sentry.io/1416510'
});
const Config = require('electron-store');
const userSettings = new Config({
	name: "userSettings"
});
var map = {}
onkeydown = onkeyup = function (e) {
	map[e.keyCode] = e.type == 'keydown'
	if (map[16] && map[17] && map[67] && map[78] && map[79]) remote.getCurrentWebContents().toggleDevTools() // CTRL + SHIFT + C + O + N
}

function windowOpened() {
	function init() {
		document.getElementById("min-btn").addEventListener("click", function (e) {
			var window = remote.getCurrentWindow()
			window.minimize();
		})

		document.getElementById("max-btn").addEventListener("click", function (e) {
			var window = remote.getCurrentWindow()
			if (window.isMaximized()) window.unmaximize()
			else window.maximize()
		})

		document.getElementById("close-btn").addEventListener("click", function (e) {
			var window = remote.getCurrentWindow()
			window.close()
		})
		document.getElementById('discordapp').addEventListener('click', (e) => {
			electron.shell.openExternal('https://discordapp.com/developers/applications/')
		})
		document.getElementById('rpcClient').addEventListener('change', (e) => {
			if (e.target.value == 'Private RPC') {
				document.getElementById('clientidText').hidden = false;
				document.getElementById('clientid').hidden = false;
			} else if (e.target.value == 'Public RPC') {
				document.getElementById('clientidText').hidden = true;
				document.getElementById('clientid').hidden = true;
			}
		})
		document.getElementById('clientid').value = userSettings.get('rpcid');
		if (userSettings.get('rpctype') === 'public') {
			document.getElementById('clientidText').hidden = true;
			document.getElementById('clientid').hidden = true;
		} else if (userSettings.get('rpctype') === 'private') {
			document.getElementById('rpcClient').value = 'Private RPC'
		}
		document.getElementById('save').addEventListener('click', (e) => {
			if (document.getElementById('rpcClient').value === 'Private RPC') {
				userSettings.delete('rpctype');
				userSettings.set('rpctype', 'private');
			} else if (document.getElementById('rpcClient').value === 'Public RPC') {
				userSettings.delete('rpctype');
				userSettings.set('rpctype', 'public');
			}
			userSettings.delete('rpcid');
			userSettings.set('rpcid', document.getElementById('clientid').value);
			var window = remote.getCurrentWindow()
			window.close()
		})

	};

	document.onreadystatechange = () => {
		if (document.readyState == "interactive") {
			init()
		}
	};
}

windowOpened();