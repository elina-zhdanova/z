let players = ['x', 'o'];
let activePlayer = 0;
let board;
let cellCount = 0;

function startGame() {
  board = [
    ["", "", ""], 
    ["", "", ""], 
    ["", "", ""], 
  ];

  activePlayer = players[Math.floor(Math.random() * 2)];
  alert("Первым начинает игрок: " + activePlayer);
  
  renderBoard(board);
  cellCount = 0;
}

function click(numRow, numCol) {
  
  board[numRow][numCol] = activePlayer;
  renderBoard(board);
  cellCount++;
   if (activePlayer === players[0]) {
      activePlayer = players[1];    
    } else if ((activePlayer = players[1])) {
      activePlayer = players[0];   
    }

   if (
    (board[0][0] === activePlayer &&
      board[0][1] === activePlayer &&
      board[0][2] === activePlayer) ||
    
    (board[1][0] === activePlayer &&
      board[1][1] === activePlayer &&
      board[1][2] === activePlayer) ||
    
    (board[2][0] === activePlayer &&
      board[2][1] === activePlayer &&
      board[2][2] === activePlayer) ||
    
    (board[0][0] === activePlayer &&
      board[1][0] === activePlayer &&
      board[2][0] === activePlayer) ||
    
    (board[0][1] === activePlayer &&
      board[1][1] === activePlayer &&
      board[2][1] === activePlayer) ||
    
    (board[0][2] === activePlayer &&
      board[1][2] === activePlayer &&
      board[2][2] === activePlayer) ||
    
    (board[0][0] === activePlayer &&
      board[1][1] === activePlayer &&
      board[2][2] === activePlayer) ||
    
    (board[0][2] === activePlayer &&
      board[1][1] === activePlayer &&
      board[2][0] === activePlayer)
  ) {
     showWinner(alert("Выиграл игрок " + activePlayer));
}
  else if(cellCount === 9) {
    alert("Ничья");
  }
}
