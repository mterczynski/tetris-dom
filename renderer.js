export function Renderer(boardRows) {
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

  function drawBlocks() {
    boardRows.forEach((row, rowIndex) => {
      row.forEach((tile, tileIndex) => {
        if (tile) {
          getHtmlTile({ x: tileIndex, y: rowIndex }).classList.add(tile);
        }
      });
    })
  }

  this.render = () => {
    clearBoard();
    drawBlocks();
  }
}
