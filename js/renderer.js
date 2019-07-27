import { getFigureBlockPositions, getFigureBlockPositionsInsideBoard, getHtmlTile } from "./utils.js";

function clearBoard() {
  [...document.querySelectorAll('.tile')].forEach(tile =>
    tile.className = tile.className
      .split(' ')
      .filter(className => !className.startsWith('figure'))
      .join(' ')
  )
}

function drawBlocks(boardRows) {
  boardRows.forEach((row, rowIndex) => {
    row.forEach((tile, tileIndex) => {
      if (tile) {
        getHtmlTile({ x: tileIndex, y: rowIndex }).classList.add(tile);
      }
    });
  })
}

function drawCurrentFigure(currentFigure, boardHeight) {
  const figureBlockPositions = getFigureBlockPositions(currentFigure);

  getFigureBlockPositionsInsideBoard(figureBlockPositions, boardHeight).forEach(block => {
    getHtmlTile(block).classList.add(currentFigure.className);
  });
}

export const renderer = {
  renderBoardAndCurrentFigure(boardRows, currentFigure) {
    clearBoard();
    drawBlocks(boardRows);
    drawCurrentFigure(currentFigure, boardRows.length);
  },

  recreateBoardHtmlElement({ width, height }) {
    const boardHtmlElement = document.getElementById("board");
    boardHtmlElement.innerHTML = "";

    for (let i = 0; i < height; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      boardHtmlElement.appendChild(row);
      for (let j = 0; j < width; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        row.appendChild(tile);
      }
    }
  },

  renderScore(score) {
    const scoreHtmlElement = document.getElementById("score");
    scoreHtmlElement.innerHTML = score;
  },

  renderBestScore(bestScore) {
    const bestScoreHtmlElement = document.getElementById("best-score");
    bestScoreHtmlElement.innerHTML = bestScore;
  }
}
