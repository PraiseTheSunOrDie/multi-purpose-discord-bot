const guildModel = require('../models/guild.js');
const { isStaff, log } = require('./helpers');

module.exports = class Moderation {

    static async ban(moderator, target, reason) {
        if(!moderator || !target) throw new Error('Missing parameters');
        const data = await guildModel.findOne({ id: moderator.guild.id });
        const staff = data?.staffRoles;
        if(target?.guild) {
            if(isStaff(staff, target)) {
                return Promise.reject('Non puoi bannare un membro dello staff');
            }
            if(!target.bannable) {
                return Promise.reject('Impossibile bannare questo utente');
            }

            if(!reason) {
                try {
                    await target.send({ content: `Sei stato bannato da **${moderator.guild.name}**`});
                } catch(error) {console.log(error)}
            } else {
                try {
                    await target.send({ content: `Sei stato bannato da **${moderator.guild.name}** per il motivo: _${reason}_`});
                } catch(error) {console.log(error)}
            }
        }
        try {
            await moderator.guild.bans.create(target, { days: 0, reason: reason });
        } catch(error) {
            return Promise.reject('Qualcosa è andato storto');
        }

        log(moderator.guild, {
            action: 'Member banned',
            moderator: moderator.user.tag,
            target: target?.user?.tag ?? target?.tag ?? target,
            reason: reason
        }).catch(error => console.log(error))

        return Promise.resolve({
            moderator: moderator.user,
            target: target?.user || target,
            reason: reason
        })
    }

    static async kick(moderator, target, reason) {
        if(!moderator || !target) throw new Error('Missing parameters');
        const data = await guildModel.findOne({ id: moderator.guild.id });
        const staff = data?.staffRoles;
        
        if(isStaff(staff, target)) {
            return Promise.reject('Non puoi espellere un membro dello staff');
        }
        if(!target.kickable) {
            return Promise.reject('Impossibile espellere questo utente');
        }

        if(!reason) {
            try {
                await target.send({ content: `Sei stato espulso da **${moderator.guild.name}**`});
            } catch(error) {console.log(error)}
        } else {
            try {
                await target.send({ content: `Sei stato espulso da **${moderator.guild.name}** per il motivo: _${reason}_`});
            } catch(error) {console.log(error)}
        }
        
        try {
            await target.kick(reason);
        } catch(error) {
            return Promise.reject('Qualcosa è andato storto');
        }

        log(moderator.guild, {
            action: 'Member kicked',
            moderator: moderator.user.tag,
            target: target.user.tag,
            reason: reason
        }).catch(error => console.log(error))

        return Promise.resolve({
            moderator: moderator.user,
            target: target.user,
            reason: reason
        })
    }

    static async mute(moderator, target, reason) {
        if(!moderator || !target) throw new Error('Missing parameters');
        const data = await guildModel.findOne({ id: moderator.guild.id });
        const staff = data?.staffRoles;
        
        if(isStaff(staff, target)) {
            return Promise.reject('Non puoi mutare un membro dello staff');
        }

        if(target.roles.highest.position > moderator.guild.me.roles.highest.position) {
            return Promise.reject('Non posso mutare questo membro');
        }
        if(!moderator.guild.roles.cache.find(role => role.name === 'Muted')) {
            return Promise.reject('Non è presente il ruolo `Muted`');
        }

        if(!reason) {
            try {
                await target.send({ content: `Sei stato mutato in **${moderator.guild.name}**`});
            } catch(error) {console.log(error)}
        } else {
            try {
                await target.send({ content: `Sei stato mutato in **${moderator.guild.name}** per il motivo: _${reason}_`});
            } catch(error) {console.log(error)}
        }

        try {
            await target.roles.add(target.guild.roles.cache.find(role => role.name === 'Muted'));
        } 
        catch(error) {
            return Promise.reject('Qualcosa è andato storto');
        }

        log(moderator.guild, {
            action: 'Member muted',
            moderator: moderator.user.tag,
            target: target.user.tag,
            reason: reason
        }).catch(error => console.log(error))

        return Promise.resolve({
            moderator: moderator.user,
            target: target.user,
            reason: reason
        })
    }

    static async timeout(moderator, target, duration, reason) {
        if(!moderator || !target || !duration) throw new Error('Missing parameters');
        const data = await guildModel.findOne({ id: moderator.guild.id });
        const staff = data?.staffRoles;
        if(isStaff(staff, target)) {
            return Promise.reject('Non puoi mettere in timeout un membro dello staff');
        }
        if(!target.moderatable) {
            return Promise.reject('Impossibile mettere in timeout questo utente');
        }
        let ms;
        try {
            switch(duration.toLowerCase().charAt(duration.length-1)) {
                case 's':
                    ms = Number(duration.slice(0, duration.length-1)) * 1000;
                    break;
                case 'm':
                    ms = Number(duration.slice(0, duration.length-1)) * 60 * 1000;
                    break;
                case 'h':
                    ms = Number(duration.slice(0, duration.length-1)) * 60 * 60 * 1000;
                    break;
                case 'd':
                    ms = Number(duration.slice(0, duration.length-1)) * 24 * 60 * 60 * 1000;
                    break;
                case 'w':
                    ms = Number(duration.slice(0, duration.length-1)) * 7 * 24 * 60 * 60 * 1000;
                    break;
                case 'y':
                    ms = Number(duration.slice(0, duration.length-1)) * 365 * 24 * 60 * 60 * 1000;
                    break;
            }
        } catch(error) {
            return Promise.reject('Durata non valida');
        }

        if(!reason) {
            try {
                await target.send({ content: `Sei stato messo in timeout in **${moderator.guild.name} per **${duration}**`});
            } catch(error) {console.log(error)}
        } else {
            try {
                await target.send({ content: `Sei stato messo in timeout in **${moderator.guild.name}** per **${duration}** per il motivo: _${reason}_`});
            } catch(error) {console.log(error)}
        }

        try {
            await target.timeout(ms, reason);
        } catch(error) {
            return Promise.reject('Qualcosa è andato storto');
        }

        log(moderator.guild, {
            action: 'Timeout',
            moderator: moderator.user.tag,
            target: target.user.tag,
            reason: reason
        }).catch(error => console.log(error))

        return Promise.resolve({
            moderator: moderator.user,
            target: target.user,
            duration: duration,
            reason: reason
        })
    }
}

