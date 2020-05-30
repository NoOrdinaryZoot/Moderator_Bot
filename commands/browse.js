module.exports = {
	name: 'browse',
	description: 'Fetches top posts from subreddit\nSyntax is ```$browse [subreddit]{amount}```',
	execute(message, args) {
		const Discord = require('discord.js');
		const fetch = require("node-fetch");

		console.log('Inside-Command')

		function GrabPosts() {
			fetch(`https://www.reddit.com/r/${args[0]}.json?limit=100&?sort=top&t=today`)
				.then(res => res.json())
				.then(json => {
					isNSFW = json.data.children.map(o => o.data.over_18);
					urls = json.data.children.map(v => v.data.url);
					titles = json.data.children.map(s => s.data.title);
					links = json.data.children.map(d => d.data.permalink);
					console.log(isNSFW);
					RedditToDiscord(urls, titles, links, args[1], isNSFW);
				})
		}

		function RedditToDiscord(urls, titles, links, limit, checkSFW) {
			var randSelector = Math.floor(Math.random() * urls.length) + 1;
			console.log(checkSFW);
			for (var i = 0; i < limit; i++) {
				var randomTITLE = titles[i];
				var randomURL = urls[i];
				var randomLINK = links[i];
				var embed = new Discord.MessageEmbed({
					title: randomTITLE,
					url: `https://www.reddit.com${randomLINK}`,
					image: {
						url: randomURL
					}
				});
				console.log(message.channel.nsfw, checkSFW[i].nsfw);
				if (!message.channel.nsfw && checkSFW[i] == true) {
					message.channel.send('Removed for NSFW content [Sorry!]')
					break;
				} else {
					message.channel.send(embed);
				}
				message.channel.send(embed);
				// try {
				// 	var randomTITLE = titles[i];
				// 	var randomURL = urls[i];
				// 	var randomLINK = links[i];
				// 	var embed = new Discord.MessageEmbed({
				// 		title: randomTITLE,
				// 		url: `https://www.reddit.com${randomLINK}`,
				// 		image: {
				// 			url: randomURL
				// 		}
				// 	});
				// 	console.log(message.channel.nsfw, checkSFW[i].nsfw);
				// 	if (!message.channel.nsfw && checkSFW[i] == true) {
				// 		message.channel.send('Removed for NSFW content [Sorry!]')
				// 		break;
				// 	} else {
				// 		message.channel.send(embed);
				// 	}
				// 	message.channel.send(embed);
				// } catch {
				// 	message.channel.send('No more posts were found')
				// 	break;
				// }
			}
		}
		GrabPosts();
	},
};