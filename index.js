const discord = require('discord.js');
const Command = require('./src/Command'), { CommandType, EvalCommand, HelpCommand } = require('./src/Command');
class Bot {
    constructor(token, defaultPrefix) {
        this.commands = {};
        this.token = Buffer.from(token).toString('base64');
        this.defaultPrefix = defaultPrefix;
        this.client = new discord.Client();
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
                    const args = msg.content.split(/ +/g).slice(1)
                    if (cb) {
                        cb(false, obj, {
                            msg,
                            args,
                            client: this.client,
                            discord,
                            bot: this
                        }, () => {
                            obj.run(msg, args, this.client, discord, this)
                        })
                    } else {
                        obj.run(msg, args, this.client, discord, this)
                    }
                } else {
                    if (cb) cb(true, {name: msg.content.replace(this.defaultPrefix, '').split(/ +/)[0]}, {
                        msg,
                        args,
                        client: this.client,
                        discord,
                        bot: this
                    })
                }
            }
        })
    }
}
module.exports = {
    Bot,
    Command: CommandType,
    HelpCommand,
    EvalCommand
};