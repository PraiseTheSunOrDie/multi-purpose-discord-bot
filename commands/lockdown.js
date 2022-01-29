const { sendResponse } = require('../utils/helpers');
const guildModel = require('../models/guild.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');

module.exports = {
    data: {
        name: 'lockdown',
        category: 'Moderation',
        description: 'Blocca qualsiasi canale nel server',
        usage: 'lockdown',
        aliases: ["lock", "l"],
        permissions: {
            client: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
            member: ['ADMINISTRATOR']
        },
        cooldown: 3,
        testOnly: false,
        slash: true
    },
    run: async(options) => {
        const guild = options.resolve('GUILD');
        const locked = new Set();
        const data = await guildModel.findOne({ id: guild.id });

        if(data.locked.length > 0) return { embeds: [new ErrorEmbed('Lockdown già attivo')], ephemeral: true };

        guild.channels.cache.forEach(channel => {
            const permissions = channel.permissionsFor(channel.guild.roles.everyone)
            if(permissions.has('SEND_MESSAGES')) {
                try {
                    channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: false });
                }
                catch(error) {
                    return console.log(error);
                }
                locked.add(channel.id);
                console.log(`Locked ${channel.name} in ${guild.name}`);
            }
        })
        guildModel.findOneAndUpdate({ id: guild.id }, { locked: Array.from(locked) }, err => {
            if(err) throw err;
            else sendResponse(options, {
                embeds: [new SuccessEmbed('Tutti i canali sono chiusi 🔒')] 
            })
        });
        
    }
}