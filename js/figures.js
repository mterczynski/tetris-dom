export const figures = Object.freeze([
  // F pentomino
  {
    className: 'figure-f',
    shape: [
      [0, 1, 1],
      [1, 2, 0],
      [0, 1, 0],
    ],
    rotable: true,
  },
  // I pentomino (line)
  {
    className: 'figure-i',
    shape: [
      [1],
      [1],
      [2],
      [1],
      [1],
    ],
    rotable: true,
  },
  // L pentomino
  {
    className: 'figure-l',
    shape: [
      [1, 0],
      [1, 0],
      [1, 0],
      [2, 1],
    ],
    rotable: true,
  },
  // N pentomino
  {
    className: 'figure-n',
    shape: [
      [0, 1, 0],
      [1, 2, 0],
      [1, 0, 0],
      [1, 0, 0],
    ],
    rotable: true,
  },
  // P pentomino
  {
    className: 'figure-p',
    shape: [
      [1, 1],
      [2, 1],
      [1, 0],
    ],
    rotable: true,
  },
  // T pentomino (plus/cross)
  {
    className: 'figure-t',
    shape: [
      [1, 1, 1],
      [0, 2, 0],
      [0, 1, 0],
    ],
    rotable: true,
  },
  // U pentomino
  {
    className: 'figure-u',
    shape: [
      [1, 0, 1],
      [2, 1, 1],
    ],
    rotable: true,
  },
  // V pentomino
  {
    className: 'figure-v',
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [2, 1, 1],
    ],
    rotable: true,
  },
  // W pentomino
  {
    className: 'figure-w',
    shape: [
      [1, 0, 0],
      [2, 1, 0],
      [0, 1, 1],
    ],
    rotable: true,
  },
  // X pentomino (plus)
  {
    className: 'figure-x',
    shape: [
      [0, 1, 0],
      [1, 2, 1],
      [0, 1, 0],
    ],
    rotable: true,
  },
  // Y pentomino
  {
    className: 'figure-y',
    shape: [
      [0, 1],
      [1, 2],
      [0, 1],
      [0, 1],
    ],
    rotable: true,
  },
  // Z pentomino
  {
    className: 'figure-z',
    shape: [
      [1, 1, 0],
      [0, 2, 0],
      [0, 1, 1],
    ],
    rotable: true,
  },
]
  .map(figure => ({ ...figure, y: -figure.shape.length })));

figures.forEach(figure => {
  figure.shape.forEach(row => Object.freeze(row));
  Object.freeze(figure.shape);
  Object.freeze(figure);
});
