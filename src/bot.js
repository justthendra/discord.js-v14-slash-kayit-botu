const { Client, Partials, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const config = require('./config.json');
require('cute-logs')
const mongoose = require('mongoose')

const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [ Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User ]
})

const fs = require('node:fs');
const path = require('node:path')

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.error(`[UYARI] ${filePath} isimli komut "data" veya "execute" tanımı içermediği için çalıştırılamadı.`, "Komutlar");
		}
	}
}

const { REST, Routes } = require('discord.js');

const commands = [];

for (const folder of commandFolders) {
	
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.error(`[UYARI] ${filePath} isimli komut "data" veya "execute" tanımı içermediği için çalıştırılamadı.`, "Komutlar");
		}
	}
}

const rest = new REST().setToken(config.bot.token);

(async () => {
	try {
		console.info(`${commands.length} adet entegrasyon komutu (/) yenileniyor.`, "Komutlar");

		
		const data = await rest.put(
			Routes.applicationCommands(config.bot.client_id),
			{ body: commands },
		);

		console.info(`${commands.length} adet entegrasyon komutu (/) yenileniyor.`, "Komutlar");
	} catch (error) {
		
		console.error(error);
	}
})();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

module.exports = client;

const Data = require("./models/register")

client.on('guildMemberAdd', async (member) => {

	const registerData = await Data.findOne({ guildId: member.guild.id });
	await member.setNickname(`İsim | Yaş`)
	await member.roles.add(registerData.unregRole);
	const regAuth = await member.guild.roles.cache.get(registerData.regAuthRole)
	const regChannel = await client.channels.cache.get(registerData.regChannel)

	const emb = new EmbedBuilder()
	.setAuthor({name: "Bir kullanıcı sunucumuza katıldı.", iconURL: member.user.displayAvatarURL()})
	.setColor('Random')
	.setDescription(`Hoşgeldin, ${member} seninle birlikte ${member.guild.memberCount} **kişiyiz!**\nKaydının yapılması için bir **yetkilinin** seninle ilgilenmesini bekle.\n${regAuth ? `${regAuth}` : "Rolü bulamadım"}`)
	.setTimestamp()
    .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıt Zamanı", iconURL: client.user.displayAvatarURL()})
	regChannel.send({embeds: [emb]})


})

process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
})

client.login(config.bot.token)
