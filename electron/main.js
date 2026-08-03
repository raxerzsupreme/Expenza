const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'out');

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'expenza',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

function resolveFilePath(url) {
  const { pathname } = new URL(url);
  let decoded = decodeURIComponent(pathname).replace(/^\/+/, '');
  let filePath = path.resolve(OUT_DIR, decoded);
  if (filePath !== OUT_DIR && !filePath.startsWith(OUT_DIR + path.sep)) {
    throw new Error('Invalid path');
  }
  if (decoded === '' || decoded.endsWith('/') || path.extname(decoded) === '') {
    filePath = path.join(filePath, 'index.html');
  }
  return filePath;
}

function registerProtocol() {
  protocol.handle('expenza', (request) => {
    try {
      const filePath = resolveFilePath(request.url);
      const data = fs.readFileSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      return new Response(data, {
        headers: {
          'Content-Type': MIME[ext] || 'application/octet-stream',
          'Cache-Control': 'no-cache',
        },
      });
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 940,
    minHeight: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL('expenza://app/index.html');
}

if (require.main === module) {
  app.whenReady().then(() => {
    registerProtocol();
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

module.exports = { registerProtocol, createWindow, resolveFilePath, OUT_DIR, MIME };
