module.exports = {
    name: 'queue',
    description: 'Fetches the current music queue for the server\nSyntax is ```$queue```',
    async execute(message, args) {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) {
            return message.channel.send('There are no songs in the queue!');
        }
        var returnMessage = '```\n';
        for (var i = 0; i < serverQueue.songs.length; i++) {
            returnMessage += `[${i + 1}] ${serverQueue.songs[i].title} \n`
        }
        returnMessage += '```';
        return message.channel.send(returnMessage);
    }
};