const config = require('../config.json');
const Math = require('math');
const guildModel = require('../models/guild.js');
const userModel = require('../models/user.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');

module.exports = class Helpers {

    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    static getRandomItem(set) {
        let items = Array.from(set);
        return items[Math.floor(Math.random() * items.length)];
    }

    static makeId(client) {
        const generate = () => {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
            for (var i = 0; i < 10; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            
            return text;
        }
        let id;
        id = generate();
        while(client.components.has(id)) {
            id = generate();
        }
        client.components.add(id);
        return id;
    }

    static capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static checkOwnership(member) {
        const owner = process.env.OWNER_ID;
        if(member.id === owner) return true;
        else return false;
    }

    static hasPermission(flag, member, channel) {
        const perms = channel.permissionsFor(member);
        if(flag == 'BOT_OWNER') {
            return Helpers.checkOwnership(member);
        } else if(flag == 'GUILD_OWNER') {
            if(member.id === member.guild.ownerId) return true;
            else return false;
        } else {
            if(perms.has(flag)) return true;
            else return false;
        }
    }

    static checkPermissions(options) {
        if(options.permissions.member) {
            const perms = options.permissions.member;
            let bool = false;
            for(let i = 0; i < perms.length && bool == false; i++) {
                if(Helpers.hasPermission(perms[i], options.member, options.channel)) {
                    bool = true;
                }
            }
            if(bool == false) {
                options.callback('MEMBER', perms.map((p) => {
                    p = '`' + p + '`';
                    return p;
                }))
                return false;
            }
        }
        if(options.permissions.client) {
            const perms = options.permissions.client;
            let bool = true;
            for(let i = 0; i < perms.length && bool == true; i++) {
                if(!Helpers.hasPermission(perms[i], options.client, options.channel)) {
                    bool = false;
                }
            }
            if(bool == false) {
                options.callback('CLIENT', perms.map((p) => {
                    p = '`' + p + '`';
                    return p;
                }))
                return false;
            }
        }
        return true;
    }

    static async sendResponse(data, options) {
        if(data.message) {
            return data.message.channel.send({
                content: options.content,
                embeds: options.embeds,
                files: options.files,
                components: options.components
            });
        }
        if(data.interaction) {
            await data.interaction.reply({
                content: options.content,
                embeds: options.embeds,
                files: options.files,
                components: options.components,
                ephemeral: options.ephemeral
            })
            return data.interaction.fetchReply();
        }
    }

    static pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async open(file) {
        var rl = readline.createInterface({
            input: fs.createReadStream(file),
            output: process.stdout,
            terminal: false
        });

        let array = [];

        rl.on('line', line => {
            array.push(line);
        })

        return array;
    }

    static async guildDatabaseCheck(guild) {
        let data;
        try {
            data = await guildModel.findOne({ id: guild.id });
            if(!data) {
                let server = await guildModel.create({
                    id: guild.id,
                    name: guild.name,
                    prefix: config.prefix
                })
                server.save();
                console.log(`${guild.name} added to the database. ID: ${guild.id}`);
            }
            else {
                if(data.name != guild.name) {
                    await guildModel.findOneAndUpdate({ id: guild.id }, { name: guild.name });
                }
            }
        }
        catch(error) {
            console.log(error);
            return;
        }
    }

    static async userDatabaseCheck(member) {
        let data;
        try {
            if(member.user.bot) return;
            data = await userModel.findOne({ id: member.id });
            if(!data) {
                let user = await userModel.create({
                    id: member.id,
                    name: member.user.tag
                });
                user.save();
                console.log(`${member.user.tag} added to the database. ID: ${member.id}`);
            }
            else {
                if(data.name != member.user.tag) {
                    await userModel.findOneAndUpdate({ id: member.id }, { name: member.user.tag });
                }
            }
        }
        catch(error) {
            return;
        }
    }

    static isStaff(list, member) {
        list.forEach(role => {
            if(member.roles.cache.has(role)) return true;
        })
        return false;
    }

    static testURL(text) {
        try {
            const url = new URL(text);
        } catch(error) {
            return false;
        }
        return true;
    }

    static testImage(url) {
        if ( typeof url !== 'string' ) return false;
        return !!url.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp|PNG)$/gi);
    }

    static testOnly(data) {
        if(data.testOnly) {
            return true;
        }
        else return false;
    }

    static async getMeme(url) {
        const get = async(url) =>  {
            const res = await axios.get(url);
            return res 
        }

        let response = await get(url);
        let count = 0;
        while(!response?.data?.data && count < 30) {
            response = await get(url);
            count = count + 1;
        }

        const data = response.data.data.children[getRandomInt(response.data.data.children.length + 1)].data;
        return data;
    } 

    static async commandCounter(command, member) {
        if(command.data.category == 'Owner') return;
        const data = await userModel.findOne({ id: member.id});
        if(!data) return;
        const commands = data.commands + 1;
        await userModel.findOneAndUpdate({ id: member.id }, { commands: commands });

        if(commands == 100 || commands == 500 || commands == 1000 ) {
            const embed = new MessageEmbed()
            .setTitle(`Congratulazioni ${member.user.username}`)
            .setDescription(`Hai eseguito ${commands} comandi 🎉`)
            .setColor(config.color)

            const channel = await member.guild.channels.cache.find(channel => 
                channel.name.includes('general') || channel.name.includes('main') || channel.name.includes('salotto')
            )

            if(channel) channel.send({ content: `<@${member.id}>`, embeds: [embed] });
            else member.send({ content: `<@${member.id}>`, embeds: [embed] });
        }
    }

    static async log(guild, log) {
        const data = await guildModel.findOne({ id: guild.id });

        if(!data.logChannel) return;

        const channel = await guild.channels.fetch(data.logChannel);
        
        const embed = new MessageEmbed()
        .setTitle(log.action)
        .setColor(config.color)
        .addFields(
            { name: 'Moderator', value: `\`${log.moderator}\``, inline: true },
            { name: 'Target', value: `\`${log.target}\``, inline: true },
        )

        if(log.reason) embed.addField('Reason', log.reason);

        channel?.send({ embeds: [embed] });
    }

}