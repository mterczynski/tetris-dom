import { figures } from "./figures.js";
import { renderer } from "./renderer.js";
import { canFigureBeRotatedAsNewFigure, canTranslateFigureByVector, getBoardAfterPoppingRows, getFigureBlockPositions, getFullRows, getRotatedFigure, getSlammedFigure, isFigurePartiallyAboveBoard } from "./utils.js";

const boardWidth = 10;
const boardHeight = 15;

let boardRows = getNewBoardRows();
// let boardRows = [["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", "", "", ""], ["", "", "figure-l", "figure-l", "", "", "", "", "", ""], ["", "figure-j", "figure-j", "figure-l", "", "figure-square", "figure-square", "figure-j", "figure-j", "figure-j"], ["figure-line", "figure-j", "", "figure-l", "", "figure-square", "figure-square", "figure-square", "figure-square", "figure-j"], ["figure-line", "figure-j", "figure-z", "", "figure-z", "figure-z", "figure-z", "figure-square", "figure-square", "figure-line"], ["figure-line", "figure-z", "figure-s", "figure-z", "figure-pyramid", "figure-pyramid", "figure-l", "", "figure-j", "figure-line"], ["figure-j", "figure-s", "", "figure-s", "figure-s", "figure-s", "figure-l", "figure-l", "figure-square", "figure-square"], ["", "figure-pyramid", "figure-s", "figure-j", "figure-z", "figure-z", "figure-square", "figure-square", "", "figure-line"], ["figure-pyramid", "figure-pyramid", "figure-s", "figure-j", "figure-j", "figure-j", "figure-square", "figure-square", "", "figure-line"], ["figure-line", "figure-pyramid", "figure-line", "", "figure-s", "figure-s", "figure-s", "figure-z", "figure-square", "figure-square"], ["figure-l", "figure-l", "figure-l", "figure-j", "figure-j", "figure-square", "figure-square", "figure-l", "", "figure-l"]]
let currentFigure = getRandomFigure();
// let currentFigure = { "shape": [[1, 1], [1, 1]], "className": "figure-square", "rotable": false, "y": 4, "x": 8 };

function getNewBoardRows() {
  return [...Array(boardHeight)].map(() => Array(boardWidth).fill(""));
}

function restartGame() {
  renderer.recreateBoard({ width: boardWidth, height: boardHeight });
  currentFigure = getRandomFigure();
  // currentFigure = { "shape": [[1, 1], [1, 1]], "className": "figure-square", "rotable": false, "y": 0, "x": 8 };
}

function getRandomFigure() {
  let figure = { ...figures[Math.floor(Math.random() * figures.length)] };

  return {
    shape: [...figure.shape],
    className: figure.className,
    rotable: figure.rotable,
    y: figure.y,
    x: Math.floor(boardWidth / 2 - figure.shape[0].length / 2)
  };
}

function moveCurrentFigureByVectorIfPossible(vector, boardRows) {
  if (canTranslateFigureByVector(currentFigure, vector, boardRows)) {
    currentFigure = {
      ...currentFigure,
      x: currentFigure.x + vector.x,
      y: currentFigure.y + vector.y
    };
  }

  renderer.render(boardRows, currentFigure);
}

function placeFigureInBoard(figure, boardRows) {
  console.group();
  let oldBoardRows = JSON.parse(JSON.stringify(boardRows));

  const figureBlockPositions = getFigureBlockPositions(figure); // ok

  figureBlockPositions.forEach((el, i, arr) => {
    let oldBoard = JSON.parse(JSON.stringify(boardRows))
    boardRows[el.y][el.x] = figure.className;
    console.log({
      el: JSON.parse(JSON.stringify(el)),
      boardBeforeUpdate: oldBoard,
      boardAfterUpdate: JSON.parse(JSON.stringify(boardRows)),
      arr: JSON.parse(JSON.stringify(arr)),
      i: i,
    });
  });

  let newBoardRows = JSON.parse(JSON.stringify(boardRows));

  function getAmountOfBlocksInBoard(boardRows) {
    return boardRows
      .map(row => row.filter(Boolean).length)
      .reduce((acc, next) => acc + next, 0);
  }

  const oldAmountOfBlocks = getAmountOfBlocksInBoard(oldBoardRows);
  const newAmountOfBlocks = getAmountOfBlocksInBoard(newBoardRows);

  if (newAmountOfBlocks - 4 > oldAmountOfBlocks) {
    debugger;
  }

  currentFigure = getRandomFigure();
  renderer.render(boardRows, currentFigure);
  console.groupEnd();
  console.log('===== Figure placed ====')
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
      rotateFigure(currentFigure, boardRows);
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
      y: currentFigure.y + 1
    };
  } else if (isFigurePartiallyAboveBoard(currentFigure)) {
    // todo - game over
    console.log("game over");
  } else {
    placeFigureInBoard(currentFigure, boardRows);
    popFullRows();
  }
}

function gameLoop() {
  tick();
  renderer.render(boardRows, currentFigure);
}

function rotateFigure(figure, boardRows) {
  if (!figure.rotable) {
    return;
  }

  const rotatedFigure = getRotatedFigure(figure);

  if (!canFigureBeRotatedAsNewFigure(rotatedFigure, boardRows)) {
    return;
  }

  currentFigure = rotatedFigure;

  renderer.render(boardRows, currentFigure);
}

export function main() {
  setInterval(gameLoop, 500);
  initKeyEventListener();
  restartGame();
}
