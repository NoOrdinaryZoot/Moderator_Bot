module.exports = {
    name: 'add',
    description: 'Adds a blacklisted word \nSyntax is ```$add [word]```',
    mode: "moderate",
    execute(message, args) {
        const storage = require('./storage.json');

        const serverFilter = storage.filters.get(message.guild.id);

        if (!serverFilter) {
            storage.filters.set(message.guild.id, []);
        }

        try {
            if (serverFilter.indexOf(args) > -1) {
                return message.channel.send(`'${args}' is already in the blacklist!`)
            }
            console.log(storage.filters.get(message.guild.id));
            console.log(serverFilter);
            serverFilter.append(args);
            console.log(serverFilter);
            storage.filters.set(message.guild.id, serverFilter);
            console.log(storage.filters.get(message.guild.id));
            return message.channel.send(`'${args}' has been added to the blacklist!`)
        } catch {
            return message.channel.send(`'${args}' was unsuccesfully added to the blacklist!`)
        }
    }
};