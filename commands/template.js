module.exports = {
	name: 'browse',
	description: 'Fetches top posts from subreddit\nSyntax is ```$browse [subreddit]{amount}```',
	execute(message, args) {
		const Reddit = require('reddit');
        const fetch = require("node-fetch");

        //Whatever you want down here
        //message.channel.send is generally a good idea.
    }
};