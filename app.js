const express = require("express");
const http = require("http");
const app = express();
const webSocket = require('ws');
const path = require('path');


// tell expres where to look for static files
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.set('views', 'views');



app.get('/', function(req, res){
    res.render('splash');
})

app.get('/game', function(req, res){
    res.render('game');
});


// const port = process.argv[2];
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const wsServer = new webSocket.Server({server});
let gameList = {};
let numberOfGames = 0;
let numberOfPlayers = 0;
const Game = require('./models/gameModel');

wsServer.on('connection', function connection(socket) {
    console.log('new connection');
    numberOfPlayers++;
    if (numberOfPlayers % 2 != 0) {
        numberOfGames++;
        let newGame = new Game(numberOfGames, socket);
        gameList[numberOfGames] = newGame;
        socket['playerName'] = 'a';
    } else {
        gameList[numberOfGames].addSecondPlayer(socket);
        socket['playerName'] = 'b';
    }

    socket['gameID'] = numberOfGames;

    socket.onclose = event => {
        if(gameList[socket['gameID']] != null){

            
            delete gameList[socket['gameID']];
        }
        numberOfPlayers--;

    }

    socket.onmessage = event => {
        const data = JSON.parse(event.data);
        const message = data.message;
        if(message == 'make move'){
            data['playerName'] = socket['playerName'];
            gameList[socket['gameID']].notifyMove(data);
        }
    } 
});


server.listen(port);



