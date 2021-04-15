const toCode = require('./toCode');
const isCommand = (obj) => {
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

class EvalCommand {
    constructor(name, data, description) {
        return {
            data: data || {},
            name,
            description,
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

class HelpCommand {
    constructor(name, data, description, cb, embedOptioms) {
        embedOptioms = embedOptioms ||{}
        return {
            name,
            data: data || {},
            description,
            async run (msg, args, udb, gdb, client, discord, bot) {
                console.log(this.name);
                const embed = new discord.MessageEmbed()
                .setAuthor(client.user.username, client.user.avatarURL())
                if (embedOptioms.title) embed.setTitle(embedOptioms.title)
                if (embedOptioms.description) embed.setDescription(embedOptioms.description)
                for (const key in bot.commands) {
                    if (cb) {
                        if (cb(bot.commands[key])) {
                            embed.addField(key, bot.commands[key].description, true)
                        }
                    } else {
                        embed.addField(key, bot.commands[key].description, true)
                    }
                }
                await msg.channel.send(embed)
            }
        }
    }
}
class Command {
    constructor(data) {
        if (data.constructor == Command) {
            return data;
        }
        this.data = data.data || {};
        this.name = data.name;
        this.run = data.run;
        this.description = data.description;
    }
    static isCommand = isCommand
    static EvalCommand = EvalCommand
    static HelpCommand = HelpCommand
}


module.exports = Command