const path = require('path');
const vars = require('../util/variables');
const {
  Tray,
  Menu,
  MenuItem
} = require('electron')
var cfu = () => require('../util/updateChecker').checkForUpdate(true, true)
exports.run = () => {
  vars.TRAY = new Tray(path.join(__dirname, "../icons/Discord-Logo-White.png"))
  vars.TRAY.setToolTip(`Discord RPC Controller V${vars.VERSIONSTRING}`)
  var menuBarMenu = new Menu()
  menuBarMenu.append(new MenuItem({
    label: `Discord RPC Controller | V${vars.VERSIONSTRING}`,
    enabled: false,
    icon: path.join(__dirname, "../icons/Discord-Logo-White.png")
  }))
  menuBarMenu.append(new MenuItem({
    type: "separator"
  }))
  menuBarMenu.append(new MenuItem({
    click: cfu,
    label: "Check for updates"
  }))
  menuBarMenu.append(new MenuItem({
    label: "Open Main Window",
    click: vars.createWindow
  }))
  menuBarMenu.append(new MenuItem({
    label: "Open Settings",
    click: vars.createSettingsWindow
  }))
  menuBarMenu.append(new MenuItem({
    type: "separator"
  }))
  menuBarMenu.append(new MenuItem({
    role: "quit"
  }))
  vars.TRAY.setContextMenu(menuBarMenu)
}