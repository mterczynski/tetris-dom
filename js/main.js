"use strict";

import { figures } from "./figures.js";
import { renderer } from "./renderer.js";
import { canTranslateFigureByVector } from "./utils.js";

const boardWidth = 10;
const boardHeight = 15;

let score = 0;
let bestScore = 0;
let gameLoopIntervalId;

let boardRows = getNewBoardRows();
let currentFigure = getRandomFigure();

function getNewBoardRows() {
  return [...Array(boardHeight)].map(() => Array(boardWidth).fill(""));
}

function restartGame() {
  renderer.recreateBoard({ width: boardWidth, height: boardHeight });
  resetScores();
  currentFigure = getRandomFigure();
}

function resetScores() {
  score = 0;
  renderer.renderScore(0);
  renderer.renderBestScore(0);
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

function initKeyEventListener() {
  document.addEventListener("keypress", ({ key }) => {
    if (key === "ArrowLeft" || "a" || "A") {
      // todo
    } else if (key === "ArrowRight" || "d" || "D") {
      // todo
    } else if (key === "ArrowDown" || "s" || "S") {
      // todo
    } else if (key === "ArrowUp" || "w" || "W") {
      // todo
    }
  });
}

function tick() {
  if (canTranslateFigureByVector(currentFigure, { x: 0, y: 1 }, boardRows)) {
    currentFigure = {
      ...currentFigure,
      y: currentFigure.y + 1,
    };
  } else {
    // todo
  }
}

function gameLoop() {
  tick();
  renderer.render(boardRows, currentFigure);
}

export function main() {
  gameLoopIntervalId = setInterval(gameLoop, 500);
  initKeyEventListener();
  restartGame();
}
