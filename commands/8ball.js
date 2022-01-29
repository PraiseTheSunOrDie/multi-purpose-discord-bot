const { MessageAttachment } = require('discord.js');
const { getRandomItem } = require('../utils/helpers');
const Canvas = require('canvas');

const responses = [
    'Assolutamente sì',
    'Certamente',
    'Sì, senza alcun dubbio',
    'Direi proprio di sì',
    'Puoi starne certo',
    'Sembrerebbe di sì',
    'Credo sia probabile',
    'Sembra possibile',
    'Sì',
    'Può darsi',
    'Hmmm non saprei',
    'Chiedimelo dopo',
    'Non te lo dico',
    'Ma che cazzo ne so io',
    'Forse',
    'Non lo so',
    'Non ci contare',
    'Non ne sono affatto sicuro',
    'Può darsi di no',
    'Poco probabile',
    'Sembrerebbe di no',
    'Assolutamente no',
    'Che gran cazzata',
    'No, senza alcun dubbio',
    'No',
    'Non credo proprio'
]

module.exports = {
    data: {
        name: '8ball', 
        category: 'Fun',
        description: 'Magic 8 ball',
        usage: '8ball [question]',
        aliases: [],
        permissions: {
            client: ['SEND_MESSAGES', 'ATTACH_FILES'],
            member: null
        },
        cooldown: 3,
        testOnly: false,
        slash: true,
        arguments: [
            {
                name: 'question',
                description: 'Domanda alla quale cerchi una risposta',
                required: true,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const response = getRandomItem(responses);
    
        const canvas = Canvas.createCanvas(900, 900);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./resources/images/eight_ball.png');

        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.fillStyle = '#696969';
        context.beginPath();
        context.arc(450, 450, 255, 0, 2 * Math.PI);
        context.fill();

        context.font = '42px verdana';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#add8e6';
        context.fillText(response, 450, 450 , 500);

        const attachment = new MessageAttachment(canvas.toBuffer(), '8ball.png');

        return {
            content: `**La mia risposta è...**`,
            files: [attachment]
        }
    }
}