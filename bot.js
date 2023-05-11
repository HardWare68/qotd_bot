const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

//localStorage for the database, baby
if (typeof localStorage === "undefined" || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
  }

//this sends a QOTD. Yippie!
function sendQotd(channelID){
	const channel = client.channels.cache.get(channelID);
	channel.send('Question of the Day! \n aaaaaaaaaaaaaaaaa');

}

//God forbid we have a built in sleep function.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// set up the slash commands, or something
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//apparently this part handles the slash commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async(c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

	//send the first QOTD on start up. Yay, I love QOTDs!
	sendQotd('1106017962932056196');

	//Calculate the next time to send QOTDs
	localStorage.setItem("nextDate", Date.now() + 5000);

	//uhh...bazinga?
	while(true){
		if(localStorage.getItem("nextDate") <= Date.now()){
			setTimeout(sendQotd, 1, '1106017962932056196');

			localStorage.setItem("nextDate", Date.now() + 5000);
		}
		await sleep(5000);
	}

});

// Log in to Discord with your client's token
client.login(token);