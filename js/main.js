import { figures } from "./figures.js";
import { renderer } from "./renderer.js";
import { canTranslateFigureByVector, getBoardAfterPoppingRows, getFigureBlockPositions, getFullRows, getSlammedFigure, isFigurePartiallyAboveBoard } from "./utils.js";

const boardWidth = 10;
const boardHeight = 15;

let boardRows = getNewBoardRows();
let currentFigure = getRandomFigure();

function getNewBoardRows() {
  return [...Array(boardHeight)].map(() => Array(boardWidth).fill(""));
}

function restartGame() {
  renderer.recreateBoard({ width: boardWidth, height: boardHeight });
  currentFigure = getRandomFigure();
}

function getRandomFigure() {
  let figure = { ...figures[Math.floor(Math.random() * figures.length)] };

  return {
    shape: [...figure.shape],
    className: figure.className,
    y: figure.y,
    x: Math.floor(boardWidth / 2 - figure.shape[0].length / 2)
  };
}

function moveCurrentFigureByVectorIfPossible(vector, boardRows) {
  if (canTranslateFigureByVector(currentFigure, vector, boardRows)) {
    currentFigure = {
      ...currentFigure,
      x: currentFigure.x + vector.x,
      y: currentFigure.y + vector.y,
    }
  }
  renderer.render(boardRows, currentFigure);
}

function placeFigureInBoard(figure, boardRows) {
  getFigureBlockPositions(figure).forEach(({ x, y }) => {
    boardRows[y][x] = figure.className;
  });

  currentFigure = getRandomFigure();
  renderer.render(boardRows, currentFigure);
}

function slamCurrentFigure() {
  currentFigure = getSlammedFigure(currentFigure, boardRows);
  placeFigureInBoard(currentFigure, boardRows);
  popFullRows();
  renderer.render(boardRows, currentFigure);
}

function initKeyEventListener() {
  document.addEventListener("keypress", ({ key }) => {
    // todo - add arrow support
    if (["ArrowLeft", "a", "A"].includes(key)) {
      moveCurrentFigureByVectorIfPossible({ x: -1, y: 0 }, boardRows);
    } else if (["ArrowRight", "d", "D"].includes(key)) {
      moveCurrentFigureByVectorIfPossible({ x: 1, y: 0 }, boardRows);
    } else if (["ArrowDown", "s", "S"].includes(key)) {
      slamCurrentFigure();
    } else if (["ArrowUp", "w", "W"].includes(key)) {
      // todo - rotate figure
    }
  });
}

function popFullRows() {
  const fullRows = getFullRows(boardRows);
  // todo - add score
  boardRows = getBoardAfterPoppingRows(fullRows, boardRows);
}

function tick() {
  if (canTranslateFigureByVector(currentFigure, { x: 0, y: 1 }, boardRows)) {
    currentFigure = {
      ...currentFigure,
      y: currentFigure.y + 1,
    };
  } else if (isFigurePartiallyAboveBoard(currentFigure)) {
    // todo - game over
    console.log('game over')
  } else {
    placeFigureInBoard(currentFigure, boardRows);
    popFullRows();
  }
}

function gameLoop() {
  tick();
  renderer.render(boardRows, currentFigure);
}

export function main() {
  setInterval(gameLoop, 500);
  initKeyEventListener();
  restartGame();
}
