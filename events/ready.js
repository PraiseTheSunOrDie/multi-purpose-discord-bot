const config = require('../config.json');

module.exports = async(client) => {
    console.log(`Bot is online!`);
    
    client.user.setPresence(config.presence);

    if(config.registerCommands) {
        let list = [];
        let commands = client.commands.map((c) => { return c.data });

        for(const command of commands) {
            if(command.testOnly || !command.slash) continue
            const data = {
                name: command.name,
                description: command.description,
                options: command.arguments
            }

            list.push(data);
        }

        client.application.commands.set(list).then(console.log('Registering commands'));
    }
}