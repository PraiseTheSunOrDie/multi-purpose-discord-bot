
module.exports = {
    data: {
        name: 'status',
        category: 'Owner',
        description: 'Modifica lo status del bot',
        usage: 'status [text]',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: ['BOT_OWNER']
        },
        cooldown: 0,
        testOnly: false,
        slash: false,
        arguments: [
            {
                name: 'text',
                description: 'Stato pazzurdo',
                required: true,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const client = options.client;
        const args = options.resolve('ARGS');
        const status = args.join(' ');

        client.user.setPresence({
            status: 'online',
            activities: [
                {
                    name: status,
                    type: "STREAMING",
                    url: "https://www.youtube.com/watch?v=xvFZjo5PgG0"
                }
            ]
        })

        return { content: 'Stato aggiornato ✅'};
    }
}