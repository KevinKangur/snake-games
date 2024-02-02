const gameBoardTable = document.getElementById('gameboard');
const foodArray = ['&#127815', '&#127816', '&#127817', '&#127818', '&#127819', '&#127820', '&#127821', '&#127822', '&#127823', '&#127824', '&#127825', '&#127826', '&#127827', '&#129389', '&#129373', '&#129381', '&#127813'];
const messageDiv = document.getElementById('message');
const boardSize = 20

let gameBoard = [...Array(boardSize).keys()].map(() => [...Array(boardSize).keys()].map(() => 0));

const snakeY = parseInt(boardSize / 2);
const snakeX = parseInt(boardSize / 2);

gameBoard[snakeY][snakeX] = 's';
let snake = [snakeY + '_' + snakeX];

let score = 0
const scoreDiv = document.getElementById('score');


let direction = 'u';

let foodY, foodX, foodEmojiIndex;

let intervalID = setInterval(playGame, 200);

document.addEventListener ('keydown', e => {
    switch ( e.key ) {
        case 'w':
            direction = 'u';
            break;
        case 's':
            direction = 'd';
            break;
        case 'a':
            direction = 'l';
            break;
        case 'd':
            direction = 'r';
            break;
    }
});

addFood();

updateHighScore();

// game engine
function playGame () {

    let [cursorY, cursorX] = calculateNewCursor();
    
    if ( hitsBorder(cursorY, cursorX) ) {
        gameOver();
    }

    if ( hitsSnake(cursorY, cursorX) ) {
        gameOver();
    }
   
    snake.unshift(cursorY + '_' + cursorX);
    snake.pop();

    drawGameBoard();
}

// for drawing game board
function drawGameBoard () {

    gameBoardTable.innerHTML = '';
    
    gameBoard.forEach( (row, y) => {
        const boardRowTr = document.createElement('tr');
        row.forEach( (cell, x) => {
            const boardCellTd = document.createElement('td');
            const id = y + '_' + x;
            boardCellTd.setAttribute('id', id);
            if ( snake.includes(id) ) {
                boardCellTd.classList.add('snake');
            }
            if ( y == foodY && x == foodX ) {
                boardCellTd.innerHTML = foodArray[foodEmojiIndex];
            }
            boardRowTr.append(boardCellTd);
        });
        gameBoardTable.append(boardRowTr);
    });

    scoreDiv.innerText = 'Score: ' + score;
}


// calculate new cursor for snake
function calculateNewCursor () {

    let [y, x] = snake[0].split('_');

    switch ( direction ) {
        case 'u':
            y--;
            break;
        case 'd':
            y++;
            break;
        case 'l':
            x--;
            break;
        case 'r':
            x++;
            break;
    }

    if ( y == foodY && x == foodX ) {
        addFood();
        score++;
        snake.push(undefined);
    }

    return [y, x];    
}

// test if snake hits the border
function hitsBorder ( y, x ) {

    if ( y < 0 || y >= boardSize || x < 0 || x >= boardSize ) {
        return true;
    }

    return false;
}

//test if snake hits itself
function hitsSnake ( y, x ) {

    if ( snake.includes(y + '_' + x) ) {
        return true;
    }

    return false;
}

//game over stuff
function gameOver () {
    
    clearInterval(intervalID);
    intervalID = null
    
    messageDiv.innerText = 'Game Over!'
    messageDiv.classList.remove('hidden');

    if ( localStorage.getItem('Top score') < score ) {
        localStorage.setItem('Top score', score)

    }
}

// gerenate food with random

function addFood () {

    do {
        foodY = Math.floor(Math.random() * boardSize);
        foodX = Math.floor(Math.random() * boardSize);
        foodEmojiIndex = Math.floor(Math.random() * foodArray.length);
    } while ( snake.includes(foodY + '_' + foodX) )



    // const foodTd = document.getElementById(y + '_' + x);
    // console.log(y + '_' + x, foodTd);
    // foodTd.classList.add('food');
}

// update high score
function updateHighScore () {
    const highScoreDiv = document.getElementById('high-score');
    const highScore = localStorage.getItem('Top score');
    highScoreDiv.innerText = 'Top score: ' + highScore;  
}