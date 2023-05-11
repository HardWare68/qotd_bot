# qotd_bot

A simple-to-use, no-nonsense QOTD bot for Discord. Easily self-hostable for any needs.

# Set-Up
1.) First, download node.js and also set up a discord bot at the Discord Developer Portal. You will need node to run the bot, and need the bot on the dev portal to get the bot token and, well, run the bot.

2.) Create a config.json file in the root directory with the following contents (inserting your tokens as needed):
```
{
	"token": "your-token-here",
  "clientId": "your-client-ID-here",
	"guildId": "your-server-ID-here"
}
```

3.) Run `deploy-commands.js` by opening command prompt, navigating to the root folder for the bot, and using `node deploy-commands.js`.

This will set up the slash commands for the bot to interact with.

4.) Run `bot.js` in a similar fashion as above. This is the main script that does all the bot goodies! This will also mean that you will either need to keep the script running 24/7, or run it once a day to send a QOTD to the server.
