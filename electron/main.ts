import { app, BrowserWindow, globalShortcut, ipcMain, Menu } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;
let splash: BrowserWindow | null;

function createWindow() {
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  });
  splash.loadFile(path.join(process.env.VITE_PUBLIC, 'splash.html'));

  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    show: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs')
    }
  });

  win.on('maximize', () => {
    win?.webContents.send('window-status-changed', true);
  });

  win.on('unmaximize', () => {
    win?.webContents.send('window-status-changed', false);
  });

  Menu.setApplicationMenu(null);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  win.maximize();

  win.once('ready-to-show', () => {
    if (splash) {
      splash.close();
      splash = null;
    }
    win?.show();
    win?.maximize();
  });

  win.on('closed', () => (win = null));
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('Control+Shift+I', () => {
    if (win) {
      win.webContents.toggleDevTools();
    }
  });

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    win?.reload();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');

ipcMain.handle('get-window-status', () => {
  return win ? win.isMaximized() : false;
});

ipcMain.on('window-control', (_event, action: 'minimize' | 'maximize' | 'unmaximize' | 'close') => {
  if (!win) return;

  switch (action) {
    case 'minimize':
      win.minimize();
      break;
    case 'maximize':
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
      break;
    case 'unmaximize':
      win.unmaximize();
      break;
    case 'close':
      win.close();
      break;
  }
});
