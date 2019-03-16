const path = require('path')
const {
  Tray,
  Menu,
  MenuItem
} = require('electron')
var cfu = () => require('../util/updateChecker').checkForUpdate(true, true)
exports.run = () => {
  TRAY = new Tray(path.join(__dirname, "../icons/Discord-Logo-White.png"))
  TRAY.setToolTip(`Discord RPC Controller V${VERSIONSTRING}`)
  var menuBarMenu = new Menu()
  menuBarMenu.append(new MenuItem({
    label: `Discord RPC Controller | V${VERSIONSTRING}`,
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
    click: createWindow
  }))
  menuBarMenu.append(new MenuItem({
    role: "quit"
  }))
  TRAY.setContextMenu(menuBarMenu)
}