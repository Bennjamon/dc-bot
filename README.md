# dc-bot
a module to create bots of discord
## Install
```
$ npm install dc-bot --save
```
## Example
```js
const dcBot = require('dc-bot');

const bot = new dcBot.Bot("<your secret token>", "<your prefix>")

bot.addCommands(
	{
		name: "say",
		description: "send a message",
		async run (msg, args, client, discord, bot) {
			await msg.channel.send(args.join(' '))
		}
	}
)
```