const toCode = require('./toCode');
exports.CommandType = class Command {
    constructor(data) {
        if (data.constructor == Command) {
            return data;
        }
        this.data = data.data || {};
        this.name = data.name;
        this.run = data.run;
        this.description = data.description;
    }
}
exports.isCommand = (obj) => {
    if (obj) {
        if (!obj.name) {
            return false
        } else if (!obj.description) {
            return false
        } else if (!obj.run) {  
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}

exports.EvalCommand = class EvalCommand {
    constructor(name, data) {
        return {
            data: data || {},
            name,
            description: "Evalúa código Javascript",
            async run (msg, args, client, discord, bot) {
                let str = ''
                try {
                    str = toCode(eval(args.join(' ')), '\t')
                } catch (error) {
                    str = error
                }
                str = `\`\`\`js
${str}                
\`\`\``
                msg.channel.send(str)
            }
        }
    }
}

exports.HelpCommand = class HelpCommand {
    constructor(name, data, cb) {
        return {
            name,
            data: data || {},
            description: "Muestra la lista de comandos",
            async run (msg, args, client, discord, bot) {
                const embed = new discord.MessageEmbed()
                .setAuthor(client.user.username, client.user.avatarURL())
                for (const key in bot.commands) {
                    if (cb) {
                        if (cb(bot.commands[key])) embed.addField(key, bot.commands[key].description, true)
                    } else {
                        embed.addField(key, bot.commands[key].description, true)
                    }
                }
                msg.channel.send(embed)
            }
        }
    }
}
