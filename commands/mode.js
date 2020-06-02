module.exports = {
    name: 'mode',
    description: 'Changes the mode of the bot \nSyntax is ```$mode [mode name]```',
    mode: 'neutral',
    execute(message, args) {
        const config = require('./config.json');
        console.log(args[0].toLowerCase());
        return;
        console.log(config.modeIndex.indexOf(args[0].toLowerCase()) != -1);
        console.log(config.modeIndex);
        message.channel.send(config.modeIndex.join(' '));
        message.channel.send(args[0].toLowerCase());
        if (args[0].toLowerCase() == config.mode) {
            message.channel.send(`Mode is already '${args[0].toLowerCase()}'`)
        } else if (config.modeIndex.indexOf(args[0].toLowerCase()) != -1) {
            message.channel.send(`Mode was changed to ${args[0].toLowerCase()}`)
        } else {
            message.channel.send(`Invalid mode name '${args[0]}'`)
        }
    }
};