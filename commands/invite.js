const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'invite',
        category: 'Utility',
        description: 'Invita il bot',
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
        const client = options.client;

        const invite = client.generateInvite({
            scopes: ['bot', 'applications.commands'],
            permissions: ['ADMINISTRATOR']
        })

        const embed = new MessageEmbed()
        .setTitle('Clicca qui')
        .setColor(config.color)
        .setURL(invite)

        return { embeds: [embed] };
    }
}