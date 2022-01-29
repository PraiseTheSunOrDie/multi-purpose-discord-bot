const { MessageEmbed } = require('discord.js');
const { sendResponse, getRandomItem } = require('../utils/helpers');
const moderation = require('../utils/moderation');

module.exports = {
    data: {
        name: 'timeout',
        category: 'Moderation',
        description: "Mette in timeout un utente",
        usage: 'timeout [user] [duration] <reason>',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES', 'MODERATE_MEMBERS'],
            member: ['MODERATE_MEMBERS']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'member',
                description: 'Target',
                required: true,
                type: 'USER'
            },
            {
                name: 'duration',
                description: 'Tempo di timeout',
                required: true,
                type: 'STRING'
            },
            {
                name: 'reason',
                description: 'Motivo del ban',
                requred: false,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const client = options.client;
        const args = options.resolve('ARGS');
        const author = options.resolve('AUTHOR_MEMBER');
        const member_mentions = await options.resolve('MENTIONED_MEMBERS');
        
        const target = member_mentions[0] ??  await author.guild.members.fetch(args[0]) ?? await client.users.fetch(args[0]) ?? args[0];
        const duration = args[1];
        const reason = args.slice(2).join(" ");

        moderation.timeout(author, target, duration, reason).then(data => {
            const embed = new MessageEmbed()
            .setTitle(`${data.moderator.username} ha messo ${data.target.username} in timeout per ${data.duration}`)
            .setImage(getRandomItem(client.timeoutgifs))
            .setColor('#2F3136')

            if(reason) embed.setFooter({ text: `Motivo: ${reason}` });

            sendResponse(options, { embeds: [embed] });
        }, reason => {
            const embed = new MessageEmbed().setColor('RED');
            if(typeof reason == 'string') embed.setDescription(reason);
            else {
                console.log(reason);
                throw new Error();
            }
            sendResponse(options, { embeds: [embed] });
        })
    }
}