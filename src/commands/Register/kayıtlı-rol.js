const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const registerData = require('../../models/register')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kayıtlı')
    .setDescription('Kayıtlı rolünü ayarlayın.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(role =>
        role.setName('rol')
        .setDescription('Kayıtlı rolünü belirtin.')
        .setRequired(true)
    ),
    async execute(interaction) {

        const registered = interaction.options.getRole('rol');

        const roleData = await registerData.findOne({ guildId: interaction.guild.id });

        if(!roleData) {
            new registerData({
                guildId: interaction.guild.id,
                regRole: registered.id
            }).save();

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kayıtlı rolü ayarlandı."})
            .setDescription(`Kayıtlı rolü başarıyla ${registered} olarak ayarlandı.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıtlı Rol", iconURL: interaction.client.user.displayAvatarURL()})
            .setURL(config.embeds.gitUrl)
            interaction.reply({embeds: [emb]})
        }

        if(roleData) {
            await registerData.findOneAndUpdate({
                regRole: registered.id
            })

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kayıtlı rolü güncellendi."})
            .setDescription(`Kayıtlı rolü başarıyla ${registered} olarak güncellendi.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıtlı Rol", iconURL: interaction.client.user.displayAvatarURL()})
            .setURL(config.embeds.gitUrl)
            interaction.reply({embeds: [emb]})
        }
    }
}