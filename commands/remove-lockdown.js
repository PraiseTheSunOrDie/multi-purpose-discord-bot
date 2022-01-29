const { sendResponse } = require('../utils/helpers');
const guildModel = require('../models/guild.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');

module.exports = {
    data: {
        name: 'remove-lockdown',
        category: 'Moderation',
        description: 'Rimuove lo stato di lockdown',
        usage: 'remove-lockdown',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
            member: ['ADMINISTRATOR']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
    },
    run: async(options) => {
        const guild = options.resolve('GUILD');
        const data = await guildModel.findOne({ id: guild.id });
        const locked = data.locked

        if(locked.length == 0) return { embeds: [new ErrorEmbed('Lockdown non attivo')], ephemeral: true };

        locked.forEach(id => {
            const channel = guild.channels.fetch(id);
            try {
                channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: true });
            }
            catch(error) {
                console.log(error);
            }
            console.log(`Unlocked ${channel.name} in ${guild.name}`);
        })
        guildModel.findOneAndUpdate({ id: guild.id }, { locked: [] }, err => {
            if(err) throw err;
            else sendResponse(options, {
                embeds: [new SuccessEmbed('Tutti i canali sono sbloccati 🔓')] 
            })
        });
    }
}