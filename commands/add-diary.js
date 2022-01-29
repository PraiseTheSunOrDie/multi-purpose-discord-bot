const diaryModel = require('../models/diary.js');
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');
const { pause, testImage } = require('../utils/helpers');

module.exports = {
    data: {
        name: 'add-diary',
        category: 'Owner',
        description: "Aggiunge un'immagine al database del diario",
        usage: 'add-diary [image url] <description>',
        aliases: ['add-d', 'a'],
        permissions: {
            client: ['SEND_MESSAGES', 'EMBED_LINKS'],
            member: ['BOT_OWNER']
        },
        cooldown: 0,
        testOnly: true,
        slash: false,
        arguments: [
            {
                name: 'image_url',
                description: 'Url da registrare',
                required: true,
                type: 'STRING'
            },
            {
                name: 'Description',
                description: 'Descrizione',
                required: false,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const client = options.client;
        const args = options.resolve('ARGS');
        let image = args[0];
        let description = args.slice(1).join(' ');
    
        if(!testImage(image)) return { content: 'Not an Image'};

        try{
            diaryModel.distinct("index", (err, indexes) => {
                if(err) throw err;
                let index = 0;
                indexes.forEach(i => {
                    if(i > index) index = i;
                })
                index = index + 1;
                client.diaryindex = index;
            })

            data = await diaryModel.findOne({ url: image });
            
            if(data) {
                if(interaction) return await interaction.reply({ content: 'Immagine già presente' , ephemeral: true });
                if(message) return message.reply("immagine già presente");
            }
            else {
                await pause(200);
                let record = await diaryModel.create({
                    index: client.diaryindex,
                    description: description,
                    url: image
                })
                record.save();
            }
        }
        catch(error) {
            console.log(error);
            return;
        }

        const embed = new MessageEmbed()
            .setTitle("A random cringe moment")
            .setDescription(description)
            .setImage(image)
            .setColor(config.color)

        
        return { content: 'Aggiunto al database :thumbsup:', embeds: [embed] };
    }
}