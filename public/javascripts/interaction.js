// the port to communicate is hardcoded, need to change !!!!
// const portNumber = document.querySelector('#portNumber').textContent;
// let ws = new WebSocket('ws://connect4minhkau.herokuapp.com/:' + portNumber);
let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);
// let playerName;
// let isRed;
let canMove;
let yellowIsNext;
let interval;
let game;

function Game(){
    this.minutes = 0;
    this.seconds = 0;
    this.numberOfYellowPieces = 0;
}

Game.prototype.startGame = (data) => {
    waitingMessage.classList.remove('show');
    cleanBoard();
    game.isRed = data.isRed;
    canMove = game.isRed;
    yellowIsNext = false;
    circle.classList.remove('yellow');
    circle.classList.remove('red');

    game.isRed ? circle.classList.add('yellow') : circle.classList.add('red');
    game.numberOfYellowPieces = 0;
    startClock();
}

Game.prototype.makeMove = (data) => {
    canMove = true;
    const [rowIndex, colIndex] = data.location;
    const cellToPlay = getFirstPossibleCell(colIndex);
    const classListOfCellToPlay = getClassListArray(cellToPlay);

    cellToPlay.classList.add(!game.isRed ? 'red' : 'yellow');
    //Updates the number of pieces
    !game.isRed ? BoxForYellowPieces.innerHTML=++game.numberOfYellowPieces : BoxForYellowPieces.innerHTML=++game.numberOfYellowPieces;


    //ToDo check for the state of the game
    if (CheckForWin()) {
        winningText.textContent = yellowIsNext ? 'Yellow wins' : 'Red wins';
        removeListners();
        winningMessage.classList.add('show');
        stopClock();
        // changeGameState();
        game.finishGame();
        ws.close();
    };
    yellowIsNext = !yellowIsNext;
    clearTop(colIndex);
}

Game.prototype.otherPlayerAfk = () => {
    winningText.textContent = 'Other player has disconnected'
    removeListners();
    winningMessage.classList.add('show');
    stopClock();
    ws.close();
}

Game.prototype.finishGame = () => {
    ws.send(JSON.stringify({
        message: 'finish game',
    }))
}

const setupSocket = function () {
    ws.onopen = () => {
        game = new Game();
        console.log('connecting to server');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const message = data.message;
        if (message == 'join room') {
            // gameID = ws['id'];
            game.playerName = data.playerName;
            if (game.playerName == 'a') {
                waitingText.textContent = 'Waiting for another player';
                waitingMessage.classList.add('show');
            }
        };

        if (message == 'game start') {
            game.startGame(data);
        }

        if (message == 'other player move') {
            game.makeMove(data);
        }


        if (message == 'other player afk') {
            game.otherPlayerAfk();
        }
    }

}

setupSocket();

const makeMove = (location) => {
    canMove = false;
    ws.send(JSON.stringify({
        message: 'make move',
        // player is either a or b 
        playerName: game.playerName,
        location: location,
    }))
}


const finishGame = () => {
    ws.send(JSON.stringify({
        message: 'finish game',
    }))
}


const cells = document.querySelectorAll('.cell:not(.row-top)');
const topCells = document.querySelectorAll('.cell.row-top');
const winningMessage = document.querySelector('.winning-message');
const waitingMessage = document.querySelector('.waiting-message');
const newGameButton = document.querySelector('#newGameButton');
const winningText = document.querySelector('[data-winning-message-text]');
const waitingText = document.querySelector('[data-waiting-message-text]');
const BoxForYellowPieces = document.querySelector('.number h1');
const circle = document.querySelector('.circle');
const secondsOnTimer = document.querySelector('.seconds');
const minutesOnTimer = document.querySelector('.minutes');




//now we will create an array for each column in bottom up fashion with extra element of class row top

//column0
const column0 = document.querySelectorAll('.cell:not(.row-top):nth-child(7n+1)');
const arrcol0 = Array.from(column0);
arrcol0.reverse();
arrcol0.push(document.querySelector('.cell.row-top:nth-child(1)'));

//column1
const column1 = document.querySelectorAll('.cell:not(.row-top):nth-child(7n+2)');
const arrcol1 = Array.from(column1);
arrcol1.reverse();
arrcol1.push(document.querySelector('.cell.row-top:nth-child(2)'));

//column2
const column2 = document.querySelectorAll('.cell:not(.row-top):nth-child(7n+3)');
const arrcol2 = Array.from(column2);
arrcol2.reverse();
arrcol2.push(document.querySelector('.cell.row-top:nth-child(3)'));

//column3
const column3 = document.querySelectorAll('.cell:not(.row-top):nth-child(7n+4)');
const arrcol3 = Array.from(column3);
arrcol3.reverse();
arrcol3.push(document.querySelector('.cell.row-top:nth-child(4)'));

