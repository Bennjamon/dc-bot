import discordJS, { Client, Message } from "discord.js";
import Command, { CommandType } from './src/Command'
export class Bot<C> {
    constructor(token: string, defaultPrefix: string)
    commands: CommandType<C>[]
    init(): Promise<void>
    message(callback: (message: Message) => void): void
    addCommand<T>(...commands: (Command.HelpCommand<T>|Command.EvalCommand<T>|Command.CommandData<T>|Command.CommandType<T>)[]): Bot<T>
    listenCommands(cb?: (err: boolean, 
        command: Command.CommandType<C>, context: {
        msg: Message
        args: string[]
        client: Client,
        discord: typeof discordJS
        bot: Bot<C>
    }, run: () => void) => void): void
}

export const EvalCommand = Command.EvalCommand
export const HelpCommand = Command.HelpCommand