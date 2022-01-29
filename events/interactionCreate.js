const { guildDatabaseCheck, userDatabaseCheck, checkPermissions, commandCounter } = require('../utils/helpers');
const { MessageEmbed } = require('discord.js');
const { ErrorEmbed } = require('../utils/embeds');
const OptionResolver = require('../utils/CommandOptionResolver');

module.exports = async(client, interaction) => {
    if (interaction.isCommand()) {
        await guildDatabaseCheck(interaction.guild);
        await userDatabaseCheck(interaction.member);

        let cmd = client.commands.get(interaction.commandName);
        let cooldown = client.cooldowns.get(cmd.data.name);

        if(!checkPermissions({
            permissions: cmd.data.permissions,
            channel: interaction.channel,
            client: interaction.guild.me,
            member: interaction.member,
            callback: (type, perms) => {
                let embed = new MessageEmbed().setColor('RED');
                switch(type) {
                    case 'CLIENT':
                        embed.setTitle('❌ Non ho il permesso 😩');
                        embed.setDescription(`Potrebbe mancarmi uno dei seguenti permessi:\n\n${perms.join(', ')}`);
                        break;
                    case 'MEMBER':
                        embed.setTitle('❌ Non hai il permesso 🤡');
                        embed.setDescription(`Devi avere almeno uno dei seguenti permessi:\n\n${perms.join(', ')}`);
                        break;
                }
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        })) return;

        if(cooldown.has(interaction.member.id)) {
            return interaction.reply({ content: 'Il comando è in cooldown', ephemeral: true })
        }

        cmd.run(new OptionResolver(client, null, interaction)).then(async(response) => {
            cooldown.add(interaction.user.id);
            setTimeout(() => {
                cooldown.delete(interaction.user.id)
            }, cmd.data.cooldown * 1000);
            if(!response) return;
            await interaction.reply({
                content: response.content,
                embeds: response.embeds,
                files: response.files,
                components: response.components,
                ephemeral: response.ephemeral
            })
            await interaction.fetchReply().then(msg => {
                if(!response.callback) return;
                response.callback(msg);
            })
        }).catch((error) => {
            interaction.reply({
                embeds: [new ErrorEmbed('Errore')],
                ephemeral: true
            });
            console.log(error);
        });

        setTimeout(() => {
            cooldown.delete(interaction.member.id)
        }, cmd.data.cooldown * 1000);

        commandCounter(cmd, interaction.member);
    }
    
}