//column4
const column4 = document.querySelectorAll('.cell:not(.row-top):nth-child(7n+5)');
const arrcol4 = Array.from(column4);
arrcol4.reverse();
arrcol4.push(document.querySelector('.cell.row-top:nth-child(5)'));

//column5
const column5 = document.querySelectorAll('.cell:not(.row-top):nth-child(7n+6)');
const arrcol5 = Array.from(column5);
arrcol5.reverse();
arrcol5.push(document.querySelector('.cell.row-top:nth-child(6)'));

//column6
const column6 = document.querySelectorAll('.cell:not(.row-top):nth-child(7n)');
const arrcol6 = Array.from(column6);
arrcol6.reverse();
arrcol6.push(document.querySelector('.cell.row-top:nth-child(7)'));

//we create an array which contains all the columns
const columns = [arrcol0, arrcol1, arrcol2, arrcol3, arrcol4, arrcol5, arrcol6];

//we create an array for each row and then we create an array which holds all the colums
const topRow = [topCells[0], topCells[1], topCells[2], topCells[3], topCells[4], topCells[5], topCells[6]];
const row0 = [cells[0], cells[1], cells[2], cells[3], cells[4], cells[5], cells[6]];
const row1 = [cells[7], cells[8], cells[9], cells[10], cells[11], cells[12], cells[13]];
const row2 = [cells[14], cells[15], cells[16], cells[17], cells[18], cells[19], cells[20]];
const row3 = [cells[21], cells[22], cells[23], cells[24], cells[25], cells[26], cells[27]];
const row4 = [cells[28], cells[29], cells[30], cells[31], cells[32], cells[33], cells[34]];
const row5 = [cells[35], cells[36], cells[37], cells[38], cells[39], cells[40], cells[41]];
const rows = [row0, row1, row2, row3, row4, row5, topRow];

let gameIsOn = true;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Clock section 

// functionality of the clock
function ruuningClock () {
    game.seconds++;
    if(game.seconds<=9){
        secondsOnTimer.innerHTML = "0" + game.seconds;
    }
    if(game.seconds>9){
        secondsOnTimer.innerHTML = game.seconds;
    }
    if(game.seconds>59){
        secondsOnTimer.innerHTML = "00";
        game.seconds = 0;
        game.minutes++;
    }
    minutesOnTimer.innerHTML = game.minutes;
};
// starts the clock
function startClock () {
    secondsOnTimer.innerHTML = "00";
    minutesOnTimer.innerHTML = "0";
    interval = setInterval(ruuningClock,1000);
    // console.log('instart', interval);
};
//stops the clock
function stopClock () {
    // console.log('in stop', interval)
    clearInterval(interval);
    game.seconds = 0;
    game.minutes = 0;
};



//Functions

//returns array form of classes of a cell


const getClassListArray = (cell) => {
    const classList = cell.classList;
    return [...classList];
};


//returns an array of cell's row index and col index [row,col]
const getCellLocation = (cell) => {
    const classList = getClassListArray(cell);
    //Extract whole names of classes for example row-4, col-6
    const rowClass = classList.find(className => className.includes('row'));
    const columnClass = classList.find(className => className.includes('col'));

    //extract only indexes of col and row class from 2 lines above
    const rowIndex = rowClass[4];
    const colIndex = columnClass[4];

    //convert to integer
    const rowNumber = parseInt(rowIndex, 10);
    const colNumber = parseInt(colIndex, 10);

    return [rowNumber, colNumber]
};



const getFirstPossibleCell = (colIndex) => {
    const column = columns[colIndex];
    const columnWithOutTop = column.slice(0, 6);

    for (const cell of columnWithOutTop) {
        const classList = getClassListArray(cell);
        if (!classList.includes('yellow') && !classList.includes('red')) {
            return cell;
        }
    }
    return null;
};

const removeListners = () => {
    for (const row of rows) {
        for (const cell of row) {
            cell.removeEventListener('mouseover', handleMouseOver);
            cell.removeEventListener('mouseout', handleMouseOut);
            cell.removeEventListener('click', handleCellClick);
        }
    }
}

const clearTop = (colIndex) => {
    const topCell = topCells[colIndex];
    // topCell.classList.remove(yellowIsNext ? 'red' : 'yellow');
    // topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
    topCell.classList.remove('yellow');
    topCell.classList.remove('red');

};


//Event Handlers
const handleMouseOver = (e) => {
    const cell = e.target;

    const [rowIndex, colIndex] = getCellLocation(cell);

    const topCell = topCells[colIndex];
    topCell.classList.add(game.isRed ? 'red' : 'yellow');
};

const handleMouseOut = (e) => {
    const cell = e.target;
    const [rowIndex, colIndex] = getCellLocation(cell);
    const topCell = topCells[colIndex];

    topCell.classList.remove('yellow');
    topCell.classList.remove('red');
};

