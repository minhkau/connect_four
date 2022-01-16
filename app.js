const express = require("express");
const http = require("http");
const app = express();
const webSocket = require('ws');


// tell express where to look for static files
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.set('views', 'views');



// const port = process.argv[2];
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.get('/', function (req, res) {
    res.render('splash');
})

app.get('/game', function (req, res) {
    res.render('game', { portNumber: port });
});


// handle ajax request for statistics of the server
app.get('/stats', function (req, res) {
    res.send(JSON.stringify({
        "number of players" : numberOfPlayers,
        "number of games played": numberOfGamesPlayed,
        "number of ongoing games": Object.keys(gameList).length,
    }))
})


const wsServer = new webSocket.Server({ server });
let gameList = {};
let numberOfGamesPlayed = 0;
let numberOfPlayers = 0;
const Game = require('./models/gameModel')

wsServer.on('connection', function connection(socket) {
    console.log('new connection');
    numberOfPlayers++;
    if (numberOfPlayers % 2 != 0) {
        numberOfGamesPlayed++;
        let newGame = new Game(numberOfGamesPlayed, socket);
        gameList[numberOfGamesPlayed] = newGame;
        socket['playerName'] = 'a';
    } else {
        gameList[numberOfGamesPlayed].addSecondPlayer(socket);
        socket['playerName'] = 'b';
    }

    socket['gameID'] = numberOfGamesPlayed;

    socket.onclose = event => {
        if (gameList[socket['gameID']] != null) {
            const gameSate = gameList[socket['gameID']].endGame(socket);
            delete gameList[socket['gameID']];
        }
        numberOfPlayers--;
    }

    socket.onmessage = event => {
        const data = JSON.parse(event.data);
        const message = data.message;
        if (message == 'make move') {
            data['playerName'] = socket['playerName'];
            gameList[socket['gameID']].notifyMove(data);
        }

        if (message == 'finish game') {
            if (gameList[socket['gameID']] != null) {
                gameList[socket['gameID']].finishGame();
            }
        }
    }
});


server.listen(port);



