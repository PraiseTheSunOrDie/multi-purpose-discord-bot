const guildModel = require('../models/guild.js');
const { MessageEmbed } = require('discord.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { sendResponse } = require('../utils/helpers');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'antijoin',
        category: 'Settings',
        description: 'Attiva il sistema di antijoin',
        usage: 'antijoin [info/enable/disable/action/limit] <value>',
        aliases: ['antiraid'],
        permissions: {
            client: ['SEND_MESSAGES', 'MANAGE_ROLES', 'BAN_MEMBERS', 'KICK_MEMBERS'],
            member: ['ADMINISTRATOR']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'info',
                description: 'Ottieni informazioni sulle impostazioni attuali',
                type: 'SUB_COMMAND',
            },
            {
                name: 'enable',
                description: 'Attiva l\'antijoin',
                type: 'SUB_COMMAND'
            },
            {
                name: 'disable',
                description: 'Disattiva l\'antijoin',
                type: 'SUB_COMMAND'
            },
            {
                name: 'action',
                description: 'Azione da compiere sui membri fanno scattare il sistema di antijoin',
                type: 'SUB_COMMAND_GROUP',
                options: [
                    {
                        name: 'ban',
                        description: 'Imposta l\'azione di default a BAN',
                        type: 'SUB_COMMAND'
                    },
                    {
                        name: 'kick',
                        description: 'Imposta l\'azione di default a KICK',
                        type: 'SUB_COMMAND'
                    },
                    {
                        name: 'mute',
                        description: 'Imposta l\'azione di default a MUTE',
                        type: 'SUB_COMMAND'
                    }
                ]
            },
            {
                name: 'limit',
                description: 'Imposta un limite all\'antijoin',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'number',
                        description: 'Numero di ingressi in poco tempo che fa scattare l\'antijoin',
                        required: true,
                        type: 'INTEGER'
                    }
                ]
            }
        ]
    },
    run: async(options) => {
        const guild = options.resolve('GUILD');
        const args = options.resolve('ARGS');

        const operation = args[0];

        const data = await guildModel.findOne({ id: guild.id });
        const settings = data.antiraid;

        if(operation === 'info') {
            const embed = new MessageEmbed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL()})
            .setColor(config.color)
            if(settings.status == true) embed.addField('Status', 'Attivo ✅');
            else embed.addField('Status', 'Disattivato ❌');
            embed.addFields(
                { name: 'Action', value: settings.action.toUpperCase(), inline: true },
                { name: 'Limit', value: settings.limit.toString(), inline: true }
            )

            return { embeds: [embed] };
        }

        if(operation === 'on' || operation === 'enable') {
            if(settings.status == true) {
                return { embeds: [new ErrorEmbed('Antijoin già attivo')], ephemeral: true };
            }
            settings.status = true;

            guildModel.findOneAndUpdate({ id: guild.id }, { antiraid: settings }, err => {
                if(err) throw err;
                else sendResponse(options, {
                    embeds: [new SuccessEmbed('Antijoin attivato')]
                })
            })
            return;
        }

        if(operation === 'off' || operation === 'disable') {
            if(settings.status == false) {
                return { embeds: [new ErrorEmbed('L\'antijoin non è attivo')], ephemeral: true };
            }
            settings.status = false;

            guildModel.findOneAndUpdate({ id: guild.id }, { antiraid: settings }, err => {
                if(err) throw err;
                else sendResponse(options, {
                    embeds: [new SuccessEmbed('Antijoin disattivato')]
                })
            })
            return;
        }

        if(operation === 'action') {
            const action = args[1];
            if(action == 'ban' || action == 'kick' || action == 'mute') {
                if(settings.action == action) return { embeds: [new ErrorEmbed(`Azione già impostata a ${action}`)]};
                else settings.action = action;
                guildModel.findOneAndUpdate({ id: guild.id }, { antiraid: settings }, err => {
                    if(err) throw err;
                    else sendResponse(options, {
                        embeds: [new SuccessEmbed(`Azione impostata a ${action}`)]
                    })
                })
                return;
            }
            else {
                return {
                    embeds: [new ErrorEmbed('Azione non valida')]
                }
            }
        }
        if(operation === 'limit') {
            const value = args[1];
            const limit = Number(value);
            if(isNaN(limit)) {
                return { embeds: [new ErrorEmbed('Numero non valido')], ephemeral: true };
            }
            settings.limit = limit;
            guildModel.findOneAndUpdate({ id: guild.id }, { antiraid: settings }, err => {
                if(err) throw err;
                else sendResponse(options, {
                    embeds: [new SuccessEmbed(`Limite impostato a ${limit.toString()}`)]
                })
            })
        }
    }
}