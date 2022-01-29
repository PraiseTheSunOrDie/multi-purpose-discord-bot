const config = require('../config.json');
const guildID = config.testGuild;

module.exports = {
    data: {
        name: 'register',
        category: 'Owner',
        description: 'Registra uno slash command',
        usage: 'register [command]',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: ['BOT_OWNER']
        },
        cooldown: 0,
        testOnly: true,
        slash: false,
        arguments: [
            {
                name: 'command',
                description: 'Comando da registrare',
                required: true,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        console.log('a');
        const client = options.client;
        const args = options.resolve('ARGS');
        const guild = options.resolve('GUILD');
        console.log('a');
        let command = args[0];
        let commands;
        
        var cmd = client.commands.get(command);
        console.log('a');
        if(!cmd) return console.log('nope');
        if(!cmd.data.slash) return console.log('nope');
        if(cmd.data.testOnly === true && guild.id !== guildID) {
            return;
        }
        else {
            commands = guild.commands;
            console.log('a');
        }
        commands.create({
            name: cmd.data.name,
            description: cmd.data.description,
            options: cmd.data?.arguments
        }).then(`Registered ${cmd.data.name}`
        )
        console.log('a');       
    }
}