const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const registerData = require('../../models/register')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kayıtsız')
    .setDescription('Kayıtsız rolünü ayarlayın.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(role =>
        role.setName('rol')
        .setDescription('Kayıtsız rolünü belirtin.')
        .setRequired(true)
    ),
    async execute(interaction) {

        const unregistered = interaction.options.getRole('rol');

        const roleData = await registerData.findOne({ guildId: interaction.guild.id });

        if(!roleData) {
            new registerData({
                guildId: interaction.guild.id,
                unregRole: unregistered.id
            }).save();

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kayıtsız rolü ayarlandı."})
            .setDescription(`Kayıtsız rolü başarıyla ${unregistered} olarak ayarlandı.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıtsız Rol", iconURL: interaction.client.user.displayAvatarURL()})
            .setURL(config.embeds.gitUrl)
            interaction.reply({embeds: [emb]})
        }

        if(roleData) {
            await registerData.findOneAndUpdate({
                unregRole: unregistered.id
            })

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kayıtsız rolü güncellendi."})
            .setDescription(`Kayıtsız rolü başarıyla ${unregistered} olarak güncellendi.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıtsız Rol", iconURL: interaction.client.user.displayAvatarURL()})
            .setURL(config.embeds.gitUrl)
            interaction.reply({embeds: [emb]})
        }
    }
}