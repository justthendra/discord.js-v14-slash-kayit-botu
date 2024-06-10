const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const registerData = require('../../models/register')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kayıt-kanal')
    .setDescription('Kayıt kanalını ayarlayın.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addChannelOption(channel =>
        channel.setName('kanal')
        .setDescription('Kayıt kanalını belirtin.')
        .setRequired(true)
    ),
    async execute(interaction) {

        const regChannel = interaction.options.getChannel('kanal');

        const channelData = await registerData.findOne({ guildId: interaction.guild.id });

        if(!channelData) {
            new registerData({
                guildId: interaction.guild.id,
                regChannel: regChannel.id
            }).save();

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kayıt kanalı ayarlandı."})
            .setDescription(`Kayıt kanalı başarıyla ${regChannel} olarak ayarlandı.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıt Kanal", iconURL: interaction.client.user.displayAvatarURL()})
            .setURL(config.embeds.gitUrl)
            interaction.reply({embeds: [emb]})
        }

        if(channelData) {
            await registerData.findOneAndUpdate({
                regChannel: regChannel.id
            });

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kayıt kanalı güncellendi."})
            .setDescription(`Kayıt kanalı başarıyla ${regChannel} olarak güncellendi.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıt Kanal", iconURL: interaction.client.user.displayAvatarURL()})
            .setURL(config.embeds.gitUrl)
            interaction.reply({embeds: [emb]})
        }
    }
}