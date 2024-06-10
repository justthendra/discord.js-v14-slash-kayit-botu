const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const registerData = require('../../models/register')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('erkek-rol')
    .setDescription('Erkek rolünü ayarlayın.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(role =>
        role.setName('rol')
        .setDescription('Erkek rolünü belirtin.')
        .setRequired(true)
    ),
    async execute(interaction) {

        const manRole = interaction.options.getRole('rol');

        const roleData = await registerData.findOne({ guildId: interaction.guild.id });

        if(!roleData) {
            new registerData({
                guildId: interaction.guild.id,
                manRole: manRole.id
            }).save();

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Erkek rolü ayarlandı."})
            .setDescription(`Erkek rolü başarıyla ${manRole} olarak ayarlandı.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Erkek Rol", iconURL: interaction.client.user.displayAvatarURL()})
            interaction.reply({embeds: [emb]})
        }

        if(roleData) {
            await registerData.findOneAndUpdate({
                manRole: manRole.id
            })

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Erkek rolü güncellendi."})
            .setDescription(`Erkek rolü başarıyla ${manRole} olarak güncellendi.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Erkek Rol", iconURL: interaction.client.user.displayAvatarURL()})
            interaction.reply({embeds: [emb]})
        }
    }
}