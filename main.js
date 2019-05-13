'use strict'

import { figures } from './figures.js'
import { Renderer } from './renderer.js'

const boardHtmlElement = document.getElementById("board");
const scoreHtmlElement = document.getElementById("score");
const bestScoreHtmlElement = document.getElementById("best-score");

const boardWidth = 10;
const boardHeight = 15;

let score = 0;
let gameLoopIntervalId;
let boardRows = getNewBoardRows();
let currentFigure = getRandomFigure();
let renderer = new Renderer();

function getNewBoardRows() {
  return [...Array(boardHeight)].map(() => Array(boardWidth).fill(''));
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
  let figure = { ...figures[Math.floor(Math.random() * figures.length)] };

  return {
    shape: [...figure.shape],
    className: figure.className,
    y: 0,
    x: Math.floor(boardWidth / 2 - figure.shape[0].length / 2),
  };
}

function getFigureBlockPosition(figure) {
  // todo
}

function initKeyEventListener() {
  document.addEventListener('keypress', ({ key }) => {
    if (key === 'ArrowLeft' || 'a' || 'A') {
      translateCurrentShapeIfPossible({ x: -1, y: 0 });
    } else if (key === 'ArrowRight' || 'd' || 'D') {
      translateCurrentShapeIfPossible({ x: 1, y: 0 });
    } else if (key === 'ArrowDown' || 's' || 'S') {
      slamCurrentFigure();
    } else if (key === 'ArrowUp' || 'w' || 'W') {
      rotateCurrentFigureIfPossible();
    }
  });
}

function translateCurrentShapeIfPossible(vector) {
  try {
    let newFigure = {
      ...currentFigure,
      x: currentFigure.x + vector.x,
      y: currentFigure.y + vector.y,
    }

    let canTranslate = newFigure.shape
      .filter(block => block === 1)
      .every(block => true) // todo

    return true;
  } catch {
    return false;
  }
}

function rotateCurrentFigureIfPossible() {
  // todo
}

function slamCurrentFigure() {
  // todo
}

function resetBoard() {
  boardRows = getNewBoardRows();
  boardHtmlElement.innerHTML = "";

  for (let i = 0; i < boardHeight; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    boardHtmlElement.appendChild(row);
    for (let j = 0; j < boardWidth; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      row.appendChild(tile);
    }
  }
}

function tick() {
  if (!translateCurrentShapeIfPossible({ x: 0, y: 1 })) {
    // todo - lock figure, check for full row, check for loss, spawn new figure if not lost
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
