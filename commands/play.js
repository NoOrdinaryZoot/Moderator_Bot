module.exports = {
    name: 'play',
    description: 'Fetches top posts from subreddit\nSyntax is ```$browse [subreddit]{amount}```',
    execute(message, args) {
        async function run(message, serverQueue) {
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
                        matchArray[i] = 0;
                        for (arg in args) {
                            if (result.items[i].snippet.title.includes(arg))
                                matchArray[i] += 1
                        }
                    }
                    console.log(matchArray);
                    console.log(largestElement(matchArray));
                    console.log(matchArray.indexOf(largestElement(matchArray)));
                    console.log(largestElement(matchArray), result.items[matchArray.indexOf(largestElement(matchArray))].snippet.title);

                    var song = {
                        title: result.items[matchArray.indexOf(largestElement(matchArray))].snippet.title,
                        url: result.items[matchArray.indexOf(largestElement(matchArray))].id.videoId
                    }

                    console.log(song.url)

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
    }
};