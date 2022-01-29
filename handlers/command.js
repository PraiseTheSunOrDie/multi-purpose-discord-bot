const { Collection } = require('discord.js');
const fs = require("fs");

module.exports = (client) => {
    client.commands = new Collection();
    client.aliases = new Collection();
    client.cooldowns = new Collection();

    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

    for(const file of commandFiles){
        const command = require(`../commands/${file}`);
        client.commands.set(command.data.name, command);
        client.cooldowns.set(command.data.name, new Set());
        for(const alias of command.data.aliases){
            client.aliases.set(alias, command);
        }
    }
}
