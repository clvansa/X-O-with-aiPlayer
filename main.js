let oriBorad ;
const huPlayer = 'O';
const aiPlayer = 'X';
const cell = document.querySelectorAll(".cell");
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8],
]

startGame()
function startGame(){
    document.querySelector(".endgame").style.display = 'none'
    oriBorad = Array.from(Array(9).keys());
    for(let i = 0 ; i < cell.length ; i++){
        cell[i].innerHTML = '';
        cell[i].style.removeProperty('background-color');
        cell[i].addEventListener('click',turnClick,false)
    }
}


function turnClick (square){
    if(typeof oriBorad[square.target.id] == 'number'){
        turn(square.target.id, huPlayer)
        if(!checkTie()) turn(bestSpot(), aiPlayer);
    }
    
}

function turn(squareId, player){
    oriBorad[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(oriBorad,player);
    if(gameWon) gameOver(gameWon)
}

function checkWin(board, player){
 let plays = board.reduce((a, e, i )=>
     (e === player) ? a.concat(i) : a, []);
let gameWon = null;
 for(let [index, win] of winCombos.entries()){
     if(win.every(elem => plays.indexOf(elem) > -1)){
         gameWon = {index: index, player: player};
         break;
     }
 }
 return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor =
        gameWon.player == huPlayer ? "blue" : "red";
    }
    for(let i = 0 ; i < cell.length ; i++){
        cell[i].removeEventListener('click',turnClick,false);
    }
    declareWinner(gameWon.player == huPlayer ? "You Win!" : "You lose." )
}
function declareWinner(who){
    document.querySelector(".endgame").style.display = 'block';
    document.querySelector(".endgame .text").innerHTML = who;

}

function emptySquares(){
    return oriBorad.filter(s => typeof s == 'number');
}
function bestSpot(){
    return minimax(oriBorad, aiPlayer).index;
}

function checkTie(){
    if(emptySquares().length == 0){
        for(let i = 0 ; i < cell.length ; i++){
            cell[i].style.backgroundColor = 'green';
            cell[i].removeEventListener('click',turnClick,false)
        }
        declareWinner('Tie Game!')
        return true
    }
    return false
}

function minimax(newBoard, player){
    let availSpot = emptySquares(newBoard);
    if(checkWin(newBoard, player)){
        return {score : -10};
    }else if(checkWin(newBoard, aiPlayer)){
        return {score: 20}
    }else if(availSpot.length === 0){
        return {score: 0}
    }
    let moves = [];
    for(let i = 0 ; i < availSpot.length; i++){
        let move = {}; 
        move.index = newBoard[availSpot[i]];
        newBoard[availSpot[i]] = player;
        
        if(player == aiPlayer){
            let result = minimax(newBoard, huPlayer);
            move.score = result.score;
        }else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }
        newBoard[availSpot[i]] = move.index;
        moves.push(move);
    }
    let bestMove ;
    if(player === aiPlayer){
        let bestScore = -10000;
        for(let i = 0 ; i < moves.length ; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score; 
                bestMove = i ;
            }
        }
    }else {
        let bestScore = 10000;
        for(let i = 0 ; i < moves.length ; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score; 
                bestMove = i ;
            }
        }
    }
    return moves[bestMove]
}