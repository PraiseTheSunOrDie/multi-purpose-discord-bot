const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const axios = require('axios');

const API_KEY = process.env.CAT_API;

module.exports = {
    data: {
        name: 'cat',
        category: 'Image',
        description: 'Gatto 🐱',
        usage: 'cat <options>',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: null
        },
        cooldown: 3,
        testOnly: false,
        slash: true,
    },
    run: async(options) => {
        let url = `https://api.thecatapi.com/v1/images/search?api_key=${API_KEY}`;

        const response = await axios.get(url);
        const embed = new MessageEmbed()
            .setColor(config.color)
            .setTitle('Meow 🐱')
            .setImage(response.data[0].url)
            .setFooter({ text: `Image ID: ${response.data[0].id}` })

        return { embeds: [embed] };
    }
}