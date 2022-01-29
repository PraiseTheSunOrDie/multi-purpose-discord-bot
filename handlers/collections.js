const { Collection } = require('discord.js');
const { open } = require('../utils/helpers');
const guildModel = require('../models/guild.js');

module.exports = async(client) => {
    client.newmembers = new Collection();
    client.lastDeleted = new Collection();
    client.lastEdited = new Collection();
    client.components = new Set();
    client.bangifs = await open('./resources/banGifs.txt');
    client.kickgifs = await open('./resources/kickGifs.txt');
    client.mutegifs = await open('./resources/muteGifs.txt');
    client.timeoutgifs = await open('./resources/timeoutGifs.txt');

    guildModel.distinct("id", (err, guilds) => {
        if(err) throw err;
        for(const guild of guilds) {
            client.newmembers.set(guild, new Set());
        }
    })
}