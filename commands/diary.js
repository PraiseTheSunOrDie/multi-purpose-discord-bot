const config = require('../config.json');
const diaryModel = require('../models/diary.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getRandomInt, makeId } = require('../utils/helpers');
const ComponentHandler = require('../utils/ComponentHandler');

module.exports = {
    data: {
        name: 'diary',
        category: 'Image',
        description: 'A random cringe moment',
        usage: 'diary',
        aliases: ["d", "cringe"],
        permissions: {
            client: ['SEND_MESSAGES', 'ATTACH_FILES'],
            member: null
        },
        cooldown: 3,
        testOnly: false,
        slash: true
    },
    run: async(options) => {
        const client = options.client;
        const author = options.resolve('AUTHOR_MEMBER');

        const dim = await diaryModel.count();
        var index = getRandomInt(dim);
        var data = await diaryModel.findOne().skip(index);

        if(!data) return console.log("Database is empty");

        const embed = new MessageEmbed()
            .setTitle("A random cringe moment")
            .setDescription(data.description)
            .setImage(data.url)
            .setFooter({ text: `Immagine numero ${index + 1} su ${dim}` })
            .setColor(config.color)

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
                                var index = getRandomInt(dim);
                                var data = await diaryModel.findOne().skip(index);
                                embed.setDescription(data.description);
                                embed.setImage(data.url)
                                embed.setFooter({ text: `Immagine numero ${index + 1} su ${dim}` });

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
                        }
                    ],
                    filter: (i => i.member.id == author.id)
                })
            }
        }
    }
}