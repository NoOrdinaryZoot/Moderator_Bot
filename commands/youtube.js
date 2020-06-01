module.exports = {
    name: 'youtube',
    description: 'Fetches videos from youtube\nSyntax is ```$youtube [video name]```',
    execute(message, args) {
        const YouTube = require('youtube-node');
        var youTube = new YouTube();
        youTube.setKey('AIzaSyAA1d3H-fhkfSS9O9f0pwpAXImsoxLVgoQ');

        const fetch = require("node-fetch");

        term = args.join(' ');
        youTube.search(term, 20, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                for (var i = 0; i < result.items.length; i++) {
                    if (result.items[i].id.videoId) {
                        message.channel.send(`https://youtube.com/watch?v=${result.items[0].id.videoId}`);
                        return;
                    }
                }
            }
            return;
        });
    }
};