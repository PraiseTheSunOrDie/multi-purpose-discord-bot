const { sendResponse } = require('../utils/helpers');
const guildModel = require('../models/guild.js');
const { SuccessEmbed } = require('../utils/embeds');

module.exports = {
    data: {
        name: 'prefix',
        category: 'Settings',
        description: 'Imposta un prefix per il server',
        usage: 'prefix [prefix]',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: ['ADMINISTRATOR']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'new_prefix',
                description: 'Nuovo prefisso del server',
                required: true,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const args = options.resolve('ARGS');
        const guild = options.resolve('GUILD');

        const prefix = args[0];
        
        guildModel.findOneAndUpdate({ id: guild.id }, { prefix: prefix }, err => {
            if(err) throw err;
            else sendResponse(options, {
                embeds: [new SuccessEmbed(`Prefisso impostato a \`${prefix}\``)]
            })
        })
    }
}