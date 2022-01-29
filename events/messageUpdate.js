module.exports = async(client, message) => {
    if(message.author.bot) return;
    console.log(`Edited in ${message.channel.name} => ${message.content}`);
    client.lastEdited.set(message.channel.id, message);
}