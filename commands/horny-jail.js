const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    data: {
        name: 'horny-jail',
        category: 'Image',
        description: 'BONK! Go to horny jail!',
        usage: 'horny-jail <@user>',
        aliases: ['jail', 'hornyjail'],
        permissions: {
            client: ['SEND_MESSAGES', 'ATTACH_FILES'],
            member: null
        },
        cooldown: 5,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'member',
                description: 'Utente sul quale eseguire il comando',
                required: false,
                type: 'USER'
            }
        ]
    },
    run: async(options) => {
        const client = options.client;
        const args = options.resolve('ARGS');
        const guild = options.resolve('GUILD');
        const members = await options.resolve('MENTIONED_MEMBERS');

        let target1;
        let target2;

        if(members.lenght == 0) {
            target1 = client.user;
            target2 = options.resolve('AUTHOR_USER');
        } else if(members.lenght > 1) {
            target1 = members[0]?.user ?? await guild.members.fetch(args[0])?.user;
            target2 = members[1]?.user ?? await guild.members.fetch(args[1])?.user;
        } else {
            target1 = options.resolve('AUTHOR_USER');
            target2 = members[0]?.user ?? await guild.members.fetch(args[0])?.user;
        }

        const canvas = Canvas.createCanvas(1414, 760);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./resources/images/doggo.jpg')
        const avatar1 = await Canvas.loadImage(target1.displayAvatarURL({ format: 'jpg' }))
        const avatar2 = await Canvas.loadImage(target2.displayAvatarURL({ format: 'jpg' }))
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.drawImage(avatar2, 965, 421, 250, 250);
        context.drawImage(avatar1, 370, 174, 250, 250);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'simp-card.png');

        return { files: [attachment] };
    }
}