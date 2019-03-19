'use strict';
const {Notification} = require('electron');
const DiscordRPC = require('discord-rpc');
const vars = require('./variables');
const Config = require('electron-store');
const chalk = require("chalk");
const path = require('path');
var id;
var timeout;
var setActivityLoop;
const userSettings = new Config({
    name: "userSettings"
});
const RPCConfig = new Config({
    name: 'RPCConfig'
});
var rpc;

module.exports = () => {
    if (userSettings.get('rpctype') === 'public') id = vars.PUBLICRPCID;
    else if (userSettings.get('rpctype') === 'private') id = userSettings.get('rpcid');

    const startTimestamp = new Date();

    async function setActivity() {
        if (!rpc) {
            return;
        }
        console.log(vars.CONSOLEPREFIX + chalk.cyan("Pushing update to RPC..."));
        timeout = setTimeout(() => {
            const disconnectedNotif = new Notification({
                title: 'Discord RPC Controller',
                body: `Disconnected from Discord! Trying to reconnect!`,
                silent: true,
                icon: path.join(__dirname, "../icons/trayicon.png")
            });
            disconnectedNotif.on('click', vars.createWindow);
            disconnectedNotif.show();
            console.warn(vars.CONSOLEPREFIX + chalk.red('Pushing RPC update timed-out, assuming Discord disconnected.'));
            clearInterval(setActivityLoop)
            rpc.destroy().catch(err => console.error(vars.CONSOLEPREFIX + chalk.red(err)));
            login()
        }, 5e3)
        rpc.setActivity({
            details: RPCConfig.get('details'),
            state: RPCConfig.get('state'),
            startTimestamp,
            largeImageKey: userSettings.get('rpctype') === 'public' ? 'none' : RPCConfig.get('largeimagekey'),
            largeImageText: RPCConfig.get('largeimagetext'),
            smallImageKey: userSettings.get('rpctype') === 'public' ? 'none' : RPCConfig.get('smallimagekey'),
            smallImageText: RPCConfig.get('smallimagetext'),
            instance: false
        }).then(() => {
            console.log(vars.CONSOLEPREFIX + chalk.green("Update pushed to RPC!"));
            clearTimeout(timeout);
        }).catch(err => {
            console.error(vars.CONSOLEPREFIX + chalk.red(err));
            clearInterval(setActivityLoop);
            rpc.destroy().catch(err => console.error(vars.CONSOLEPREFIX + chalk.red(err)));
            login();
        });
    }

    function login() {
        rpc  = new DiscordRPC.Client({transport: 'ipc'});
        rpc.on('connected', () => {
            setActivity();
    
            setActivityLoop = setInterval(() => {
                setActivity();
            }, 15e3);
        });
        rpc.login({clientId: id}).then(() => {
            console.log(vars.CONSOLEPREFIX + chalk.cyan("Connected to RPC!"));
            const connectedNotif = new Notification({
                title: 'Discord RPC Controller',
                body: `Connected to the Discord RPC tubes!`,
                silent: true,
                icon: path.join(__dirname, "../icons/trayicon.png")
            });
            connectedNotif.on('click', vars.createWindow);
            connectedNotif.show();
        }).catch(err => {
            console.error(vars.CONSOLEPREFIX + chalk.red(err));
            setTimeout(() => {
                login();
            }, 5e3)
        });
    }
    login();
}