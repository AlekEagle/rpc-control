const DiscordRPC = require('discord-rpc')
const Config = require('electron-store');
const userSettings = new Config({
  name: "userSettings"
});
const RPCConfig = new Config({
  name: 'RPCConfig'
});