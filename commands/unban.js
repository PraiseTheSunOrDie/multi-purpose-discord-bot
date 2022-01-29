const { sendResponse } = require('../utils/helpers');

module.exports = {
    data: {
        name: 'unban',
        category: 'Moderation',
        description: 'Rimuove il ban di un utente',
        usage: 'unban [ID]',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES', 'BAN_MEMBERS'],
            member: ['BAN_MEMBERS']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'member_id',
                description: 'Membro da sbannare',
                required: true,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const guild = options.resolve('GUILD');
        const args = options.resolve('ARGS');

        const target = args[0];
        
        guild.members.unban(target).then(user => {
            sendResponse(options, {content: `\`${user.tag}\` è stato sbannato`});
        });
    }
}