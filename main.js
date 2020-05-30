require('dotenv').config();

const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');

const config = require('./config.json');

const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	console.log(command.name, command.description)

	// With the key as the command name and the value as the exported module
	// Key is command name and value is exported module -> (command.name, command) or (command name, value)
	client.commands.set(command.name, command);
}

const Reddit = require('reddit')
const fetch = require("node-fetch");
const opusscript = require("opusscript");

var ffmpeg = require('ffmpeg');

const ytdl = require('ytdl-core');
const YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyAA1d3H-fhkfSS9O9f0pwpAXImsoxLVgoQ');

const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

const queue = new Map();

var badlist = process.env.blacklist.split(",");
var quotes = process.env.quotes.split("~");

var steamidslocal = process.env.steamids.split(",");
var steamcodeslocal = process.env.steamcodes.split(",");

client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	let msg = message.content.slice(process.env.prefix.length);

	let args = msg.split(" ");

	let command = args[0].toLowerCase();

	args.shift();

	const serverQueue = queue.get(message.guild.id);

	switch (command) {
		case 'play':
			run(message, serverQueue);
			return;
		case 'skip':
			skip(message, serverQueue);
			return;
		case 'stop':
			stop(message, serverQueue);
			return;
		case 'queue':
			getQueue(message);
			return;
		case 'channel':
			var tempQueue = queue.get(message.guild.id);
			return message.channel.send(`**Channel ID**\n${tempQueue.songs[0].channel}`);
		case 'description':
			var tempQueue = queue.get(message.guild.id);
			return message.channel.send(`**Description**\n${tempQueue.songs[0].description}`);
		case 'url':
			var tempQueue = queue.get(message.guild.id);
			return message.channel.send(`**Video ID**\n${tempQueue.songs[0].url}`);
		case 'info':
			var tempQueue = queue.get(message.guild.id);
			return message.channel.send(`**Title**\n${tempQueue.songs[0].title}\n**Channel ID**\n${tempQueue.songs[0].channel}\n**Video ID**\n${tempQueue.songs[0].url}\n**Description**\n${tempQueue.songs[0].description}`);
		default:
			try {
				client.commands.get(command).execute(message, args);
				return;
			} catch {
				return message.channel.send('Command was not recognised.');
			}
		// try {
		// 	client.commands.get(command).execute(message, args);
		// } catch {
		// 	if (command == 'help') {
		// 		if (args.length > 0) {
		// 			try {
		// 				message.channel.send(client.commands.get(args[0].description));
		// 				return;
		// 			} catch {
		// 				message.channel.send('Invalid command name!');
		// 				return;
		// 			}
		// 		} else {
		// 			returnMessage = `$ - Prefix, $[command] [args] - Formatting\n`;
		// 			for (var x = 0; x < client.commands.keys().length; x++) {
		// 				returnMessage += `${client.commands.keys()[x]}\n`;
		// 			}
		// 			message.channel.send(returnMessage);
		// 			return;
		// 		}
		// 	}
		// 	message.channel.send('Invalid command name!')
		// 	return;
		// }
	}
});


async function getQueue(message) {
	const serverQueue = queue.get(message.guild.id);
	if (!serverQueue) {
		return message.channel.send('There are no songs in the queue!');
	}
	var returnMessage = '```\n';
	for (var i = 0; i < serverQueue.songs.length; i++) {
		returnMessage += `[${i + 1}] ${serverQueue.songs[i].title} \n`
	}
	returnMessage += '```';
	return message.channel.send(returnMessage);
}
async function run(message, serverQueue) {
	let msg = message.content.slice(process.env.prefix.length);

	let args = msg.split(" ");

	args.shift();

	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}

	console.log(args.join(' '));
	console.log(args);

	youTube.search(args.join(' '), 10,
		async function (error, result) {
			if (error) throw new Error(error);

			var song = {
				title: 'Placeholder',
				url: '6UH6CySotso'
			}

			matchArray = [];

			for (var i = 0; i < result.items.length; i++) {
				matchArray[i] = 0;
				for (arg in args) {
					if (result.items[i].snippet.title.includes(arg))
						matchArray[i] += 1
				}
			}

			if (largestElement(matchArray) == 0) {
				try {
					var song = {
						title: result.items[0].snippet.title,
						url: result.items[0].id.videoId,
						description: result.items[0].snippet.description,
						channel: result.items[0].channelId
					};
				} catch {
					return message.channel.send(`No results were found for ${args.join(' ')}`);
				}
			} else {
				try {
					var song = {
						title: result.items[matchArray.indexOf(largestElement(matchArray))].snippet.title,
						url: result.items[matchArray.indexOf(largestElement(matchArray))].id.videoId,
						description: result.items[matchArray.indexOf(largestElement(matchArray))].snippet.description,
						channel: result.items[matchArray.indexOf(largestElement(matchArray))].channelId
					};
				} catch {
					console.log('Matcharray error when writing to song.');
				}
			}

			console.log(song.url)

			if (!serverQueue) {
				const queueContruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 5,
					playing: true,
				};

				queue.set(message.guild.id, queueContruct);

				queueContruct.songs.push(song);

				message.channel.send(`${song.title} is now playing!`);

				try {
					var connection = await voiceChannel.join();
					queueContruct.connection = connection;
					play(message.guild, queueContruct.songs[0]);
				} catch (err) {
					console.log(err);
					queue.delete(message.guild.id);
					return message.channel.send(err);
				}
			} else {
				serverQueue.songs.push(song);
				console.log(serverQueue.songs);
				return message.channel.send(`${song.title} has been added to the queue!`);
			}
		}
	);
}

function skip(message, serverQueue) {
	if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	message.channel.send(`${serverQueue.songs[0].title} has been removed from the queue!`)
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.play(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('finish', () => {
			if (serverQueue.songs[1]) {
				console.log(`Music ended! ${serverQueue.songs[1]} is now playing`);
			} else {
				console.log(`Queue ended`)
			}
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

function largestElement(array) {
	var largest = 0;
	for (i = 0; i < array.length; i++) {
		if (array[i] > largest) {
			var largest = array[i];
		}
	}
	return largest;
}

function rand(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
client.login(process.env.token);