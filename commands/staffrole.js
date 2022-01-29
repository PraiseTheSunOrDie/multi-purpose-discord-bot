const { MessageEmbed } = require('discord.js');
const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const guildModel = require('../models/guild.js');
const { sendResponse, pause } = require('../utils/helpers');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'staffrole',
        category: 'Settings',
        description: 'Imposta o rimuove un ruolo dello staff, che sarà immune a tutti i comandi di moderazione',
        usage: 'staffrole [set/remove/list] <role>',
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
                name: 'add',
                description: 'Imposta un ruolo',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'role',
                        description: 'Ruolo dello staff',
                        required: true,
                        type: 'ROLE'
                    }
                ]
            },
            {
                name: 'remove',
                description: 'Rimuove un ruolo',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'role',
                        description: 'Ruolo dello staff',
                        required: true,
                        type: 'ROLE'
                    }
                ]
            },
            {
                name: 'list',
                description: 'Lista di ruoli dello staff',
                type: 'SUB_COMMAND'
            }
        ]
    },
    run: async(options) => {
        const args = options.resolve('ARGS');
        const guild = options.resolve('GUILD');
        const roles = await options.resolve('MENTIONED_ROLES');
        const data = await guildModel.findOne({ id: guild.id });
        const staff = new Set(data.staffRoles);
        const action = args[0];
        const role = roles[0];

        if(action === 'add') {
            if(!role) return { embeds: [new ErrorEmbed('Ruolo non valido')], ephemeral: true };
            if(staff.has(role.id)) return { embeds: [new ErrorEmbed('Ruolo già presente')], ephemeral: true };

            staff.add(role.id);
            
            guildModel.findOneAndUpdate({ id: guild.id }, { staffRoles: Array.from(staff)}, err => {
                if(err) throw err;
                else sendResponse(options, { embeds: [new SuccessEmbed(`Ruolo aggiunto: <@&${role.id}>`)] });
            })
        }
        if(action === 'remove') {
            if(!role) return { embeds: [new ErrorEmbed('Ruolo non valido')], ephemeral: true };
            if(!staff.has(role.id)) return { embeds: [new ErrorEmbed('Ruolo non presente')], ephemeral: true };

            staff.delete(role.id);
            
            guildModel.findOneAndUpdate({ id: guild.id }, { staffRoles: Array.from(staff)}, err => {
                if(err) throw err;
                else sendResponse(options, { embeds: [new SuccessEmbed(`Ruolo rimosso: <@&${role.id}>`)] });
            })
        }
        if(action === 'list') {
            if(staff.size == 0) {
                const embed = new MessageEmbed()
                .setDescription('Nessun ruolo impostato')
                .setColor(config.color)

                return { embeds: [embed] };
            }
            else {
                let list = Array.from(staff).map((id) => {
                    return `<@&${id}>`
                });

                
    
                const embed = new MessageEmbed()
                .setTitle('Ruoli dello staff')
                .setDescription(list.join(', '))
                .setColor(config.color)

                return { embeds: [embed] };
            }
        }
    }

}