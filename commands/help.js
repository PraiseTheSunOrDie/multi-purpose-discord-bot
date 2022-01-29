const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { makeId } = require('../utils/helpers');
const guildModel = require('../models/guild.js');
const config = require('../config.json');
const ComponentHandler = require('../utils/ComponentHandler');

const categories = ['Utility', 'Settings', 'Moderation', 'Fun', 'Image', 'Extra', ];

module.exports = {
    data: {
        name: 'help',
        category: 'Utility',
        description: 'Mostra la lista dei comandi',
        usage: 'help <command>',
        aliases: ['h', 'aiuto', 'commands', 'comandi'],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: null
        },
        cooldown: 10,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'command',
                description: 'Informazioni su un comando specifico',
                required: false,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const client = options.client;
        const guild = options.resolve('GUILD');
        const author = options.resolve('AUTHOR_MEMBER');
        const args = options.resolve('ARGS');

        const command = args[0];
        const cmd = client.commands.get(command) || client.aliases.get(command);
        const data = await guildModel.findOne({ id: guild.id });
        const prefix = data.prefix;

        if(!cmd) {
            const embed = new MessageEmbed()
            .setTitle('Categorie')
            .setDescription('Usa il menù di selezione per visualizzare i comandi di una categoria')
            .setColor(config.color)

            const commands = new Map();
            categories.forEach(category => {
                var cmds = client.commands.map((c) => {
                    if(c.data.category != category) return;
                    const field = {
                        name: `${prefix}${c.data.name}`,
                        value: c.data.description
                    }
                    return field;
                }).filter(c => c != undefined);
                commands.set(category, cmds);
                embed.addField(category, `${cmds.length} comandi`);
            })

            const customId = makeId(client);

            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(customId)
                    .setPlaceholder('Scegli una categoria')
                    .addOptions([
                        {
                            label: 'Tutti i comandi',
                            value: 'all',
                            emoji: '🔢'
                        },
                        {
                            label: 'Informazioni',
                            value: 'Utility',
                            emoji: '🤖'
                        },
                        {
                            label: 'Impostazioni',
                            value: 'Settings',
                            emoji: '⚙️'
                        },
                        {
                            label: 'Moderazione',
                            value: 'Moderation',
                            emoji: '🛡️'
                        },
                        {
                            label: 'Fun',
                            value: 'Fun',
                            emoji: '😸'
                        },
                        {
                            label: 'Immagini e meme',
                            value: 'Image',
                            emoji: '💻'
                        },
                        {
                            label: 'Extra',
                            value: 'Extra',
                            emoji: '‼️'
                        }
                    ])
            )

            return {
                embeds: [embed],
                components: [row],
                callback: async(msg) => {
                    new ComponentHandler({
                        client: client,
                        message: msg,
                        timeout: 300,
                        filter: (i => i.member.id == author.id),
                        components: [
                            {
                                id: customId,
                                callback: async(i) => {
                                    if(i.values[0] === 'all') {
                                        let list = [];
                                        categories.forEach(category => {
                                            var cmds = client.commands.map((c) => {
                                                if(c.data.category != category) return;
                                                return `\`${prefix}${c.data.name}\``;
                                            }).filter(c => c != undefined);
                                            var field = {
                                                name: category,
                                                value: cmds.length === 0 ? "In progress." : cmds.join(", ")
                                            }
                                            list.push(field);
                                        })
                                        const embed = new MessageEmbed()
                                        .setTitle('Commands')
                                        .setDescription('Tutti i comandi')
                                        .addFields(list)
                                        .setColor(config.color)
                                        .setFooter({ text: `Usa ${prefix}[cmd] per maggiori informazioni a proposito di un singolo comando`})
                
                                        i.update({ embeds: [embed] });
                                    }
                                    else{
                                        const category = commands.get(i.values[0]);
                
                                        const embed = new MessageEmbed()
                                        .setTitle(i.values[0])
                                        .addFields(category)
                                        .setColor(config.color)
                                        .setFooter({ text: `Usa ${prefix}[cmd] per maggiori informazioni a proposito di un singolo comando`})
                                        
                
                                        i.update({ embeds: [embed] });
                                        
                                    }
                                }
                            }
                        ]
                    })
                }
            }
        }
        else {
            const embed = new MessageEmbed()
            .setTitle(cmd.data.name)
            .setDescription(cmd.data.description)
            .addFields(
                { name: 'Utilizzo', value: `\`${prefix}${cmd.data.usage}\`` },
                { name: 'Cooldown', value: `${cmd.data.cooldown} secondi` },
            )
            if(cmd.data.aliases) embed.addField('Aliases', cmd.data.aliases.join(", "));
            if(cmd.data.permissions) embed.addField('Permessi', `\`${cmd.data.permissions}\``);

            return { embeds: [embed] };
        }
    }
}