const board = document.getElementById("board");
const scoreHtmlElement = document.getElementById("score");
const bestScoreHtmlElement = document.getElementById("best-score");

const boardWith = 10;
const boardHeight = 15;

let score = 0;

function restartGame() {
  resetBoard();
  resetScores();
}

function resetScores() {
  score = 0;
  scoreHtmlElement.innerHTML = "0";
  bestScoreHtmlElement.innerHTML = "0";
}

function resetBoard() {
  board.innerHTML = "";
  for (let i = 0; i < boardHeight; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    board.appendChild(row);
    for (let j = 0; j < boardWith; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }
  }
}

restartGame();
