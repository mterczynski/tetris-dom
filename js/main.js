import { figures } from "./figures.js";
import { renderer } from "./renderer.js";
import { settings } from "./settings.js";
import {
  canFigureBeRotatedAsNewFigure,
  canTranslateFigureByVector,
  getBoardAfterPoppingRows,
  getFigureBlockPositions,
  getFullRows,
  getRotatedFigure,
  getSlammedFigure,
  isFigurePartiallyAboveBoard,
} from "./utils.js";

const boardWidth = 10;
const boardHeight = 15;

let score = 0;
let bestScore = localStorage.getItem("tetris_bestScore") || 0;

let boardRows = getNewBoardRows();
let currentFigure = getRandomFigure();

function getNewBoardRows() {
  return [...Array(boardHeight)].map(() => Array(boardWidth).fill(""));
}

function restartGame() {
  score = 0;
  boardRows = getNewBoardRows();
  currentFigure = getRandomFigure();
  renderer.recreateBoardHtmlElement({ width: boardWidth, height: boardHeight });
  renderer.renderScore(score);
  renderer.renderBestScore(bestScore);
}

function getRandomFigure() {
  let figure = { ...figures[Math.floor(Math.random() * figures.length)] };

  return {
    shape: [...figure.shape],
    className: figure.className,
    rotable: figure.rotable,
    y: figure.y,
    x: Math.floor(boardWidth / 2 - figure.shape[0].length / 2),
  };
}

function moveCurrentFigureByVectorIfPossible(vector, boardRows) {
  if (canTranslateFigureByVector(currentFigure, vector, boardRows)) {
    currentFigure = {
      ...currentFigure,
      x: currentFigure.x + vector.x,
      y: currentFigure.y + vector.y,
    };
  }

  renderer.renderBoardAndCurrentFigure(boardRows, currentFigure);
}

function placeFigureInBoard(figure, boardRows) {
  getFigureBlockPositions(figure).forEach(({ x, y }) => {
    boardRows[y][x] = figure.className;
  });

  currentFigure = getRandomFigure();
  renderer.renderBoardAndCurrentFigure(boardRows, currentFigure);
}

function slamCurrentFigure() {
  currentFigure = getSlammedFigure(currentFigure, boardRows);

  if (isFigurePartiallyAboveBoard(currentFigure)) {
    gameOver();
  } else {
    placeFigureInBoard(currentFigure, boardRows);
    popFullRows();
    renderer.renderBoardAndCurrentFigure(boardRows, currentFigure);
  }
}

function initKeyEventListener() {
  document.addEventListener("keydown", (event) => {
    console.log(`Key pressed: ${event.key}`); // Debugging to check which key is detected

    if (["ArrowLeft", "a", "A"].includes(event.key)) {
      moveCurrentFigureByVectorIfPossible({ x: -1, y: 0 }, boardRows);
    } else if (["ArrowRight", "d", "D"].includes(event.key)) {
      moveCurrentFigureByVectorIfPossible({ x: 1, y: 0 }, boardRows);
    } else if (["ArrowDown", "s", "S"].includes(event.key)) {
      slamCurrentFigure();
    } else if (["ArrowUp", "w", "W"].includes(event.key)) {
      rotateFigure(currentFigure, boardRows);
    }
  });

  // Button Event Listeners
  document.querySelector(".arrow_up")?.addEventListener("click", () => {
    rotateFigure(currentFigure, boardRows);
  });

  document.querySelector(".arrow_down")?.addEventListener("click", () => {
    slamCurrentFigure();
  });

  document.querySelector(".arrow-aside_1")?.addEventListener("click", () => {
    moveCurrentFigureByVectorIfPossible({ x: -1, y: 0 }, boardRows);
  });

  document.querySelector(".arrow-aside_2")?.addEventListener("click", () => {
    moveCurrentFigureByVectorIfPossible({ x: 1, y: 0 }, boardRows);
  });
}

function popFullRows() {
  const fullRows = getFullRows(boardRows);
  boardRows = getBoardAfterPoppingRows(fullRows, boardRows);
  score += fullRows.length;
  bestScore = Math.max(bestScore, score);
  localStorage.setItem("tetris_bestScore", bestScore);
  renderer.renderScore(score);
  renderer.renderBestScore(bestScore);
}

function tick() {
  if (canTranslateFigureByVector(currentFigure, { x: 0, y: 1 }, boardRows)) {
    currentFigure = {
      ...currentFigure,
      y: currentFigure.y + 1,
    };
  } else if (isFigurePartiallyAboveBoard(currentFigure)) {
    gameOver();
  } else {
    placeFigureInBoard(currentFigure, boardRows);
    popFullRows();
  }
}

function gameOver() {
  alert(`Game over, your score: ${score}`);
  restartGame();
}

function gameLoop() {
  tick();
  renderer.renderBoardAndCurrentFigure(boardRows, currentFigure);
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

  renderer.renderBoardAndCurrentFigure(boardRows, currentFigure);
}

function setPortraitModeIfPossible() {
  try {
    screen.orientation.lock("portrait");
  } catch {}
}

export function main() {
  setPortraitModeIfPossible();
  setInterval(gameLoop, 500);
  initKeyEventListener();
  restartGame();
  
  // Hide controls if showControls is false
  if (!settings.showControls) {
    const controls = document.querySelector('.controls');
    if (controls) {
      controls.style.display = 'none';
    }
    const mainMain = document.querySelector('.main_main');
    if (mainMain) {
      mainMain.style.display = 'none';
    }
  }
}
