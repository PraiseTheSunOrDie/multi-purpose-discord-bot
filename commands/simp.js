const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    data: {
        name: 'simpcard',
        category: 'Image',
        description: 'Visualizza la simp card dell\'utente selezionato',
        usage: 'simp <@user>',
        aliases: ['simp', 'simp-card'],
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

        const canvas = Canvas.createCanvas(775, 575);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./resources/images/simp.png');
        const avatar = await Canvas.loadImage(target.displayAvatarURL({ format: 'png' }));

        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.drawImage(avatar, 22, 0, 84, avatar.naturalHeight, 59, 101, 254, 386);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'card.png');

        return { files: [attachment] };      
    }
}