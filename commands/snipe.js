const { MessageEmbed } = require("discord.js");
const config = require('../config.json');

module.exports = {
    data: {
        name: 'snipe',
        category: 'Extra',
        description: 'Mostra l\'ultimo messaggio eliminato',
        usage: 'snipe',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: null
        },
        cooldown: 0,
        testOnly: false,
        slash: true
    },
    run: async(options) => {
        const client = options.client;
        const channel = options.resolve('CHANNEL');
        const sniped = client.lastDeleted.get(channel.id);
        

        if(!sniped) {
            return {
                content: 'There is nothing to snipe :pensive:',
                ephemeral: true
            }
        }

        const embed = new MessageEmbed()
            .setAuthor({ name: sniped.author.tag, iconURL: sniped.author.displayAvatarURL()})
            .setDescription(sniped.content)
            .setFooter({ text: `Deleted in ${channel.name}` })
            .setColor(config.color)
            .setTimestamp(sniped.createdTimestamp)

        return { embeds: [embed] };
    }
}