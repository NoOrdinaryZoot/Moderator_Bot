module.exports = {
	name: 'template',
    description: 'Acts as a template command \nSyntax is ```$template```',
    mode: 'moderate or entertainment',
	execute(message, args) {
		const Reddit = require('reddit');
        const fetch = require("node-fetch");

        message.channel.send('This is a template command!\nNothing to see here!')

        //Whatever you want down here
        //message.channel.send is generally a good idea.
    }
};