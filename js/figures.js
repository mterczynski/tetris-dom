export const figures = Object.freeze([
  {
    className: 'figure-pyramid',
    shape: [
      [0, 1, 0],
      [1, 2, 1],
    ],
    rotable: true,
  },
  {
    className: 'figure-line',
    shape: [
      [1],
      [1],
      [2],
      [1],
    ],
    rotable: true,
  },
  {
    className: 'figure-z',
    shape: [
      [1, 1, 0],
      [0, 2, 1],
    ],
    rotable: true,
  },
  {
    className: 'figure-s',
    shape: [
      [0, 2, 1],
      [1, 1, 0],
    ],
    rotable: true,
  },
  {
    className: 'figure-square',
    shape: [
      [1, 1],
      [1, 1],
    ],
    rotable: false,
  },
  {
    className: 'figure-j',
    shape: [
      [0, 1],
      [0, 1],
      [1, 2],
    ],
    rotable: true,
  },
  {
    className: 'figure-l',
    shape: [
      [1, 0],
      [1, 0],
      [2, 1],
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