const handleCellClick = (e) => {
    if (canMove) {
        const cell = e.target;
        const [rowIndex, colIndex] = getCellLocation(cell);
        const cellToPlay = getFirstPossibleCell(colIndex);
        const classListOfCellToPlay = getClassListArray(cellToPlay);

        if (cell === null) return;

        cellToPlay.classList.add(game.isRed ? 'red' : 'yellow');
        makeMove([rowIndex, colIndex]);

        //ToDo check for the state of the game
        if (CheckForWin()) {
            winningText.textContent = yellowIsNext ? 'Yellow wins' : 'Red wins';
            removeListners();
            winningMessage.classList.add('show');
            stopClock();
            // changeGameState();
            game.finishGame();
            ws.close();
        };
        yellowIsNext = !yellowIsNext;
        clearTop(colIndex);
    }
}


//clears the board for the new game and removes the status
const cleanBoard = () => {
    for (const row of rows) {
        for (const cell of row) {
            cell.classList.remove('yellow');
            cell.classList.remove('red');
            cell.classList.remove('win');
            cell.addEventListener('mouseover', handleMouseOver);
            cell.addEventListener('mouseout', handleMouseOut);
            cell.addEventListener('click', handleCellClick);
        }
    }
    winningMessage.classList.remove('show');
}


//Checks if somebody has won if so returns true
const CheckForWin = () => {

    const toCheck = yellowIsNext ? 'yellow' : 'red';

    //--------check every row for 4 connected
    for (const row of rows) {
        for (let i = 0; i < 4; i++) {
            const first = getClassListArray(row[i]);
            const second = getClassListArray(row[i + 1]);
            const third = getClassListArray(row[i + 2]);
            const fourth = getClassListArray(row[i + 3]);
            if (first.includes(toCheck) && second.includes(toCheck) && third.includes(toCheck) && fourth.includes(toCheck)) {
                row[i].classList.add('win');
                row[i + 1].classList.add('win');
                row[i + 2].classList.add('win');
                row[i + 3].classList.add('win');
                return true;
            }
        }
    }


    //-----Check for every column for connected 4
    for (const col of columns) {
        for (let i = 0; i < 4; i++) {
            const first = getClassListArray(col[i]);
            const second = getClassListArray(col[i + 1]);
            const third = getClassListArray(col[i + 2]);
            const fourth = getClassListArray(col[i + 3]);
            if (first.includes(toCheck) && second.includes(toCheck) && third.includes(toCheck) && fourth.includes(toCheck)) {
                col[i].classList.add('win');
                col[i + 1].classList.add('win');
                col[i + 2].classList.add('win');
                col[i + 3].classList.add('win');
                return true;
            }
        }
    }


    //check every daiagonal

    //checks desending diagonals
    for (let i = 3; i < 7; i++) {
        for (let j = 0; j < 3; j++) {
            const first = getClassListArray((columns[i])[j]);
            const second = getClassListArray((columns[i - 1])[j + 1]);
            const third = getClassListArray((columns[i - 2])[j + 2]);
            const fourth = getClassListArray((columns[i - 3])[j + 3])
            if (first.includes(toCheck) && second.includes(toCheck) && third.includes(toCheck) && fourth.includes(toCheck)) {
                (columns[i])[j].classList.add('win');
                (columns[i - 1])[j + 1].classList.add('win');
                (columns[i - 2])[j + 2].classList.add('win');
                (columns[i - 3])[j + 3].classList.add('win');
                return true;
            }
        }
    }

    //checks ascending diagonals
    for (let i = 3; i < 7; i++) {
        for (let j = 3; j < 6; j++) {
            const first = getClassListArray((columns[i])[j]);
            const second = getClassListArray((columns[i - 1])[j - 1]);
            const third = getClassListArray((columns[i - 2])[j - 2]);
            const fourth = getClassListArray((columns[i - 3])[j - 3])
            if (first.includes(toCheck) && second.includes(toCheck) && third.includes(toCheck) && fourth.includes(toCheck)) {
                (columns[i])[j].classList.add('win');
                (columns[i - 1])[j - 1].classList.add('win');
                (columns[i - 2])[j - 2].classList.add('win');
                (columns[i - 3])[j - 3].classList.add('win');
                return true;
            }
        }
    }


    return false;
};

const resetGame = () => {
    canMove = false;
    winningMessage.classList.remove('show');
    removeListners();
    // yellowIsNext = false;
    // ws = new WebSocket('ws://localhost:3000');
    HOST = location.origin.replace(/^http/, 'ws');
    ws = new WebSocket(HOST);
    BoxForYellowPieces.innerHTML = ''
    setupSocket();
    // cleanBoard();
}

newGameButton.addEventListener('click', resetGame);


/**
 * what about a tie game??????????????????????
 * 
 */