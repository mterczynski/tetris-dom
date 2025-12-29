/**
 * Generate a thumbnail/preview image of the Tetris game
 * Run with: node generate-thumbnail.js
 */

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static file server
function startServer(port) {
  const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Local server running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function generateThumbnail() {
  const port = 3456;

  console.log('Starting local server...');
  const server = await startServer(port);

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport size
  await page.setViewportSize({ width: 800, height: 900 });

  console.log('Loading game...');
  await page.goto(`http://localhost:${port}`);

  // Wait for the board to render
  await page.waitForSelector('#board', { state: 'visible' });

  // Wait for game to start
  await page.waitForTimeout(3000);

  // Take screenshot of the game container
  console.log('Taking screenshot...');
  const gameContainer = await page.$('#game-container');

  if (gameContainer) {
    await gameContainer.screenshot({
      path: 'thumbnail.png'
    });
  } else {
    await page.screenshot({
      path: 'thumbnail.png',
      fullPage: false
    });
  }

  console.log('✓ Thumbnail saved as thumbnail.png');

  await browser.close();
  server.close();
}

generateThumbnail().catch(console.error);
