const board = document.getElementById("board");
const scoreHtmlElement = document.getElementById("score");
const bestScoreHtmlElement = document.getElementById("best-score");

const boardWidth = 10;
const boardHeight = 15;

let score = 0;
let gameLoopInterval;
let boardRows = getNewBoardRows();
let currentFigure = getRandomFigure();

function getNewBoardRows() {
  return Array(boardHeight).fill(Array(boardWidth));
}

function restartGame() {
  resetBoard();
  resetScores();
  currentFigure = getRandomFigure();
}

function resetScores() {
  score = 0;
  scoreHtmlElement.innerHTML = "0";
  bestScoreHtmlElement.innerHTML = "0";
}

function getRandomFigure() {
  return { ...figures[Math.floor(Math.random() * figures.length)] };
}

function resetBoard() {
  boardRows = getNewBoardRows();
  board.innerHTML = "";
  for (let i = 0; i < boardHeight; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    board.appendChild(row);
    for (let j = 0; j < boardWidth; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }
  }
}

function tick() {

}

function render() {

};

function gameLoop() {
  tick();
  render();
}

gameLoopInterval = setInterval(gameLoop, 500);

restartGame();
