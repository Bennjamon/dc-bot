import discord from 'discord.js';
import Command, { CommandType } from './src/Command'
class Bot {
    constructor(token, defaultPrefix) {
        this.commands = {};
        this.hasDB = false;
        this.token = Buffer.from(token).toString('base64');
        this.defaultPrefix = defaultPrefix;
        this.client = new discord.Client();
        this.listeningCommands = false
    }
    init() {
        this.client.on("ready", () => {
            console.log(`${this.client.user.username} is connected`);
        });
        this.client.login(Buffer.from(this.token, 'base64').toString())
    }
    message(callback) {
        this.client.on("message", async (msg) => {
            if (msg.content.includes(Buffer.from(this.token, 'base64').toString())) {
                await msg.delete()
                await msg.channel.send(`${msg.author} no pongas mi token`);
                return;
            }
            if (!msg.author.bot) {
                callback(msg);
            }
        });
    }
    addCommand(...commands) {
        commands.forEach(command => {
            if (Command.isCommand(command)) {
                if (command.constructor != CommandType) command = new CommandType(command)
                if (this.commands[command.name.toLowerCase()]) {
                    throw new Error(`The command "${command.name.toLowerCase()}" already has declared`)
                } else {
                    this.commands[command.name.toLowerCase()] = command
                }
            }
        })
        return this
    }
    listenCommands(cb) {
        this.client.on("message", msg => {
            if (!msg.author.bot && msg.content.startsWith(this.defaultPrefix)) {
                const obj = this.commands[msg.content.replace(this.defaultPrefix, '').split(/ +/)[0].toLowerCase()]
                if (obj) {
                    if (cb) {
                        cb(false, obj, {
                            msg,
                            args: msg.content.slice(msg.content.indexOf(" ") + 1).split(/ +/g),
                            client: this.client,
                            discord,
                            bot: this
                        }, () => {
                            obj.run(msg, msg.content.replace(this.defaultPrefix, '').replace(msg.content.replace(this.defaultPrefix, '').split(/ +/)[0], '').split(/ +/g), this.client, discord, this)
                        })
                    } else {
                        obj.run(msg, msg.content.replace(this.defaultPrefix, '').replace(msg.content.replace(this.defaultPrefix, '').split(/ +/g)[0], ''), this.client, discord, this)
                    }
                } else {
                    if (cb) cb(true, {name: msg.content.replace(this.defaultPrefix, '').split(/ +/)[0]}, {
                        msg,
                        args: msg.content.slice(msg.content.indexOf(" ") + 1).split(/ +/),
                        client: this.client,
                        discord,
                        bot: this
                    })
                }
            }
        })
    }
}
export const EvalCommand = Command.EvalCommand
export const Bot = Bot