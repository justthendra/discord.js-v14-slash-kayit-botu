const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const registerData = require('../../models/register')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kadın-rol')
    .setDescription('Kadın rolünü ayarlayın.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(role =>
        role.setName('rol')
        .setDescription('Kadın rolünü belirtin.')
        .setRequired(true)
    ),
    async execute(interaction) {

        const girlRole = interaction.options.getRole('rol');

        const roleData = await registerData.findOne({ guildId: interaction.guild.id });

        if(!roleData) {
            new registerData({
                guildId: interaction.guild.id,
                girlRole: girlRole.id
            }).save();

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kadın rolü ayarlandı."})
            .setDescription(`kadın rolü başarıyla ${girlRole} olarak ayarlandı.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kadın Rol", iconURL: interaction.client.user.displayAvatarURL()})
            interaction.reply({embeds: [emb]})
        }

        if(roleData) {
            await registerData.findOneAndUpdate({
                girlRole: girlRole.id
            })

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kadın rolü güncellendi."})
            .setDescription(`Kadın rolü başarıyla ${girlRole} olarak güncellendi.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kadın Rol", iconURL: interaction.client.user.displayAvatarURL()})
            interaction.reply({embeds: [emb]})
        }
    }
}