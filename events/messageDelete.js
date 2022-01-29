module.exports = async(client, message) => {
    if(message.author.bot) return;
    console.log(`Deleted in ${message.channel.name} => ${message.content}`);
    client.lastDeleted.set(message.channel.id, message);
}