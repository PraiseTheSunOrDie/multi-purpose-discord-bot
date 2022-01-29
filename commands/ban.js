const { MessageEmbed } = require('discord.js');
const { sendResponse, getRandomItem } = require('../utils/helpers');
const moderation = require('../utils/moderation');

module.exports = {
    data: {
        name: 'ban',
        category: 'Moderation',
        description: "Banna un utente",
        usage: 'ban [user] <reason>',
        aliases: ['banish', 'muori'],
        permissions: {
            client: ['SEND_MESSAGES', 'BAN_MEMBERS'],
            member: ['BAN_MEMBERS']
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
        const members = await options.resolve('MENTIONED_MEMBERS');
        
        const target = members[0] ??  await author.guild.members.fetch(args[0]) ?? await client.users.fetch(args[0]) ?? args[0];
        const reason = args.slice(1).join(" ");
        
        moderation.ban(author, target, reason).then(data => {
            const embed = new MessageEmbed()
            .setTitle(`${data.moderator.username} ha bannato ${data.target.username}`)
            .setImage(getRandomItem(client.bangifs))
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