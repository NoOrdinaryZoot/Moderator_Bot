module.exports = {
    name: 'youtube',
    description: 'Fetches videos from youtube\nSyntax is ```$youtube [video name]```',
    execute(message, args) {
        term = args.join(' ');
        youTube.search(term, 1, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                console.log(result.items[0]);
                if (result.items[0].id.videoId) {
                    message.channel.send(`https://youtube.com/watch?v=${result.items[0].id.videoId}`);
                    return;
                }
            }
            return;
        });
    }
};