export function Renderer() {
  const boardHtmlElement = document.getElementById("board");

  function getHtmlTile(position) {
    return document.querySelector(`.row:nth-child(${position.y + 1}) .tile:nth-child(${position.x + 1})`);
  }

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

  function drawCurrentFigure(currentFigure) {

  }

  this.render = (boardRows, currentFigure) => {
    clearBoard();
    drawBlocks(boardRows);
    drawCurrentFigure(currentFigure);
  }

  this.recreateBoard = ({ width, height }) => {
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
  }
}
