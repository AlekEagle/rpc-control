'use strict';
const DiscordRPC = require('discord-rpc');
const vars = require('./variables');
const Config = require('electron-store');
const chalk = require("chalk");
var id;
const userSettings = new Config({
    name: "userSettings"
});
const RPCConfig = new Config({
    name: 'RPCConfig'
});

module.exports = () => {
    if (userSettings.get('rpctype') === 'public') id = vars.PUBLICRPCID;
    else if (userSettings.get('rpctype') === 'private') id = userSettings.get('rpcid');

    const rpc  = new DiscordRPC.Client({transport: 'ipc'});
    const startTimestamp = new Date();

    async function setActivity() {
        if (!rpc || !vars.mainWindow) {
            return;
        }

        rpc.setActivity({
            details: RPCConfig.get('details'),
            state: RPCConfig.get('state'),
            startTimestamp,
            largeImageKey: RPCConfig.get('largeimagekey'),
            largeImageText: RPCConfig.get('largeimagetext'),
            smallImageKey: RPCConfig.get('smallimagekey'),
            smallImageText: RPCConfig.get('smallimagetext'),
            instance: false
        });
    }

    rpc.on('ready', () => {
        setActivity();

        setInterval(() => {
            setActivity();
        }, 15e3);
    });

    rpc.login({clientId: id}).then(() => {
        console.log(vars.CONSOLEPREFIX + chalk.cyan("Connected to RPC!"))
    }).catch(err => console.error(vars.CONSOLEPREFIX + chalk.red(err)));
}