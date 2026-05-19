const NEIGHBOR_VECTORS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const FIGURE_CLASS_NAMES = [
  'figure-pyramid',
  'figure-line',
  'figure-z',
  'figure-s',
  'figure-square',
  'figure-j',
  'figure-l',
];

function sortPositions(positions) {
  return [...positions].sort((a, b) => a.y - b.y || a.x - b.x);
}

function normalizePositions(positions) {
  const minX = Math.min(...positions.map(position => position.x));
  const minY = Math.min(...positions.map(position => position.y));

  return sortPositions(
    positions.map(position => ({
      x: position.x - minX,
      y: position.y - minY,
    }))
  );
}

function getPositionsKey(positions) {
  return positions.map(position => `${position.x},${position.y}`).join(';');
}

function rotatePositionsClockwise(positions) {
  return normalizePositions(
    positions.map(position => ({
      x: position.y,
      y: -position.x,
    }))
  );
}

function getRotationInvariantKey(positions) {
  let rotated = normalizePositions(positions);
  let keys = [getPositionsKey(rotated)];

  for (let i = 0; i < 3; i += 1) {
    rotated = rotatePositionsClockwise(rotated);
    keys.push(getPositionsKey(rotated));
  }

  return keys.sort()[0];
}

function parsePositionsKey(key) {
  return key.split(';').map(token => {
    const [x, y] = token.split(',').map(Number);

    return { x, y };
  });
}

function getAllOneSidedPolyominoes(blockSize) {
  let polyominoes = [[{ x: 0, y: 0 }]];

  for (let size = 2; size <= blockSize; size += 1) {
    const nextPolyominoesByKey = new Map();

    polyominoes.forEach(polyomino => {
      const occupied = new Set(getPositionsKey(polyomino).split(';'));

      polyomino.forEach(position => {
        NEIGHBOR_VECTORS.forEach(vector => {
          const candidate = {
            x: position.x + vector.x,
            y: position.y + vector.y,
          };

          const candidateToken = `${candidate.x},${candidate.y}`;

          if (occupied.has(candidateToken)) {
            return;
          }

          const normalized = normalizePositions([...polyomino, candidate]);
          const canonicalKey = getRotationInvariantKey(normalized);

          if (!nextPolyominoesByKey.has(canonicalKey)) {
            nextPolyominoesByKey.set(canonicalKey, parsePositionsKey(canonicalKey));
          }
        });
      });
    });

    polyominoes = [...nextPolyominoesByKey.values()];
  }

  return polyominoes;
}

function arePositionsInvariantUnderQuarterTurn(positions) {
  const normalized = normalizePositions(positions);
  const rotated = rotatePositionsClockwise(normalized);

  return getPositionsKey(normalized) === getPositionsKey(rotated);
}

function getCenterPosition(positions, width, height) {
  const center = {
    x: (width - 1) / 2,
    y: (height - 1) / 2,
  };

  return [...positions].sort((a, b) => {
    const distanceA = Math.abs(a.x - center.x) + Math.abs(a.y - center.y);
    const distanceB = Math.abs(b.x - center.x) + Math.abs(b.y - center.y);

    return distanceA - distanceB || a.y - b.y || a.x - b.x;
  })[0];
}

function getShapeFromPositions(positions, rotable) {
  const width = Math.max(...positions.map(position => position.x)) + 1;
  const height = Math.max(...positions.map(position => position.y)) + 1;

  const shape = [...Array(height)].map(() => Array(width).fill(0));

  positions.forEach(position => {
    shape[position.y][position.x] = 1;
  });

  if (rotable) {
    const centerPosition = getCenterPosition(positions, width, height);
    shape[centerPosition.y][centerPosition.x] = 2;
  }

  return shape;
}

export function generateFigures(blockSize) {
  const polyominoes = getAllOneSidedPolyominoes(blockSize)
    .map(normalizePositions)
    .sort((a, b) => {
      const widthA = Math.max(...a.map(position => position.x)) + 1;
      const widthB = Math.max(...b.map(position => position.x)) + 1;
      const heightA = Math.max(...a.map(position => position.y)) + 1;
      const heightB = Math.max(...b.map(position => position.y)) + 1;

      return heightA - heightB || widthA - widthB || getPositionsKey(a).localeCompare(getPositionsKey(b));
    });

  return polyominoes.map((positions, index) => {
    const rotable = !arePositionsInvariantUnderQuarterTurn(positions);
    const shape = getShapeFromPositions(positions, rotable);

    return {
      className: FIGURE_CLASS_NAMES[index % FIGURE_CLASS_NAMES.length],
      shape,
      rotable,
      y: -shape.length,
    };
  });
}
