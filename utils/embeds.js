const { MessageEmbed } = require('discord.js');

class ErrorEmbed extends MessageEmbed {
    constructor(text) {
        super();
        this.description = `**<:xmark:934116411951964243> ${text}**`;
        this.color = 'RED'
    }
}

class SuccessEmbed extends MessageEmbed  {
    constructor(text) {
        super();
        this.description = `**<a:check:937014744240500766> ${text}**`;
        this.color = 'GREEN'
    }
}

module.exports.ErrorEmbed = ErrorEmbed;
module.exports.SuccessEmbed = SuccessEmbed;