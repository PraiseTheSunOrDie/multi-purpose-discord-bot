const guildModel = require('../models/guild.js');
const { MessageEmbed } = require('discord.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { sendResponse } = require('../utils/helpers');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'raidmode',
        category: 'Settings',
        description: 'Blocca l\'accesso al server',
        usage: 'raidmode [info/enable/disable/action/] <value>',
        aliases: ['server-lock'],
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
                description: 'Attiva la raidmode',
                type: 'SUB_COMMAND'
            },
            {
                name: 'disable',
                description: 'Disattiva la raidmode',
                type: 'SUB_COMMAND'
            },
            {
                name: 'action',
                description: 'Azione da compiere sui membri che entrano quando la raidmode è attiva',
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
            }
        ]
    },
    run: async(options) => {
        const guild = options.resolve('GUILD');
        const args = options.resolve('ARGS');

        const operation = args[0];

        const data = await guildModel.findOne({ id: guild.id });
        const settings = data.raidmode;

        if(operation === 'info') {
            const embed = new MessageEmbed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL()})
            .setColor(config.color)
            if(settings.status == true) embed.addField('Status', 'Attiva ✅');
            else embed.addField('Status', 'Disattivata ❌');
            embed.addFields(
                { name: 'Action', value: settings.action.toUpperCase(), inline: true }
            )

            return { embeds: [embed] };
        }

        if(operation === 'on' || operation === 'enable') {
            if(settings.status == true) {
                return { embeds: [new ErrorEmbed('Raidmode già attiva')], ephemeral: true };
            }
            settings.status = true;

            guildModel.findOneAndUpdate({ id: guild.id }, { raidmode: settings }, err => {
                if(err) throw err;
                else sendResponse(options, {
                    embeds: [new SuccessEmbed('Raidmode attivata')]
                })
            })
            return;
        }

        if(operation === 'off' || operation === 'disable') {
            if(settings.status == false) {
                return { embeds: [new ErrorEmbed('Raidmode non attiva')], ephemeral: true };
            }
            settings.status = false;

            guildModel.findOneAndUpdate({ id: guild.id }, { raidmode: settings }, err => {
                if(err) throw err;
                else sendResponse(options, {
                    embeds: [new SuccessEmbed('Raidmode disattivata')]
                })
            })
            return;
        }

        if(operation === 'action') {
            const action = args[1];
            if(action == 'ban' || action == 'kick' || action == 'mute') {
                if(settings.action == action) return { embeds: [new ErrorEmbed(`Azione già impostata a ${action}`)]};
                else settings.action = action;
                guildModel.findOneAndUpdate({ id: guild.id }, { raidmode: settings }, err => {
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
    }
}