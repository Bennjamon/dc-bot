import discordJS, { Client, Message } from "discord.js";
import Command, { CommandType } from './src/Command'

export interface GuildInDB {
    prefix?: string,
    id?: string,
    name?: string,
    ownerID?: string,
}

export interface UserInDB {
    id?: string,
    name?: string,
    tag?: string
}

export interface DBOptions<GDB, UDB> {
    user?: boolean|{
        add(user: discordJS.User): UDB
    },
    guild?: boolean|{
        add(guild: discordJS.Guild): GDB
    }
}

export interface BotOptions<GDB, UDB> {
    
    /**
     * The secret token of your discord bot
     */
    
    token?: string

    /**
     * The default prefix to your discord bot
     */

    prefix?: string


    /**
     * The options to the db's for your bot
     */

    dbOptions?: DBOptions<GDB, UDB>

}

export type ParamsDictionary<T> = {
    [key: string]: T
}

export class Bot<C, GDB = undefined, UDB = undefined> {
    
    /**
     * 
     * @example
     * const dcBot = require('dc-bot')
     * 
     * consr bot = new dcBot.Bot({
     *      token: "token",
     *      prefix: ">"
     *      dbOptions: {
     *          user: {
     *              add(user) {
     *                  return {
     *                      id: user.id
     *                  }
     *              }
     *          }
     *      }
     * })
     * 
     * @param {BotOptions<GDB, UDB>} options the options of your bot
     */
    
    constructor(options: BotOptions<GDB, UDB>)
    
    /**
     * @example
     * const dcBot = require("dc-bot");
     * const bot = new dcBot.Bot("token", ">")
     * 
     * @param {string} token The secret token of your discord bot
     * @param {string} defaultPrefix The default prefix to your discord bot
     */
    
    constructor(token: string, defaultPrefix: string)
    
    /**
     * the commands of the bot
     */

    commands: ParamsDictionary<Command<C>>

    /**
     * Init your discord bot
     */

    init(): Promise<void>

    message(callback: (message: Message, userDB: UDB, guildDB: GDB) => void): void
    addCommand<T>(...commands: (Command.HelpCommand<T>|Command.EvalCommand<T>|Command.CommandData<T, UDB, GDB>|Command.CommandType<T, UDB, GDB>)[]): Bot<T, GDB, UDB>
    listenCommands(cb?: (err: boolean, 
        command: Command.CommandType<C>, context: {
        msg: Message
        userDB?: UDB
        args: string[]
        client: Client,
        discord: typeof discordJS
        bot: Bot<C, GDB, UDB>
    }, run: () => void) => void): void
    addDB<DBG extends GuildInDB = UDB, DBU extends UserInDB = UDB>(options: {
        guild: boolean
        user: boolean
    }, guildCB?: (guild: discordJS.Guild) => DBU, userCB?: (user: discordJS.User) => DBG): Bot<C, DBG, DBU>
    getUserById(id: string): UDB
    getUsers(filter: (user: UDB, key: string, dictionary: ParamsDictionary<UDB>) => boolean, amount: number): UDB[]
    getOneUser(filter: (user: UDB, key: string, dictionary: ParamsDictionary<UDB>) => boolean): UDB
    getGuildById(id: string): GDB
    getGuilds(filter: (user: GDB, key: string, dictionary: ParamsDictionary<GDB>) => boolean, amount: number): GDB[]
    getOneGuild(filter: (user: GDB, key: string, dictionary: ParamsDictionary<GDB>) => boolean): UGDB
}

export class EvalCommand<D> extends Command.EvalCommand<D> {}
export class HelpCommand<D> extends Command.HelpCommand<D> {}