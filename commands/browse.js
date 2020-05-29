module.exports = {
	name: 'browse',
	description: 'Fetches top posts from subreddit\nSyntax is ```$browse [subreddit]{amount}```',
	execute(message, args) {
		const Reddit = require('reddit')
		const fetch = require("node-fetch");
		function GrabPosts() {
			fetch(`https://www.reddit.com/r/${args[0]}.json?limit=100&?sort=top&t=today`)
				.then(res => res.json())
				.then(json => {
					filter = json.data.children.map(o => o.data.over_18);
					urls = json.data.children.map(v => v.data.url);
					titles = json.data.children.map(s => s.data.title);
					links = json.data.children.map(d => d.data.permalink);
					RedditToDiscord(urls, titles, links, args[1]);
				})
		}

		function RedditToDiscord(urls, titles, links, limit) {
			var randSelector = Math.floor(Math.random() * urls.length) + 1;
			for (var i = 0; i < limit; i++) {
				try {
					console.log(filter[i], randomLINK);
					if (!message.channel.nsfw && filter[i] == true) {
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
						message.channel.send(embed);
					}
				} catch {
					message.channel.send('No more posts were found')
					break;
				}
			}
		}
		GrabPosts();
	},
};