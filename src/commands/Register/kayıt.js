const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const registerData = require('../../models/register')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kayıt')
    .setDescription('Sunucuya yeni katılan üyeyi kayıt edin.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ChangeNickname)
    .addUserOption(user => 
        user.setName('kullanıcı')
        .setDescription('Bir kullanıcı belirtin.')
        .setRequired(true)
    )
    .addStringOption(name =>
        name.setName('isim')
        .setDescription('Kullanıcının ismini belirtin.')
        .setRequired(true)
    )
    .addIntegerOption(age => 
        age.setName('yaş')
        .setDescription('Kullanıcının yaşını belirtin.')
        .setRequired(true)
    )
    .addStringOption(gender =>
        gender.setName('cinsiyet-rol')
        .setDescription('Kullanıcının cinsiyetine uyan rolü seçin.')
        .setRequired(true)
    ),
    async execute(interaction) {
        interaction.deferReply()

        const user = interaction.options.getUser('kullanıcı');
        const name = interaction.options.getString('isim');
        const age = interaction.options.getInteger('yaş');
        const gender = interaction.options.getString('cinsiyet-rol')
        const registerDatas = await registerData.findOne({ guildId: interaction.guild.id });

        const currentTime = new Date();
        const formattedCurrentTime = currentTime.toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });


        if (gender === "kadın") {

            const role = await interaction.guild.roles.cache.get(registerDatas.girlRole)
            await interaction.guild.members.cache.get(user.id).roles.remove(registerDatas.unregRole)
            await interaction.guild.members.cache.get(user.id).roles.add(role)

            const member = await interaction.guild.members.fetch(user.id);


            await member.setNickname(`${name} | ${age}`)
            const channel = config.guild["kayit-log"];
            const logChannel = interaction.guild.channels.cache.find(channell => channell.id === channel)

            const emb = new EmbedBuilder()
            .setAuthor({name: "Bir kullanıcı kayıt edildi.", iconURL: member.user.displayAvatarURL()})
            .setDescription(`${member} isimli kullanıcı kayıt edildi. Sunucuya hoşgeldin ${member}!\n\n**Yetkili:** ${interaction.user}\n**Yeni İsmi:** \`${name} | ${age}\`\n**Kayıt Tarihi:** \`${formattedCurrentTime}\``)
            .setColor(config.embeds.colorSuccessfull)
            .setFooter({text: "Kayıt başarıyla tamamlandı.", iconURL: interaction.client.user.displayAvatarURL()})
            .setTimestamp()
            .setTitle('Discord.js v14 Kayıt Botu')
            interaction.editReply({embeds: [emb]})
            logChannel.send({embeds: [emb]})

        }

        if (gender === "erkek") {

            const role = await interaction.guild.roles.cache.get(registerDatas.manRole)
            await interaction.guild.members.cache.get(user.id).roles.remove(registerDatas.unregRole)
            await interaction.guild.members.cache.get(user.id).roles.add(role)

            const member = await interaction.guild.members.fetch(user.id);
            

            await member.setNickname(`${name} | ${age}`)
            const channel = config.guild["kayit-log"];
            const logChannel = interaction.guild.channels.cache.find(channell => channell.id === channel)

            const emb = new EmbedBuilder()
            .setAuthor({name: "Bir kullanıcı kayıt edildi.", iconURL: member.user.displayAvatarURL()})
            .setDescription(`${member} isimli kullanıcı kayıt edildi. Sunucuya hoşgeldin ${member}!\n\n**Yetkili:** ${interaction.user}\n**Yeni İsmi:** \`${name} | ${age}\`\n**Kayıt Tarihi:** \`${formattedCurrentTime}\``)
            .setColor(config.embeds.colorSuccessfull)
            .setFooter({text: "Kayıt başarıyla tamamlandı.", iconURL: interaction.client.user.displayAvatarURL()})
            .setTimestamp()
            .setTitle('Discord.js v14 Kayıt Botu')
            interaction.editReply({embeds: [emb]})
            logChannel.send({embeds: [emb]})

        }
    }
}