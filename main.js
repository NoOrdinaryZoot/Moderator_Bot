var app = require('./app.json');
const Discord = require('discord.js');
const schedule = require('node-schedule');
const fs = require('fs');
const client = new Discord.Client();
var badlist = app.blacklist;

client.on("ready", () => {
    client.user.setActivity('Life', { type: 'PLAYING' });
    console.log(`client is online!\n${client.users.size} users, in ${client.guilds.size} servers connected.`);
});

client.on("guildCreate", guild => {
    console.log(`I've joined the guild ${guild.name} (${guild.id}), owned by ${guild.owner.user.username} (${guild.owner.user.id}).`);
});

client.on("message", async message => {

    if (message.channel.type === 'dm') {
        return;
    }

    console.log(message.content);
    if (message.author.id != 97605170782826496 && message.author.id != 385166607225323521 && message.author.id != 526514389868871680) {
        return;
    }
    if (message.content.indexOf(app.prefix) === 0) {

        let msg = message.content.slice(app.prefix.length);

        let args = msg.split(" ");

        let command = args[0].toLowerCase();

        args.shift();

        console.log('Args', args)
        switch (command) {
            case 'hi' || 'hello':
                message.channel.send(`Hi there ${message.author.toString()}`);
                return;
            case 'filter':
                message.channel.fetchMessages().then(messages => {
                    const botMessages = messages.filter(checker);
                    for (msg in botMessages) {
                        console.log(msg.content);
                    }
                    message.channel.bulkDelete(botMessages);

                }).catch(err => {
                    console.log('Error while doing Bulk Delete');
                    console.log(err);
                });
                return;
            case 'add':
                try {
                    console.log(badlist);
                    badlist.push(args.toLowerCase());
                    app.list = badlist;
                    message.channel.send(`${args} was succesfully added to the blacklist.`);
                } catch {
                    message.channel.send(`${args} was unsuccessfully added to the blacklist.`);
                }
                return;
            case 'remove':
                try {
                    console.log(badlist);
                    badlist = badlist.filter(e => e !== args.toLowerCase());
                    app.list = badlist;
                    message.channel.send(`${args} was successfully removed from the blacklist.`);
                } catch {
                    message.channel.send(`${args} was unsuccessfully removed from the blacklist.`);
                }
                return;
            case 'blacklist':
                try {
                    message.channel.send(`${badlist}`);
                } catch {
                    message.channel.send('Error when displaying blacklist');
                }
                return;
            case 'purge':
                var amount = args[1];
                var messages = await message.channel.fetchMessages({ limit: amount });
                message.channel.bulkDelete(messages);
                return;
            case 'haha':
                console.log(message.channel)
        }
    }
    return;
});

function checker(value) {
    var prohibited = badlist;
    console.log(value.content);
    checkCont = value.content.toLowerCase()
    for (var i = 0; i < prohibited.length; i++) {
        for (proh in prohibited[i]) {
            if (checkCont.includes(proh)) {
                return true;
            }
        }
        if (checkCont.indexOf(prohibited[i]) > -1) {
            return true;
        }
    }
    return false;
}

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.login(app.token);