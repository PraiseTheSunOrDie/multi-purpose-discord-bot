const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');

module.exports = {
    data: {
        name: 'unmute',
        category: 'Moderation',
        description: 'Rimuove il mute ad un utente',
        usage: 'unmute [member]',
        aliases: [],
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
                description: 'tizio',
                required: true,
                type: 'USER'
            }
        ]
    },
    run: async(options) => {
        const args = options.resolve('ARGS');
        const guild = options.resolve('GUILD');
        const members = await options.resolve('MENTIONED_MEMBERS');
        const target = members[0] ?? await guild.members.fetch(args[0]);
        
        if(!target) return { embeds: [new ErrorEmbed('Membro non valido')]};

        target.roles.remove(target.roles.cache.find(role => role.name === 'Muted'));
        
        return { embeds: [new SuccessEmbed(`\`${target.user.tag}\` è stato smutato`)] };
    }
}