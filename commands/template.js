module.exports = {
	name: 'template',
	description: 'Fetches top posts from subreddit\nSyntax is ```$browse [subreddit]{amount}```',
	execute(message, args) {
		const Reddit = require('reddit');
        const fetch = require("node-fetch");

        message.channel.send('This is a template command!\nNothing to see here!')

        //Whatever you want down here
        //message.channel.send is generally a good idea.
    }
};