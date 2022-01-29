class CommandOptionResolver {
    constructor(client, message, interaction) {
        if(!client) throw new TypeError('"Client" is missing');
        if(!message && !interaction) throw new TypeError;
        this.client = client;
        this.message = message;
        this.interaction = interaction;
    }
    
    resolve(flag) {
        if(flag == 'AUTHOR_USER') {
            return this?.message?.author ?? this?.interaction?.user;
        }
        if(flag == 'AUTHOR_MEMBER') {
            return this?.message?.member ?? this?.interaction?.member;
        }
        if(flag == 'GUILD') {
            return this?.message?.guild ?? this?.interaction?.guild;
        }
        if(flag == 'CHANNEL') {
            return this?.message?.channel ?? this?.interaction?.channel;
        }
        if(flag == 'ARGS') {
            if(this.message) {
                return this.message.content.toLowerCase().split(' ').slice(1);
            }
            if(this.interaction) {
                let args = [];
                if(this.interaction?.options?._group) {
                    args.push(this.interaction.options._group);
                }
                if(this.interaction?.options?._subcommand) {
                    args.push(this.interaction.options._subcommand);
                }
                if(this.interaction?.options?._hoistedOptions) {
                    this.interaction.options._hoistedOptions.forEach(option => {
                        args.push(option.value);
                    });
                }
                return args;
            }
        }
        if(flag == 'MENTIONED_MEMBERS') {
            let list = [];
            if(this.message) {
                const guild = this.message.guild;
                const args = this.message.content.split(' ').slice(1);
                for(const arg of args) {
                    if(arg.startsWith('<@!') && arg.endsWith('>')) {
                        const id = arg.slice(3, -1);
                        guild.members.fetch(id).then((member)=>list.push(member)).catch(error=>console.log(error));
                    }
                }
            }
            if(this.interaction) {
                const options = this.interaction.options?._hoistedOptions;
                for(const option of options) {
                    if(option.type == 'USER' && option.member) {
                        list.push(option.member);
                    }
                }
            }
            return list;
        }
        if(flag == 'MENTIONED_ROLES') {
            let list = [];
            if(this.message) {
                const guild = this.message.guild;
                const args = this.message.content.split(' ').slice(1);
                for(const arg of args) {
                    if(arg.startsWith('<@&') && arg.endsWith('>')) {
                        const id = arg.slice(3, -1);
                        guild.roles.fetch(id).then((role)=>list.push(role)).catch(error=>console.log(error));
                    }
                }
            }
            if(this.interaction) {
                const options = this.interaction.options?._hoistedOptions;
                for(const option of options) {
                    if(option.type == 'ROLE' && option.role) {
                        list.push(option.role);
                    }
                }
            }
            return list;
        }
        if(flag == 'MENTIONED_CHANNELS') {
            let list = [];
            if(this.message) {
                const guild = this.message.guild;
                const args = this.message.content.split(' ').slice(1);
                for(const arg of args) {
                    if(arg.startsWith('<#') && arg.endsWith('>')) {
                        const id = arg.slice(2, -1);
                        guild.channels.fetch(id).then((channel)=>list.push(channel)).catch(error=>console.log(error));
                    }
                }
            }
            if(this.interaction) {
                const options = this.interaction.options?._hoistedOptions;
                for(const option of options) {
                    if(option.type == 'CHANNEL' && option.channel) {
                        list.push(option.channel);
                    }
                }
            }
            return list;
        }
    }
}

module.exports = CommandOptionResolver;