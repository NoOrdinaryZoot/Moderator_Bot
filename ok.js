require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const storage = require('./app.json');

const fs = require('fs');
const ytdl = require('ytdl-core');
const Reddit = require('reddit')
const fetch = require("node-fetch");
const opusscript = require("opusscript");

var ffmpeg = require('ffmpeg');

var badlist = process.env.blacklist.split(",");
var quotes = process.env.quotes.split("~");

var steamidslocal = process.env.steamids.split(",");
var steamcodeslocal = process.env.steamcodes.split(",");

const YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyAA1d3H-fhkfSS9O9f0pwpAXImsoxLVgoQ');

const musicQueue = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

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

    if (message.author.id != 97605170782826496 && message.author.id != 385166607225323521 && message.author.id != 526514389868871680) {
        return;
    }

    if (message.content.indexOf(process.env.prefix) === 0) {

        let msg = message.content.slice(process.env.prefix.length);

        let args = msg.split(" ");

        let command = args[0].toLowerCase();

        args.shift();

        console.log(client.commands);

        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    } else {

    }
    return;
});

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.login(process.env.token);