const { ban, kick, mute } = require('../utils/moderation');
const guildModel = require('../models/guild.js');

module.exports = async(client, member) => {
    const data = await guildModel.findOne({ id: member.guild.id });
    if(!data) return;
    const antiraid = data.antiraid;
    const raidmode = data.raidmode;

    const newJoins = client.newmembers.get(member.guild.id);
    newJoins.add(member.id);
    client.newmembers.set(member.guild.id, newJoins);

    setTimeout(() => {
        newJoins.delete(member.id)
    }, 300000);


    if(raidmode.status === true) {
        switch(raidmode.action) {
            case 'ban':
                ban(client, member.guild.me, member, 'Raidmode attiva');
                break;
            case 'kick':
                kick(client, member.guild.me, member, 'Raidmode attiva');
                break;
            case 'mute':
                mute(client, member.guild.me, member, 'Raidmode attiva');
                break;
        }
        return;
    }


    if(antiraid.status === true) {
        if(newJoins.size >= antiraid.limit) {
            const settings = {
                status: true,
                action: raidmode.action,
            }
            await guildModel.findOneAndUpdate({ id: member.guild.id }, { raidmode: settings } );
            console.log(`Raid attempt in ${member.guild.name}`)
            for(const targetId of newJoins) {
                const target = await member.guild.members.fetch(targetId);
                switch(antiraid.action) {
                    case 'ban':
                        ban(client, member.guild.me, target, 'Tentativo di raid rilevato');
                        break;
                    case 'kick':
                        kick(client, member.guild.me, target, 'Tentativo di raid rilevato');
                        break;
                    case 'mute':
                        mute(client, member.guild.me, target, 'Tentativo di raid rilevato');
                        break;
                }
            }
        }
    }
}