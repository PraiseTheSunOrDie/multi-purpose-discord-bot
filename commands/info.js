const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const package = require('../package.json');

module.exports = {
    data: {
        name: 'info',
        category: 'Utility',
        description: 'A proposito del bot',
        usage: 'info',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: null
        },
        cooldown: 3,
        testOnly: false,
        slash: true
    },
    run: async(options) => {
        const embed = new MessageEmbed()
        .setTitle('Fakepage Bot')
        .setColor(config.color)
        .addFields(
            { name: 'Version', value: `\`${package.version}\``, inline: true },
            { name: 'Language', value: '`JavaScript`', inline: true },
            { name: 'Developed by', value: `\`${package.author}\``, inline: true }
        )

        return { embeds: [embed] };
    }
}