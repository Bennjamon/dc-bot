declare module "dc-bot" {
    import discordJS, { Client, Message, ClientEvents, UserResolvable, GuildResolvable, Collection } from "discord.js";
    namespace dcBot {
    
        interface GuildInDB {
            prefix?: string,
            id?: string,
            name?: string,
            ownerID?: string,
        }
    
        interface UserInDB {
            id?: string,
            name?: string,
            tag?: string
        }
    
        interface DBOptions<GDB, UDB> {
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
    
        interface BotOptions<GDB, UDB> {
            
            /**
             * The secret token of your discord bot
             */
            
            token: string
    
            /**
             * The default prefix to your discord bot
             */
    
            defaultPrefix: string
    
    
            /**
             * The options to the db's for your bot
             */
    
            dbOptions?: DBOptions<GDB, UDB>
    
        }
    
        type ParamsDictionary<T> = {
            [key: string]: T
        }
    
        interface Command<D, UDB, GDB> {
            data: D
            name: string
            description: string
            run(msg: Message, args: string[], userDB: UDB, guildDB: GDB, client: Client, discord: typeof discordJS, bot: Bot<D, GDB, UDB>): Promise<any>
        }
        
        interface CommandConstructor {
    
            new<D, GDB, UDB>(data: CommandData<UDB, GDB, D>): Command<D, any, any>
    
            isCommand(arg: any): arg is Command<any, any, any>
    
            EvalCommand: {
                new<D>(name: string, description: string, data: D): Command<D, any, any>
            }
    
            HelpCommand: {
                new<D>(name: string, data: D, description: string, filter?: (cmd: CommandData<any, any, D>) => boolean, embedOptions?: {
                    title: string
                    description: string
                    inline: boolean
                }): Command<D, any, any>
            }
    
        }
    
        export type CommandData<D, UDB, GDB> = Command<D, UDB, GDB>|{
            name: string
            description: string
            data: D
            run(msg: Message, args: string[], userDB: UDB, guildDB: GDB, client: Client, discord: typeof discordJS, bot: Bot<D, GDB, UDB>): Promise<any>
        }
        
        const Command: CommandConstructor
    
        class Bot<C, GDB, UDB> {
            
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
             *          },
             *          guild
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
    
            commands: ParamsDictionary<CommandData<C, GDB, UDB>>
    
            /**
             * the client object of the bot
             */
    
            client: Client
    
            /**
             * Init your discord bot
             * @returns {Promise<void>} A Promise to be resolved when the bot connects
             */
    
            login(): Promise<void>

            on<K extends keyof ClientEvents>(event: K, callback: (...args: [...eventArgs: ClientEvents[K], dbArgs: {
                users: Collection<string, UDB>
                guilds: Collection<string, GDB>
            }]) => any): void
            addCommand<T>(...commands: CommandData<T, UDB, GDB>[]): Bot<T, GDB, UDB>
            listenCommands(filter?: (commnand: Command<C, UDB, GDB>, name: string) => boolean, cb?: (err: boolean, 
                command: Command<C, UDB, GDB>, context: {
                msg: Message
                userDB?: UDB
                args: string[]
                client: Client,
                discord: typeof discordJS
                bot: Bot<C, UDB, GDB>
            }, run: () => void) => void): void
            addDB<DBG extends GuildInDB = UDB, DBU extends UserInDB = UDB>(options: {
                guild: boolean
                user: boolean
            }, guildCB?: (guild: discordJS.Guild) => DBU, userCB?: (user: discordJS.User) => DBG): Bot<C, DBG, DBU>
            getUserById(id: string): Promise<UDB>
            getUsers(filter: (user: UDB, key: string, dictionary: Collection<string,UDB>) => boolean, amount?: number): Promise<Collection<string,UDB>>
            getOneUser(filter: (user: UDB, key: string, dictionary: Collection<string,UDB>) => boolean): Promise<UDB>
            updateUser<T = {
                [K in keyof UDB]?: UDB[K]
            }, R = T&UDB>(id: string, data: T): Promise<R>
            getGuildById(id: string): Promise<GDB>
            getGuilds(filter: (user: GDB, key: string, dictionary: Collection<string, GDB>) => boolean, amount?: number): Promise<Collection<string, GDB>>
            getOneGuild(filter: (user: GDB, key: string, dictionary: Collection<string, GDB>) => boolean): Promise<GDB>
            updateGuild<T = {
                [K in keyof GDB]?: GDB[K]
            }, R = T&GDB>(id: string, data: T): Promise<R>
        }
    
    }
    export = dcBot
}