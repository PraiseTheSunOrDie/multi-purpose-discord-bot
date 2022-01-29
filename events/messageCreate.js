const { guildDatabaseCheck, userDatabaseCheck, checkPermissions, commandCounter } = require('../utils/helpers');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { ErrorEmbed } = require('../utils/embeds');
const OptionResolver = require('../utils/CommandOptionResolver');
const guildModel = require('../models/guild.js')
const config = require('../config.json');

module.exports = async(client, message) => {
    await guildDatabaseCheck(message.guild);
    await userDatabaseCheck(message.member);
    if(message.author.bot) return;
    
    
    // * Command Execution
    const data = await guildModel.findOne({ id: message.guild.id });
    const prefix = data?.prefix;
    if(message.content.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        
        let cmd = client.commands.get(command) || client.aliases.get(command);
        if(!cmd) return;
        let cooldown = client.cooldowns.get(cmd.data.name);

        if(cmd.data.testOnly && message.guild.id != config.testGuild) {
            return message.reply('Il comando non è ancora disponibile');
        }
        if(!checkPermissions({
            permissions: cmd.data.permissions,
            channel: message.channel,
            client: message.guild.me,
            member: message.member,
            callback: (type, perms) => {
                let embed = new MessageEmbed().setColor('RED');
                switch(type) {
                    case 'CLIENT':
                        embed.setTitle('❌ Non ho il permesso 😩');
                        embed.setDescription(`Potrebbe mancarmi uno dei seguenti permessi:\n\n${perms.join(', ')}`);
                        break;
                    case 'MEMBER':
                        embed.setTitle('❌ Non hai il permesso 🤡');
                        embed.setDescription(`Devi avere almeno uno dei seguenti permessi:\n\n${perms.join(', ')}`);
                        break;
                }
                message.channel.send({ embeds: [embed] });
            }
        })) return;

        if(cooldown.has(message.author.id)) {
            return message.reply('Il comando è in cooldown')
        }
        if(cmd.data.arguments) {
            const arguments = new Set(cmd.data.arguments);
            let minArgs = 0;
            for(const argument of arguments) {
                if(argument.required) minArgs = minArgs + 1;
                if(argument.type == 'SUB_COMMAND' || argument.type == 'SUB_COMMAND_GROUP') { 
                    minArgs = minArgs + 1;
                    if(args[0] == argument.name && argument.options) {
                        for(const option of argument.options) {
                            if(option.required) minArgs = minArgs + 1;
                            if(option.type == 'SUB_COMMAND') {
                                minArgs = minArgs + 1;
                                break;
                            }
                        }
                        break;
                    }
                    if(!args[0] || args[0] == argument) break;
                    else minArgs = minArgs - 1;  
                }
            }
            if(args.length < minArgs) {
                const embed = new MessageEmbed()
                    .setTitle('❌ Missing Argument')
                    .setDescription(`\`${prefix}${cmd.data.usage}\``)
                    .setColor('RED')
                message.channel.send({ embeds: [embed] });
                return;
            }
        }

        cmd.run(new OptionResolver(client, message)).then(response => {
            cooldown.add(message.author.id);
            setTimeout(() => {
                cooldown.delete(message.author.id)
            }, cmd.data.cooldown * 1000);
            if(!response) return;
            message.channel.send({
                content: response.content,
                embeds: response.embeds,
                files: response.files,
                components: response.components
            }).then(msg => {
                if(!response.callback) return;
                response.callback(msg);
            })
        }).catch((error) => {
            message.channel.send({ embeds: [new ErrorEmbed('Errore')]});
            console.log(error);
        });

        commandCounter(cmd, message.member);
    }

    //emojify (Uncompleted)
    if(data.emojiSystem) {
        if(message.startsWith(':') && message.endsWith(':')) {
            
        }
    }
}
