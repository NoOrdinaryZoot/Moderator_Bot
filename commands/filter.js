module.exports = {
    name: 'filter',
    description: 'Filters out blacklisted words \nSyntax is ```$filter```',
    mode: "moderate",
    execute(message, args) {
        const storage = require('./storage.json');

        var censorCount = 0;

        message.channel.messages.fetch().then(messages => {
            const filterMessages = messages.filter(value => {
                let filterWords = storage.filter;
                checkValue = value.content.toLowerCase().split(' ');
                for (var i = 0; i < filterWords.length; i++) {
                    for (var x = 0; x < checkValue.length; x++) {
                        if (checkValue[x].includes(filterWords[i])) {
                            censorCount += 1;
                            console.log(`${value.author.username} censored for message ${value.content} : ${filterWords[i]}`);
                        }
                    }
                }
            });
            message.channel.bulkDelete(filterMessages);
            message.channel.send(`${censorCount} messages were filtered.`)

        }).catch(err => {
            console.log('Error while doing Bulk Delete');
        });
    }
};