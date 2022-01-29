const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getMeme, makeId } = require('../utils/helpers');
const ComponentHandler = require('../utils/ComponentHandler');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'meme',
        category: 'Image',
        description: 'Meme da r/memesITA',
        usage: 'meme <subreddit>',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES', 'ATTACH_FILES'],
            member: null
        },
        cooldown: 3,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'subreddit',
                description: 'Subreddit dal quale prendere il meme',
                required: false,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const client = options.client;
        const args = options.resolve('ARGS');
        const author = options.resolve('AUTHOR_MEMBER');

        const subreddit = args[0];

        if(!subreddit) subreddit = 'r/memesITA';
        if(!subreddit.startsWith('r/')) subreddit = 'r/' + subreddit;
    
        const url = `https://www.reddit.com/${subreddit}/hot/.json`;

        const successButtonId = makeId(client);
        const destructiveButtonId = makeId(client);
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(successButtonId)
                .setStyle('SUCCESS')
                .setLabel('Prossimo'),
            new MessageButton()
                .setCustomId(destructiveButtonId)
                .setStyle('DANGER')
                .setLabel('Fine')
        )

        var data = await getMeme(url);

        var embed = new MessageEmbed()
            .setTitle(data.title)
            .setImage(data.url)
            .setURL(`https://www.reddit.com${data.permalink}`)
            .setFooter({ text: `👍${data.ups}, 💬${data.num_comments}` })
            .setColor(config.color)

        return {
            embeds: [embed],
            components: [row],
            callback: async(msg) => {
                new ComponentHandler({
                    client: client,
                    message: msg,
                    timeout: 180,
                    components: [
                        {
                            id: successButtonId,
                            callback: async(i) => {
                                var data = await getMeme(url);
                                var embed = new MessageEmbed()
                                    .setTitle(data.title)
                                    .setImage(data.url)
                                    .setURL(`https://www.reddit.com${data.permalink}`)
                                    .setFooter({ text: `👍${data.ups}, 💬${data.num_comments}` })
                                    .setColor(config.color)
                
                                i.update({ embeds: [embed] });
                            }
                        },
                        {
                            id: destructiveButtonId,
                            callback: async(i) => {
                                row.components.forEach(component => {
                                    component.setDisabled(true)
                                });
                                i.update({ components: [row] });
                            }
                        },
                    ],
                    filter: (i => i.member.id == author.id)
                })
            }
        }
    }
}