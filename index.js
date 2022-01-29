const { Client, Intents } = require('discord.js');
const mongoose = require('mongoose');

require('dotenv').config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
    ]
});

['command', 'event', 'collections'].forEach(handler =>{
    require(`./handlers/${handler}.js`)(client);
})

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to the database")
}).catch((error)=>{
    console.log(error)
});

client.login(process.env.TOKEN);