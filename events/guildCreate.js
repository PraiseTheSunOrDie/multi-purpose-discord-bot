const { guildDatabaseCheck } = require('../utils/helpers');

module.exports = async(client, guild) => {
    await guildDatabaseCheck(guild);
    client.newmembers.set(guild.id, new Set());
    client.messages.set(guild.id, new Map());
}