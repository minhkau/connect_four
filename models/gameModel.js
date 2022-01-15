const e = require('express');
const webSocket = require('ws');

/**
 * Create a new game with just 1 player, the game will start when the 2nd player is added
 * @param {string} gameID 
 * @param {socket} playerA 
 */
const game =  function(gameID, playerA) {
    this.playerA = playerA;
    this.gameId = gameID;
    // 0 means waiting for playerB
    this.state = 0;
    playerA.send(JSON.stringify({
        message: 'join room',
        gameID : this.gameId,
        playerName : 'a',
    }));
}

/**
 * Add 2nd player and start the game
 * @param {socket} playerB the socket object of 2nd player
 */
game.prototype.addSecondPlayer = function(playerB) {
    this.playerB = playerB;
    // 1 means the 2nd player has joined and the game starts
    this.state = 1;
    playerB.send(JSON.stringify({
        message: 'join room',
        gameID : this.gameId,
        playerName : 'b',
    }));
    
    if (Math.random() >= 0.5) {
        this.playerA.send(JSON.stringify({
            message : 'game start',
            isRed: true,
        }));
        this.playerB.send(JSON.stringify({
            message : 'game start',
            isRed: false,
        }));
    } else {
        this.playerA.send(JSON.stringify({
            message : 'game start',
            isRed: false,
        }));
        this.playerB.send(JSON.stringify({
            message : 'game start',
            isRed: true,
        }));
    }

}


game.prototype.notifyMove = function(data) {
    if(data.playerName == 'a'){
        this.playerB.send(JSON.stringify({
            message : 'other player move',
            location : data.location,
        }));
    } else {
        this.playerA.send(JSON.stringify({
            message : 'other player move',
            location : data.location,
        }))  
    }
}

game.prototype.endGame = function(socket) {
    // if the state is still 1, that means 1 player has left before the game is finished
    if(this.state == 1){
        const afkPlayer = socket['playerName'];
        if(afkPlayer == 'a'){
            this.playerB.send(JSON.stringify({
                message: "other player afk"
            }))
        } else {
            this.playerA.send(JSON.stringify({
                message: "other player afk"
            }))
        }
    }

    // if the state is 2, that means the game is finished, there's no need to inform any user

}

game.prototype.finishGame = function(){
    // state 2 means the game is finished
    this.state = 2;
}


module.exports = game;