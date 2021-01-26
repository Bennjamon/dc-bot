import discordJS, { Client, Message } from "discord.js";
import { Bot } from "..";
declare namespace Command {
    function isCommand (arg: any): arg is CommandData<any>
    class CommandType<D> {
        constructor(data: CommandData<D>)
        data: D
        name: string
        description: string
        run(msg: Message, args: string[], client: Client, discord: typeof discordJS, bot: Bot): Promise<any>
    }
    class EvalCommand<D> {
        constructor(name: string, data: D) 
    }
    class HelpCommand<D> {
        constructor(name: string, data: D, filter?: (cmd: CommandType<D>) => boolean)
    }
    interface CommandData<D> {
        name: string
        description: string
        data?: D
    }
}

export = Command