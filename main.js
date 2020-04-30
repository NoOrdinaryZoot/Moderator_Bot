require('dotenv').config();
const Discord = require('discord.js');
const schedule = require('node-schedule');
const fs = require('fs');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
var badlist = process.env.blacklist.split(",");
var offendingUsers = process.env.leaderboard
console.log(badlist);
console.log(offendingUsers);
// console.log(offendingUsers.CT);
// offendingUsers.AU[0] = 'CUnt'
// console.log(offendingUsers);

client.on("ready", () => {
    client.user.setActivity('Life', { type: 'PLAYING' });
    console.log(`client is online!\n${client.users.size} users, in ${client.guilds.size} servers connected.`);
    console.log(`${client}`);
});

client.on("guildCreate", guild => {
    console.log(`I've joined the guild ${guild.name} (${guild.id}), owned by ${guild.owner.user.username} (${guild.owner.user.id}).`);
});

client.on("message", async message => {
    console.log(message.channel.guild.users.size);
    console.log(client.guilds.size);
    if (message.content.toLowerCase().includes('heh')) {
        if (rand(0, 1) == 1) {
            message.channel.send("Hey Gordon it's me Barney from Black Mesa!");
        }
        else {
            message.channel.send("About that beer I owe ya");
        }
    }

    if (message.channel.type === 'dm') {
        return;
    }

    if (message.author.id != 97605170782826496 && message.author.id != 385166607225323521 && message.author.id != 526514389868871680) {
        return;
    }

    if (message.content.indexOf(process.env.prefix) === 0) {

        let msg = message.content.slice(process.env.prefix.length);

        let args = msg.split(" ");

        let command = args[0].toLowerCase();

        args.shift();

        switch (command) {
            case 'hi' || 'hello':
                message.channel.send(`Hi there ${message.author.toString()}`);
                return;
            case 'filter':
                message.channel.messages.fetch().then(messages => {
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
                    console.log(args);
                    badlist.push(args.join(' ').toLowerCase());
                    process.env.blacklist = badlist.join(",");
                    message.channel.send(`${args} was succesfully added to the blacklist.`);
                } catch (err) {
                    message.channel.send(`${args} was unsuccessfully added to the blacklist.`);
                    console.log(err);
                    console.log('stupid')
                }
                return;
            case 'remove':
                try {
                    console.log(badlist);
                    console.log(args);
                    badlist = badlist.filter(e => e !== args.join(' ').toLowerCase());
                    process.env.blacklist = badlist.join(",");
                    message.channel.send(`${args} was successfully removed from the blacklist.`);
                } catch (err) {
                    message.channel.send(`${args} was unsuccessfully removed from the blacklist.`);
                    console.log(err);
                }
                return;
            case 'blacklist':
                try {
                    message.channel.send(`${badlist}`);
                } catch (err) {
                    message.channel.send('Error when displaying blacklist');
                    console.log(err);
                }
                return;
            case 'purge':
                var amount = args[1];
                var messages = await message.channel.fetch({ limit: amount });
                message.channel.bulkDelete(messages);
                return;
            case 'haha':
                console.log(message.channel)
                return;
        }
    }
    return;
});

function checker(value) {
    var prohibited = badlist;
    checkCont = value.content.toLowerCase();
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

client.login(process.env.token);