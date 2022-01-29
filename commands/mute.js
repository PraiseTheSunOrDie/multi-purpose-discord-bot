const { MessageEmbed } = require('discord.js');
const { sendResponse, getRandomItem } = require('../utils/helpers');
const moderation = require('../utils/moderation');

module.exports = {
    data: {
        name: 'mute',
        category: 'Moderation',
        description: "Muta un utente",
        usage: 'mute [user] <reason>',
        aliases: ['shut', 'zitto', 'taci'],
        permissions: {
            client: ['SEND_MESSAGES', 'MANAGE_ROLES'],
            member: ['KICK_MEMBERS']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'member',
                description: 'Membro da mutare',
                required: true,
                type: 'USER'
            },
            {
                name: 'reason',
                description: 'Motivo del mute',
                required: false,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const client = options.client;
        const args = options.resolve('ARGS');
        const author = options.resolve('AUTHOR_MEMBER');
        const members = await options.resolve('MENTIONED_MEMBERS');
        
        const target = members[0] ??  await author.guild.members.fetch(args[0]) ?? await client.users.fetch(args[0]) ?? args[0];
        const reason = args.slice(1).join(" ");
        
        moderation.mute(author, target, reason).then(data => {
            const embed = new MessageEmbed()
            .setTitle(`${data.moderator.username} ha mutato ${data.target.username}`)
            .setImage(getRandomItem(client.mutegifs))
            .setColor('#2F3136')

            if(reason) embed.setFooter({ text: `Motivo: ${reason}` });

            sendResponse(options, { embeds: [embed] });
        }, reason => {
            const embed = new MessageEmbed().setColor('RED');
            if(typeof reason == 'string') embed.setDescription(reason);
            else embed.setDescription('Errore sconosciuto')
            sendResponse(options, { embeds: [embed] });
        })
    }
}