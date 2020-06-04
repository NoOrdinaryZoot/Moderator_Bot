var Chess = require('./chess').Chess;
var ChessImageGenerator = require('chess-web-api');

var chess = new Chess();
var imageGenerator = new ChessImageGenerator({
}).loadPGN(chess.pgn());;


console.log(imageGenerator.getPlayer('ElZooted'));

 
// while (!chess.game_over()) {
//   var moves = chess.moves();
//   var move = moves[Math.floor(Math.random() * moves.length)];
//   chess.move(move);
// }
// console.log(chess.pgn());
imageGenerator.loadPGN(chess.pgn());
imageGenerator.generatePNG("main");
// console.log(typeof(chess.pgn()));

//Move Command
// try {
//     chess.move(args[0]);
// } catch {
//     return message.channel.send('Invalid move!');
// }


// //Start Command
// storage.games.set(message.guild.id, "");