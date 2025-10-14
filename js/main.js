import { figures } from "./figures.js";
import { renderer } from "./renderer.js";
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
let bestScore = localStorage.getItem("bestScore") || 0;

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

function onLeftKeyPressed() {
  moveCurrentFigureByVectorIfPossible({ x: -1, y: 0 }, boardRows);
}

function onRightKeyPressed() {
  moveCurrentFigureByVectorIfPossible({ x: 1, y: 0 }, boardRows);
}

function onDownKeyPressed() {
  slamCurrentFigure();
}

function onUpKeyPressed() {
  rotateFigure(currentFigure, boardRows);
}

function initKeyEventListener() {
  document.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "a", "A"].includes(event.key)) {
      onLeftKeyPressed();
    } else if (["ArrowRight", "d", "D"].includes(event.key)) {
      onRightKeyPressed();
    } else if (["ArrowDown", "s", "S"].includes(event.key)) {
      onDownKeyPressed();
    } else if (["ArrowUp", "w", "W"].includes(event.key)) {
      onUpKeyPressed()
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

function addGamePadControls() {
  window.addEventListener("gamepadconnected", (e) => {
    const index = e.gamepad.index;
    const lastPressTimestamps = {
      12: 0,
      13: 0,
      14: 0,
      15: 0
    };
    const lastReleaseTimestamps = {
      12: 0,
      13: 0,
      14: 0,
      15: 0
    };
    const cooldownDuration = 200; // ms after release before next press
    const buttonStates = {
      12: false,
      13: false,
      14: false,
      15: false
    };

    function loop() {
      const gp = navigator.getGamepads()[index];
      if (!gp) return requestAnimationFrame(loop);

      const currentTime = Date.now();
      [12, 13, 14, 15].forEach(btn => {
        const isPressed = gp.buttons[btn].pressed;
        if (isPressed && !buttonStates[btn]) {
          // Button was just pressed
          if (currentTime - lastReleaseTimestamps[btn] >= cooldownDuration) {
            switch(btn) {
              case 12: onUpKeyPressed(); break;
              case 13: onDownKeyPressed(); break;
              case 14: onLeftKeyPressed(); break;
              case 15: onRightKeyPressed(); break;
            }
            lastPressTimestamps[btn] = currentTime;
          }
        } else if (!isPressed && buttonStates[btn]) {
          // Button was just released
          lastReleaseTimestamps[btn] = currentTime;
        }
        buttonStates[btn] = isPressed;
      });

      requestAnimationFrame(loop);
    }

    loop();
  });
}

function popFullRows() {
  const fullRows = getFullRows(boardRows);
  boardRows = getBoardAfterPoppingRows(fullRows, boardRows);
  score += fullRows.length;
  bestScore = Math.max(bestScore, score);
  localStorage.setItem("bestScore", bestScore);
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
  addGamePadControls();
  restartGame();
}
