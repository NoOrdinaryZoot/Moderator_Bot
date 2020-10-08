module.exports = {
    name: 'blacklist',
    description: 'Prints out blacklisted words \nSyntax is ```$blacklist```',
    execute(message, args) {
        const storage = require('../storage.json');
        //O
        var serverFilter = storage.filters.get(message.guild.id);

        if (!serverFilter) {
            storage.filters.set(message.guild.id, []);
            serverFilter = storage.filters.get(message.guild.id);
            return message.channel.send('There is no blacklist present in this server!')
        }

        return message.channel.send('There is no blacklist present in this server!')
    }
};