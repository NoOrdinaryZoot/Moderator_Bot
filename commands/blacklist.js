module.exports = {
    name: 'blacklist',
    description: 'Prints out blacklisted words \nSyntax is ```$blacklist```',
    execute(message, args) {
        const storage = require('../storage.json');
        //O
        const serverFilter = storage.filters.get(message.guild.id);

        if (!serverFilter) {
            storage.filters.set(message.guild.id, ['']);
            return message.channel.send('There is no blacklist present in this server!')
        }

        try {
            if (blacklist.length > 0) {
                return message.channel.send(`Blacklisted words include ${serverFilter.join(', ')}`)
            }
        } catch {
            return message.channel.send('Error when sending blacklisted words!')
        }
        return message.channel.send('There is no blacklist present in this server!')
        //Whatever you want down here
        //message.channel.send is generally a good idea.
    }
};