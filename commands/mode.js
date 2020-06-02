module.exports = {
    name: 'mode',
    description: 'Changes the mode of the bot \nSyntax is ```$mode [mode name]```',
    mode: 'neutral',
    execute(message, args) {
        const config = require('./config.json');
        Tstring = 'string';
        if (args[0].toLowerCase() == config.mode) {
            message.channel.send(`Mode is already '${args[0].toLowerCase()}'`)
        } else if (config.modeIndex.indexOf(args[0].toLowerCase()) != -1) {
            message.channel.send(`Mode was changed to ${args[0].toLowerCase()}`)
        } else {
            message.channel.send(`Invalid mode name '${args[0]}'`)
        }
    }
};