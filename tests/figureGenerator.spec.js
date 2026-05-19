import { generateFigures } from '../js/figureGenerator';

function getFilledPositions(shape) {
  const positions = [];

  shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        positions.push({ x, y });
      }
    });
  });

  return positions;
}

function normalizePositions(positions) {
  const minX = Math.min(...positions.map(position => position.x));
  const minY = Math.min(...positions.map(position => position.y));

  return [...positions]
    .map(position => ({ x: position.x - minX, y: position.y - minY }))
    .sort((a, b) => a.y - b.y || a.x - b.x);
}

function rotatePositionsClockwise(positions) {
  return normalizePositions(positions.map(position => ({ x: position.y, y: -position.x })));
}

function getRotationInvariantKey(shape) {
  let positions = normalizePositions(getFilledPositions(shape));
  const keys = [positions.map(position => `${position.x},${position.y}`).join(';')];

  for (let i = 0; i < 3; i += 1) {
    positions = rotatePositionsClockwise(positions);
    keys.push(positions.map(position => `${position.x},${position.y}`).join(';'));
  }

  return keys.sort()[0];
}

describe('generateFigures', () => {
  test('should generate 7 one-sided tetrominoes for blockSize = 4', () => {
    // when
    const generatedFigures = generateFigures(4);

    // then
    expect(generatedFigures).toHaveLength(7);
    generatedFigures.forEach(figure => {
      const blockCount = getFilledPositions(figure.shape).length;
      expect(blockCount).toBe(4);
      expect(figure.y).toBe(-figure.shape.length);
    });
  });

  test('should generate unique figures up to rotation for blockSize = 4', () => {
    // when
    const generatedFigures = generateFigures(4);

    // then
    const keys = generatedFigures.map(figure => getRotationInvariantKey(figure.shape));
    expect(new Set(keys).size).toBe(generatedFigures.length);
  });

  test('should generate 2 one-sided triominoes for blockSize = 3', () => {
    // when
    const generatedFigures = generateFigures(3);

    // then
    expect(generatedFigures).toHaveLength(2);
    generatedFigures.forEach(figure => {
      expect(getFilledPositions(figure.shape)).toHaveLength(3);
    });
  });
});
