module.exports = {
    name: 'remove',
    description: 'Removes a blacklisted word \nSyntax is ```$remove [word]```',
    execute(message, args) {
        const storage = require('../storage.json');

        var serverFilter = storage.filters.get(message.guild.id);

        if (!serverFilter) {
            storage.filters.set(message.guild.id, []);
            serverFilter = storage.filters.get(message.guild.id);
            return message.channel.send('There is no blacklist present in this server!');
        }
        serverFilter.splice(serverFilter.indexOf(args.join(' ')));
        storage.filters.set(message.guild.id, serverFilter);

        // try {
        //     if (serverFilter.indexOf(args.join(' ')) != -1) {
        //         console.log(storage.filters.get(message.guild.id));
        //         serverFilter.splice(serverFilter.indexOf(args.join(' ')));
        //         storage.filters.set(message.guild.id, serverFilter);
        //         console.log(storage.filters.get(message.guild.id));
        //         return message.channel.send(`'${args.join(' ')}' was removed from the blacklist!`)
        //     }
        //     return message.channel.send(`${args.join(' ')} is not in the blacklist!`)
        // } catch {
        //     return message.channel.send(`'${args.join(' ')}' was unsuccesfully removed from the blacklist!`)
        // }
        console.log(storage.filters.get(message.guild.id));
        console.log(storage.filters);
        console.log(serverFilter);
    }
};