const config = require('./config.json');
const Discord = require('discord.js');
const schedule = require('node-schedule');
const client = new Discord.Client();

client.on("ready", () => {
    client.user.setActivity('Life', { type: 'PLAYING' });
    console.log(`client is online!\n${client.users.size} users, in ${client.guilds.size} servers connected.`);
});

client.on("guildCreate", guild => {
    console.log(`I've joined the guild ${guild.name} (${guild.id}), owned by ${guild.owner.user.username} (${guild.owner.user.id}).`);
});

client.on("message", async message => {

    //if(message.author.client || message.system) return;

    if (message.channel.type === 'dm') {
        return;
    }

    console.log(message.content);

    if (message.content.indexOf(config.prefix) === 0) {

        for (blacklisted in config.blacklist) {
            if (message.author.id == blacklisted) {
                return;
            }
        }

        let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message

        let args = msg.split(" "); // break the message into part by spaces

        let command = args[0].toLowerCase(); // set the first word as the command in lowercase just in case

        args.shift(); // delete the first word from the args

        console.log('Args', args)

        if (command === 'hi' || command === 'hello') { // the first command [I don't like ping > pong]
            message.channel.send(`Hi there ${message.author.toString()}`);
            return;
        }
        else if (command == 'reminder') {
            // Date Format
            // var date = new Date(Year, Month (11 is December, 0 is January), Day, Hour, Minute, Second);
            // var date = new Date(2020, 0, 28, 10, 09, 0);
            if (args[0] == 'help') {
                message.channel.send('Function syntax is: ```$reminder Year Month (0 for January) Day Hour Minute Second.```')
                message.channel.send('You only have to provide arguments up to hour if you wish to.')
                return;
            }
            else if (!args[0] || !args[1] || !args[2]) {
                console.log('No year, month or day was specified');
                message.channel.send('The year, month or day of reminder was not specified.');
                return;
            }
            var date = new Date(args[0], args[1], args[2], args[3], args[4], args[5])
            console.log(date);  
            message.channel.send(`${"<@" + message.author.id + ">"} - Your reminder has been set.`)
            var j = schedule.scheduleJob(date, function () {
                message.channel.send("**REMINDER**  " + "<@" + message.author.id + ">\n" + "  **REMINDER**");
            });
            return;
        }
        else if (command == 'notification') {
            message.channel.send('args')
            return;
        }
        else if (command === 'ping') { // ping > pong just in case..
            return message.channel.send('pong');
        }
        else if (command === "eval" && message.author.id === config.owner) { // < checks the message author's id to yours in config.json.
            const code = args.join(" ");
            message.channel.send(eval(message, code));
            return evalcommand(message, code);
        }
        else if (command === "blacklist" && message.author.id === config.owner) {
            config.blacklist.push(args[0]);
            message.channels.send('New blacklist: ', config.blacklist);
            return;
        }
        else {
            message.channel.send(`I don't know what command that is.`);
            return;
        }
    }
    return;
});

client.login(config.token);