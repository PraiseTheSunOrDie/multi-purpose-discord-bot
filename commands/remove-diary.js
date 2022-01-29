const diaryModel = require('../models/diary.js');

module.exports = {
    data: {
        name: 'remove-diary',
        category: 'Owner',
        description: 'Rimuove un elemento dal database del diario',
        usage: 'remove-diary [image url]',
        aliases: ['rd'],
        permissions: {
            client: ['SEND_MESSAGES', 'ATTACH_FILES'],
            member: ['BOT_OWNER']
        },
        cooldown: 0,
        testOnly: true,
        slash: false,
        arguments: [
            {
                name: 'image_url',
                description: 'Elemento da rimuovere',
                required: true,
                type: 'STRING'
            }
        ]
    },
    run: async(options) => {
        const args = options.resolve('ARGS');
        const url = args[0];

        const data = await diaryModel.deleteOne({ url: url });
        if(!data) return;
        return { content: 'Elemento rimosso'};
    }
}