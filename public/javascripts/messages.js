    /**
     * List of messgaes:
     * 
     * Sent by server:
     * join room
     * game start
     * other player move
     * other player afk
     * 
     * 
     * Sent by client:
     * make move
     * finish game
     * 
     */

    module.exports.JOIN_ROOM = {
        message: 'join room',
        gameID : null,
        playerName : null,
    }

    
    module.exports.GAME_START = {
        message : 'game start',
        isRed: null,
    }


    module.exports.OTHER_PLAYER_MOVE = {
        message : 'other player move',
        location : null,
    }

    module.exports.OTHER_PLAYER_AFK = {
        message: "other player afk"
    }

    module.exports.MAKE_MOVE = {
        message: 'make move',
        // player is either a or b 
        playerName: null,
        location: null,
    }

    module.exports.FINISH_GAME = {
        message: 'finish game',
    }