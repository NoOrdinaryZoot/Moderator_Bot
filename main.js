require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const variableStorage = require('./app.json');

console.log(variableStorage.prefix);

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



//High Priority
//FIX HORRIBLE SWITCH - CASE STATEMENT AND FIGURE OUT HOW TO EXPORT / IMPORT MODULES & COMMANDS!!!!!

//Medium Priority
//Fix consistent spacing etc, also figure out why music bot won't play music (Maybe don't use ytdl-core)

//Low Priority / Stuff that isn't relevant or needed
//Adding more commands


client.on("ready", () => {
    client.user.setActivity('Life', { type: 'PLAYING' });
    console.log(`client is online!\n users, in servers connected.`);
    variableStorage.queue = new Map();
    console.log(variableStorage.prefix);
    client.guilds.cache.forEach((guild) => {
        console.log(guild.id);
        variableStorage.queue.set(guild.id, []);
        console.log(variableStorage.queue.get(guild.id));
        // queue = guild.map(element => element.id);
        // process.env.queues[guild.id] = [];
        console.log(variableStorage.queue);
    })
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

    let msg = message.content.slice(process.env.prefix.length);

    let args = msg.split(" ");

    let command = args[0].toLowerCase();

    args.shift();

    if (message.content.indexOf(process.env.prefix) === 0) {

        const serverQueue = variableStorage.queue.get(message.guild.id);
        console.log(variableStorage.queue);

        switch (command) {
            case 'play':
                execute(message, serverQueue);
                return;
            case 'skip':
                skip(message, serverQueue);
                return;
            case 'stop':
                stop(message, serverQueue);
                return;
        }
        return;
    }

    function findVideo(term, messageTerm) {
        youTube.search(term, 1, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                console.log(result.items[0].id.videoId);
                if (result.items[0].id.videoId) {
                    messageTerm.channel.send(`https://youtube.com/watch?v=${result.items[0].id.videoId}`);
                    return;
                }
            }
            return;
        });
    }
});

function addVideo(term, server) {
    youTube.search(term, 1, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result.items[0].id.videoId);
            if (result.items[0].id.videoId) {
                messageTerm.channel.send(`https://youtube.com/watch?v=${result.items[0].id.videoId}`);
                return;
            }
        }
        return;
    });
}

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        variableStorage.queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            variableStorage.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = variableStorage.queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        variableStorage.queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
client.login(process.env.token);