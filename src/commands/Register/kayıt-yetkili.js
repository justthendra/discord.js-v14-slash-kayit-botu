const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const registerData = require('../../models/register')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kayıt-yetkili')
    .setDescription('Kayıt yetkilisini ayarlayın.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(role =>
        role.setName('rol')
        .setDescription('Kayıt yetkilisi rolünü belirtin.')
        .setRequired(true)
    ),
    async execute(interaction) {

        const regAuth = interaction.options.getRole('rol');
        const roleData = await registerData.findOne({ guildId: interaction.guild.id });

        if(!roleData) {
            new registerData({
                guildId: interaction.guild.id,
                regAuthRole: regAuth.id
            }).save();

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kayıt yetkilisi rolü ayarlandı."})
            .setDescription(`Kayıt yetkilisi rolü başarıyla ${regAuth} olarak ayarlandı.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıt Yetkilisi Rol", iconURL: interaction.client.user.displayAvatarURL()})
            interaction.reply({embeds: [emb]})
        }

        if(roleData) {
            await registerData.findOneAndUpdate({
                regAuthRole: regAuth.id
            })

            const emb = new EmbedBuilder()
            .setTitle('Discord.js v14 Kayıt Botu')
            .setColor(config.embeds.colorSuccessfull)
            .setAuthor({name: "Kayıt yetkilisi güncellendi."})
            .setDescription(`Kayıt yetkilisi başarıyla ${regAuth} olarak güncellendi.`)
            .setTimestamp()
            .setFooter({text: "Discord.js v14 Kayıt Botu | Kayıt Yetkilisi Rol", iconURL: interaction.client.user.displayAvatarURL()})
            interaction.reply({embeds: [emb]})
        }
    }
}