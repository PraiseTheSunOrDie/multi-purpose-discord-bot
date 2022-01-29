const { MessageEmbed } = require('discord.js');
const { ErrorEmbed } = require('../utils/embeds');
const { userDatabaseCheck } = require('../utils/helpers');
const userModel = require('../models/user.js');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'warnings',
        category: 'Moderation',
        description: 'Mostra il numero di warn di un utente',
        usage: 'warnings [user]',
        aliases: ['infractions'],
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
                description: 'Membro selezionato',
                required: true,
                type: 'USER'
            }
        ]
    },
    run: async(options) => {
        const client = options.client;
        const guild = options.resolve('GUILD');
        const args = options.resolve('ARGS');
        const members = await options.resolve('MENTIONED_MEMBERS');
        
        const target = members[0] 

        if(!target) return { embeds: [new ErrorEmbed('Devi specificare un membro valido')] };

        await userDatabaseCheck(target);
        const data = await userModel.findOne({ id: target.id });
        const embed = new MessageEmbed().setAuthor({ name: `Infrazioni di ${target.user.tag}`, iconURL: target.user.displayAvatarURL() }).setColor(config.color);

        const warnings = [];
        var lastDay = 0;
        var lastWeek = 0;
        var total = 0;

        for(const warning of data.warnings) {
            if(warning.guild == guild.id) {
                const moderator = await client.users.fetch(warning.author);
                const date = warning.date.raw;
                const today = Date.now();
                const infraction = {
                    name: `${warning.date.formatted} • Moderatore: ${moderator.tag}`,
                    value: warning.reason
                }
                warnings.push(infraction);
                total = total + 1;
                if(today - date <= 86400000 ) lastDay = lastDay +1;
                if(today - date <= 604800016) lastWeek = lastWeek +1;
            }
        }

        if(!warnings[0]) {
            embed.setDescription('Nessuna infrazione');
            return { embeds: [embed] };
        }
        else {
            embed
                .addField('Ultime 24 ore', `${lastDay} infrazioni`, true)
                .addField('Ultima settimana', `${lastWeek} infrazioni`, true)
                .addField('Totale', `${total} infrazioni`, true)
                .addFields(warnings)

            return { embeds: [embed] };
        }
    }
}