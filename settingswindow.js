const Sentry = require('@sentry/electron');
const electron = require('electron');
const remote = electron.remote;

Sentry.init({
	dsn: 'https://3777e4687aa245f2b8030691ed48dc2f@sentry.io/1416510'
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
	};

	document.onreadystatechange = () => {
		if (document.readyState == "interactive") {
			init()
		}
	};
}

windowOpened();