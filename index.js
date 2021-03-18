const discord = require('discord.js');
const fs = require('fs');
const Command = require('./src/Command'), { CommandType, EvalCommand, HelpCommand } = require('./src/Command');
class Bot {
    constructor(token, defaultPrefix) {
        this.hasDB = false;
        this.db = {users: fs.existsSync("DB/users.json")? require('./DB/users.json'): undefined, guilds: fs.existsSync("DB/guilds.json")? require('./DB/guilds.json'): undefined};
        this.commands = {};
        this.client = new discord.Client();

        this.onreadys = [
            () => {
                console.log(`${this.client.user.username} is connected`);
            }
        ]

        if (arguments.length > 1) {
            this.token = Buffer.from(token).toString('base64');
            this.defaultPrefix = defaultPrefix;
        } else {
            if (token.token) {
                this.token = Buffer.from(token.token).toString("base64")
            } else {
                throw new TypeError("Set the token of your bot")
            }

            if (token.prefix) {
                this.defaultPrefix = token.prefix
            } else {
                throw new TypeError("Set the prefx of your bot")
            } 

            if (token.dbOptions) {
                let user = token.dbOptions.user
                let guild = token.dbOptions.guild
                this.setDB({
                    user: Boolean(user),
                    guild: Boolean(guild)
                }, guild? (guild.add? guild.add : (g) => ({
                    prefix: token.prefix,
                    id: g.id,
                    name: g.name,
                    ownerID: g.ownerID,})): null, user? (user.add? user.add: (u) => ({
                        id: u.id,
                        name: u.username, 
                        tag: u.tag
                    })): null)
            }
            
        }
    }

    init() {
        this.client.on("ready", () => {
            this.onreadys.forEach(fn => fn())
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
                const userDB = this.getUserById(msg.author.id)
                const guildDB = this.getGuildById(msg.guild.id)
                if (obj) {
                    const args = msg.content.split(/ +/g).slice(1)
                    if (cb) {
                        cb(false, obj, {
                            msg,
                            userDB,
                            guildDB,
                            args,
                            client: this.client,
                            discord,
                            bot: this
                        }, () => {
                            obj.run(msg, args, userDB, guildDB, this.client, discord, this)
                        })
                    } else {
                        obj.run(msg, args, userDB, guildDB, this.client, discord, this)
                    }
                } else {
                    if (cb) cb(true, {name: msg.content.replace(this.defaultPrefix, '').split(/ +/)[0]}, {
                        msg,
                        args,
                        userDB,
                        guildDB,
                        client: this.client,
                        discord,
                        bot: this
                    })
                }
            }
        })
    }
    setDB(config, guildDB, userDB) {
        this.hasDB = true;
        if (!fs.existsSync("DB")) fs.mkdirSync("DB")
        if (config.user) {
            this.db.users = {}
            this.onreadys.push(() => {
                this.client.users.cache.forEach(u => {
                    if (!this.db.users[u.id]) this.db.users[u.id] = userDB(u)
                })
                fs.writeFileSync("DB/users.json", JSON.stringify(this.db.users, null, "\t"))
            })
            this.client.on("guildMemberAdd", ({ user }) => {
                if (!this.db.users[user.id]) this.db.users[user.id] = userDB(user)
                fs.writeFileSync("DB/users.json", JSON.stringify(this.db.users, null, "\t"))
            })
        }
        if (config.guild) {
            this.db.guilds = {}
            this.onreadys.push(() => {
                this.client.guilds.cache.forEach(g => {
                    if (!this.db.guilds[g.id]) this.db.guilds[g.id] = guildDB(g)
                })
                fs.writeFileSync("DB/guilds.json", JSON.stringify(this.db.users, null, "\t"))
            })
            this.client.on("guildMemberAdd", g => {
                if (!this.db.guilds[g.id]) this.db.guilds[g.id] = guildDB(g)
                fs.writeFileSync("DB/guilds.json", JSON.stringify(this.db.users, null, "\t"))
            })
        } 
    }

    getUsers (filter, amount) {
        return this.db.users? Object.fromEntries(Object.entries(this.db.users).filter(e => filter(e[1], e[0], this.db.users)).slice(0, amount)) : undefined
    }

    getOneUser(filter) {
        return this.db.users? Object.fromEntries(Object.entries(this.db.users).filter(e => filter(e[1], e[0], this.db.users)))[0] : undefined
    }

    getUserById(id) {
        return this.db.users? this.db.users[id] : undefined
    }

    getGuilds(filter, amount) {
        return this.db.guilds? Object.fromEntries(Object.entries(this.db.guilds).filter(e => filter(e[0], e[1], this.db.guilds))).slice(0, amount) : undefined
    }

    getOneGuld(filter) {
        return this.db.guilds? Object.fromEntries(Object.entries(this.db.guilds).filter(e => filter(e[1], e[0], this.db.users)))[0] : undefined
    }

    getGuildById(id) {
        return this.db.guilds? this.db.guilds[0] : undefined
    }

}
module.exports = {
    Bot,
    Command: CommandType,
    HelpCommand,
    EvalCommand
};