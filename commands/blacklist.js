module.exports = {
    name: 'blacklist',
    description: 'Prints out blacklisted words \nSyntax is ```$blacklist```',
    execute(message, args) {
        const storage = require('./storage.json');

        const serverFilter = storage.filters.get(message.guild.id);

        if (!serverFilter) {
            storage.filters.set(message.guild.id, []);
            return message.channel.send('There is no blacklist present in this server!')
        }

        try {
            return message.channel.send(`Blacklisted words include ${serverFilter.join(', ')}`)
        } catch {
            return message.channel.send('Error when sending blacklisted words!')
        }

        message.channel.send('This is a template command!\nNothing to see here!')

        //Whatever you want down here
        //message.channel.send is generally a good idea.
    }
};