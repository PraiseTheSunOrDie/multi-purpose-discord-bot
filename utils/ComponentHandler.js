class ComponentHandler {
    constructor(options) {
        this.client = options.client;
        this.message = options.message;
        this.components = new Map();
        this.timeout = options.timeout;
        this.filter = options.filter ?? (() => true);
        this.disabled = false;

        options.components.forEach(element => {
            this.components.set(element.id, element.callback);
        });

        if(this.timeout) {
            setTimeout(() => {
                this.message.components.forEach(row => {
                    row.components.forEach(component => {
                        component.setDisabled(true);
                    })
                    this.message.edit({ components: [row] });
                });
                this.disabled = true;
            }, this.timeout * 1000);
        }
        
        this.client.on('interactionCreate', async interaction => {
            if(this.disabled) return;
            if(!interaction.isMessageComponent()) return;
            if(!await this.filter(interaction)) {
                return interaction.reply({
                    content: 'Questa non è la tua interazione',
                    ephemeral: true
                })
            }
            
            if(interaction.message.id == this.message.id) {
                if(this.components.has(interaction.customId)) {
                    const callback = this.components.get(interaction.customId);
                    callback(interaction);
                }
            }

        }) 
    }
    
}

module.exports = ComponentHandler;