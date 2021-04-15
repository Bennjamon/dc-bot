import discordJS, { Client, Message } from "discord.js";
import Command, { CommandData, HelpCommand, EvalCommand } from './src/Command'
import CommandConstructor from './src/Command'

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
    /**
     * The options for the user database
     */
    user?: boolean|{
        /**
         * The callback to add the users in the database
         * @param {User} user the user to add in the dastabase 
         */
        add(user: discordJS.User): UDB
    },
    /**
     * The options to the guild database
     */
    guild?: boolean|{
        /**
         * The callback to add the guilds in the database
         * @param {Guild} guild the guild to add in the dastabase 
         */
        add(guild: discordJS.Guild): GDB
        /**
         * The key of the prefix of the servers
         */
        prefixKey?: keyof GDB   
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

export const Command = CommandConstructor

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

    commands: ParamsDictionary<CommandData<GDB, UDB, C>>

    /**
     * Init your discord bot
     */

    init(): Promise<void>

    message(callback: (message: Message, userDB: UDB, guildDB: GDB) => void): void
    addCommand<T>(...commands: CommandData<GDB, UDB, T>[]): Bot<T, GDB, UDB>
    listenCommands(cb?: (err: boolean, 
        command: Command<UDB, GDB, C>, context: {
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
    getUserById(id: string): Promise<UDB>
    getUsers(filter: (user: UDB, key: string, dictionary: ParamsDictionary<UDB>) => boolean, amount: number): Promise<ParamsDictionary<UDB>>
    getUsers(filter: (user: UDB, key: string, dictionary: ParamsDictionary<UDB>) => boolean, amount: 0): Promise<{}>
    getOneUser(filter: (user: UDB, key: string, dictionary: ParamsDictionary<UDB>) => boolean): Promise<UDB>
    updateUser<T = {
        [K in UDB]?: UDB[K]
    }, R = T&UDB>(id: string, data: T): Promise<R>
    getGuildById(id: string): Promise<GDB>
    getGuilds(filter: (user: GDB, key: string, dictionary: ParamsDictionary<GDB>) => boolean, amount: number): Promise<ParamsDictionary<GDB>>
    getGuilds(filter: (user: GDB, key: string, dictionary: ParamsDictionary<GDB>) => boolean, amount: 0): Promise<{}>
    getOneGuild(filter: (user: GDB, key: string, dictionary: ParamsDictionary<GDB>) => boolean): Promise<GDB>
}

