const { ErrorEmbed, SuccessEmbed } = require('../utils/embeds');
const { sendResponse, userDatabaseCheck } = require('../utils/helpers');
const userModel = require('../models/user.js');

module.exports = {
    data: {
        name: 'clearwarns',
        category: 'Moderation',
        description: 'Rimuove le warn di un utente',
        usage: 'clearwarns [user]',
        aliases: ['clearwarn', 'remove-all-infractions'],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: ['ADMINISTRATOR']
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'member',
                description: 'Target al quale togliere le warn',
                required: true,
                type: 'USER'
            }
        ]
    },
    run: async(options) => {
        const args = options.resolve('ARGS');
        const guild = options.resolve('GUILD');
        const member_mentions = await options.resolve('MENTIONED_MEMBERS');
        
        const target = member_mentions[0] ??  await guild.members.fetch(args[0]);

        await userDatabaseCheck(target);
        const data = await userModel.findOne({ id: target.id });

        if(!data.warnings) {
            const embed = new ErrorEmbed().setDescription(`${target.user.tag} non ha alcuna infrazione`);
            return { embeds: [embed] };
        }

        const warnings = new Set(data.warnings);
        let count = 0;

        warnings.forEach(warning => {
            if(warning.guild == guild.id) {
                warnings.delete(warning);
                count = count +1;
            }
        })

        if(count === 0) {
            const embed = new ErrorEmbed().setDescription(`${target.user.tag} non ha alcuna infrazione`);
            return { embeds: [embed] };
        }
        userModel.findOneAndUpdate({ id: target.id }, { warnings: warnings }, err => {
            const embed = new SuccessEmbed(`✅ Le infrazioni di ${target.user.tag} sono state rimosse`)
            sendResponse(options, { embeds: [embed] });
        })
        return;
    }
}