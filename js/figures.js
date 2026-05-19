import { generateFigures } from './figureGenerator.js';
import { settings } from './settings.js';

export const figures = Object.freeze(generateFigures(settings.blockSize));

figures.forEach(figure => {
  figure.shape.forEach(row => Object.freeze(row));
  Object.freeze(figure.shape);
  Object.freeze(figure);
});
