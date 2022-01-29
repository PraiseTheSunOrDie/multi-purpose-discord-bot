const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    data: {
        name: 'clown',
        category: 'Image',
        description: '🤡',
        usage: 'clown <@user>',
        aliases: [],
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
        const args = options.resolve('ARGS');
        const guild = options.resolve('GUILD');
        const members = await options.resolve('MENTIONED_MEMBERS');
        let target = members[0]?.user ?? await guild.members.fetch(args[0])?.user;

        if(!target) target = options.resolve('AUTHOR_USER');

        const canvas = Canvas.createCanvas(755, 566);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./resources/images/clown.jpg');
        const avatar = await Canvas.loadImage(target.displayAvatarURL({ format: 'jpg' }));

        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.drawImage(avatar, 73, 212, 225, 215);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'certified-clown.png');

        return { files: [attachment] };
    }
}