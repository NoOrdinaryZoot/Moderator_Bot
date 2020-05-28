const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

const YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyAA1d3H-fhkfSS9O9f0pwpAXImsoxLVgoQ');

const queue = new Map();

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

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}queue`)) {
		getQueue(message);
	} else {
		message.channel.send('You need to enter a valid command!')
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
async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}

	youTube.search(args.join(' '), 20,
		async function (error, result) {
			if (error) throw new Error(error);

			var song = {
				title: 'Placeholder',
				url: '6UH6CySotso'
			}

			console.log(result.items);

			matchArray = [];

			for (var i = 0; i < result.items.length; i++) {
				for (arg in args) {
					if (result.items[i].snippet.title.includes(arg))
						matchArray[i] += 1
				}
			}
			console.log(Math.max(matchArray), result.items[matchArray.indexOf(Math.max(matchArray))].snippet.title);

			// for (var i = 0; i < result.items.length; i++) {
			// 	console.log(result.items[i]);
			// 	matchArray[i] = 0;
			// 	for (var x = 0; x < args.length; x ++) {
			// 		if(result.items[i].snippet.title.includes(args[x])) {
			// 			matchArray[i] += 1;
			// 		}
			// 	}
			// 	console.log(indexOf(Math.max()))
			// 	console.log(result.items.indexOf(Math.max(matchArray)).snippet.title);
			// 	console.log(result.items.indexOf(Math.max(matchArray)).id.videoId);
			// 	// if(result.items[i].snippet.title)
			// 	// if (result.items[i].id.videoId) {
			// 	// 	var song = {
			// 	// 		title: result.items[i].snippet.title,
			// 	// 		url: result.items[i].id.videoId
			// 	// 	}
			// 	// 	break;
			// 	// }
			// }



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

client.login(process.env.token);