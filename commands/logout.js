module.exports = {
    data: {
        name: 'logout',
        category: 'Owner',
        description: 'lol',
        usage: 'logout',
        aliases: ["shutdown", "destroy"],
        permissions: {
            client: null,
            member: ['BOT_OWNER']
        },
        cooldown: 0,
        testOnly: true
    },
    run: async(options) => {
        const client = options.client;
        client.destroy();
        console.log("Client stopped");
    }
}