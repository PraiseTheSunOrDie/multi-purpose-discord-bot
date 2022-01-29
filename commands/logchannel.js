const guildModel = require('../models/guild.js')
const { sendResponse } = require('../utils/helpers');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');

module.exports = {
    data: {
        name: 'logchannel',
        category: 'Settings',
        description: 'Imposta o rimuove un canale per i log',
        usage: 'logchannel [set/remove] <channel>',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
            member: ['ADMINISTRATOR']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'set',
                description: 'Imposta un canale',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'channel',
                        description: 'Canale in cui inviare i log',
                        required: true,
                        type: 'CHANNEL'
                    }
                ]
            },
            {
                name: 'remove',
                description: 'Rimuove il canale precedentemente impostato',
                type: 'SUB_COMMAND'
            }
        ]
    },
    run: async(options) => {
        const guild = options.resolve('GUILD');
        const args = options.resolve('ARGS');
        const channels = await options.resolve('MENTIONED_CHANNELS');
        
        const action = args[0];
        const channel = channels[0];

        if(action === 'set') {
            if(!channel) {
                return { embeds: [new ErrorEmbed('Canale non valido')]};
            }

            guildModel.findOneAndUpdate({ id: guild.id }, { logChannel: channel.id }, err => {
                if(err) throw err;
                else sendResponse(options, { embeds: [new SuccessEmbed(`Canale dei logs aggiornato a ${channel.name}`)]})
            });
            
            
        }
        if(action === 'remove') {
            guildModel.findOneAndUpdate({ id: guild.id }, { logChannel: null }, err => {
                if(err) throw err;
                else sendResponse(options, { embeds: [new SuccessEmbed(`Canale dei logs rimosso`)]})
            });
        }

    }

}