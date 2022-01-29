const { MessageEmbed } = require('discord.js');
const { ErrorEmbed } = require('../utils/embeds');
const axios = require('axios');
const config = require('../config.json');

const API_KEY = process.env.WEATHER_API;

module.exports = {
    data: {
        name: 'weather',
        category: 'Extra',
        description: 'Informazioni sul meteo di una città',
        usage: 'weather [city]',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES'],
            member: null
        },
        cooldown: 0,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'city',
                description: 'Verrà mostrato il meteo di questa città',
                required: true,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const args = options.resolve('ARGS');
        const location = args.join(' ');

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}&lang=it`;

        let response;
        let city;

        try {
            response = await axios.get(url)
            city = response.data;
        }
        catch(error) {
            console.log(error);
            return { embeds: [new ErrorEmbed('Qualcosa è andato storto')] };
        }

        const embed = new MessageEmbed()
            .setColor(config.color)
			.setTitle(`Meteo a: ${city.name}`)
			.setThumbnail(`http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`)
			.setDescription(city.weather[0].description)
			.addFields(
				{
					name: 'Temperatura attuale: ',
					value: `${city.main.temp} °C`,
					inline: true,
				},
				{
					name: 'Temperatura percepita: ',
					value: `${city.main.feels_like} °C`,
				},
				{
					name: 'Temperatura massima: ',
					value: `${city.main.temp_max} °C`,
					inline: true,
				},
				{
					name: 'Temperatura minima: ',
					value: `${city.main.temp_min} °C`,
					inline: true,
				},
				{
					name: 'Pressione: ',
					value: `${city.main.pressure} Pa`,
				},
				{
					name: 'Umidità: ',
					value: `${city.main.humidity}%`,
					inline: true,
				},
				{
					name: 'Velocità del vento:',
					value: `${city.wind.speed} m/s`,
				},
				{
					name: 'Direzione del vento: ',
					value: `${city.wind.deg}°`,
					inline: true,
				},
			)
			.setFooter({ text: `City ID: ${city.sys.id}` });

        return { embeds: [embed] };
    }
}