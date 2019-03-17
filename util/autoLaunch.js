//* Declare needed constants
const {
  app
} = require('electron')
const chalk = require("chalk")
const vars = require('./variables');
//* Setup electron-store
const AutoLaunch = require('auto-launch')

const Config = require('electron-store');
const userSettings = new Config({
  name: "userSettings"
});

module.exports = async () => {
  console.log(vars.CONSOLEPREFIX + chalk.yellow("Creating autostart entry..."))
  let autoLaunch = new AutoLaunch({
    name: 'Discord RPC Controller',
    path: app.getPath('exe'),
    isHidden: true
  });
  console.log(vars.CONSOLEPREFIX + chalk.yellow("Checking if User wants app to autostart..."));
  if (userSettings.get('autoLaunch') == undefined || userSettings.get('autoLaunch') == true) {
    userSettings.set('autoLaunch', true)
    autoLaunch.isEnabled().then(async (isEnabled) => {
      if (!isEnabled) autoLaunch.enable();
      console.log(vars.CONSOLEPREFIX + chalk.green("Enabled autostart."))
    })
    .catch(function (err) {
      console.log(vars.CONSOLEPREFIX + chalk.red("Error while adding App to autostart."))
    })
  }else if (userSettings.get('autoLaunch') === false) {
    autoLaunch.isEnabled().then(async (isEnabled) => {
      if (isEnabled) autoLaunch.disable();
      console.log(vars.CONSOLEPREFIX + chalk.green("Disabled autostart."))
    })
    .catch(function (err) {
      console.log(vars.CONSOLEPREFIX + chalk.red("Error while removing App from autostart."))
    })
  }
}