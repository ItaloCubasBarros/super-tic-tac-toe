
const bigBoard = document.getElementById('bigBoard');
let currentPlayer = 'X';
let nextBoardIndex = null;
let gameOver = false; // << agora temos um controle de fim de jogo

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const smallBoard = document.createElement('div');
    smallBoard.classList.add('small-board');
    smallBoard.dataset.index = i;
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.cellIndex = j;
      cell.addEventListener('click', handleCellClick);
      smallBoard.appendChild(cell);
    }
    bigBoard.appendChild(smallBoard);
  }
}

function updatePlayerTurn() {
const playerTurn = document.getElementById('playerTurn');
playerTurn.textContent = `Vez do Jogador: ${currentPlayer}`;
}



function handleCellClick(event) {
  if (gameOver) return; // Se já acabou, bloqueia

  const cell = event.target;
  const smallBoard = cell.parentElement;
  const smallBoardIndex = parseInt(smallBoard.dataset.index);
  const cellIndex = parseInt(cell.dataset.cellIndex);

  if (cell.textContent !== '') return;
  if (nextBoardIndex !== null && smallBoardIndex !== nextBoardIndex) return;

  cell.textContent = currentPlayer;


  if (checkMiniWin(smallBoard)) {
    smallBoard.classList.add('won');
    smallBoard.dataset.winner = currentPlayer;


    if (checkBigWin()) {
      gameOver = true;
      setTimeout(() => {
        alert(`Jogador ${currentPlayer} venceu o jogo!`);
      }, 100);
      return;
    }
  }


  const nextSmallBoard = bigBoard.children[cellIndex];
  if (nextSmallBoard && !nextSmallBoard.classList.contains('won')) {
    nextBoardIndex = cellIndex;
  } else {
    nextBoardIndex = null;
  }

  updateHighlights();

  
currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
updatePlayerTurn();
}

function checkMiniWin(board) {
  const cells = board.querySelectorAll('.cell');
  const combos = [
    [0,1,2], [3,4,5], [6,7,8], // linhas
    [0,3,6], [1,4,7], [2,5,8], // colunas
    [0,4,8], [2,4,6]           // diagonais
  ];

  return combos.some(combo => {
    const [a,b,c] = combo;
    return (
      cells[a].textContent === currentPlayer &&
      cells[b].textContent === currentPlayer &&
      cells[c].textContent === currentPlayer
    );
  });
}

function checkBigWin() {
  const smallBoards = document.querySelectorAll('.small-board');
  const boardWinners = Array.from(smallBoards).map(board => board.dataset.winner || '');

  const combos = [
    [0,1,2], [3,4,5], [6,7,8], // linhas
    [0,3,6], [1,4,7], [2,5,8], // colunas
    [0,4,8], [2,4,6]           // diagonais
  ];

  return combos.some(combo => {
    const [a,b,c] = combo;
    return (
      boardWinners[a] === currentPlayer &&
      boardWinners[b] === currentPlayer &&
      boardWinners[c] === currentPlayer
    );
  });
}

function updateHighlights() {
  const smallBoards = document.querySelectorAll('.small-board');
  smallBoards.forEach(board => {
    board.classList.remove('highlight');
  });

  if (nextBoardIndex === null) {
    smallBoards.forEach(board => {
      if (!board.classList.contains('won')) {
        board.classList.add('highlight');
      }
    });
  } else {
    const nextBoard = document.querySelector(`.small-board[data-index="${nextBoardIndex}"]`);
    if (nextBoard) {
      nextBoard.classList.add('highlight');
    }
  }
}

createBoard();
updateHighlights();
updatePlayerTurn();