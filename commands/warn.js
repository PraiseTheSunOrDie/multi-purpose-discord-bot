const { MessageEmbed } = require('discord.js');
const { ErrorEmbed } = require('../utils/embeds');
const userModel = require('../models/user.js');
const guildModel = require('../models/guild');
const { sendResponse, userDatabaseCheck, isStaff } = require('../utils/helpers');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'warn',
        category: 'Moderation',
        description: "Warna un utente",
        usage: 'warn [user] <reason>',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: ['KICK_MEMBERS']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'member',
                description: 'Utente da warnare',
                required: true,
                type: 'USER'
            },
            {
                name: 'reason',
                description: 'Motivo del warn',
                required: false,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const author = options.resolve('AUTHOR_MEMBER');
        const guild = options.resolve('GUILD');
        const args = options.resolve('ARGS');
        const members = await options.resolve('MENTIONED_MEMBERS');
        var data = await guildModel.findOne({ id: guild.id });

        const target = members[0] ?? await guild.members.fetch(args[0]);
        let reason = args.slice(1).join(' ');
        const staff = data?.staffRoles;

        if(!target) {
            return { embeds: [new ErrorEmbed('Devi specificare un membro valido')], ephemeral: true };
        }
        
        if(target.user.bot || isStaff(staff, target)) {
            return { embeds: [new ErrorEmbed('Non puoi farlo 😔')], ephemeral: true };
        }
        if(!reason) {
            reason = 'No reason given.';
        }

        await userDatabaseCheck(target);

        var data = await userModel.findOne({ id: target.id });
        const warnings = new Set(data.warnings)
        const today = new Date();
        const rawDate = Date.now();
        const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

        const warning = {
            guild: guild.id,
            author: author.id,
            reason: reason,
            date: {
                raw: rawDate,
                formatted: date
            }
        }

        warnings.add(warning);

        userModel.findOneAndUpdate({ id: target.id }, { warnings: Array.from(warnings) }, err => {
            if(err) throw err;
            if(options.message) options.message.delete();
            target.send({ content: `Sei stato warnato in **${guild.name}** per il motivo: _${reason}_`}).catch(error => console.log(error));

            const embed = new MessageEmbed()
            .setTitle(`*${target.user.tag}* è stato warnato || ${reason}`)
            .setColor(config.color)

            sendResponse(options, { embeds: [embed] });
        });
    }
}