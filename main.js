const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "SIG ID Verifier",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// {
//   "name": "sigid-verification",
//   "private": true,
//   "version": "0.0.0",
//   "type": "module",
//   "scripts": {
//     "dev": "vite",
//     "build": "vite build",
//     "lint": "eslint .",
//     "preview": "vite preview"
//   },
//   "dependencies": {
//     "@supabase/supabase-js": "^2.100.1",
//     "@vitejs/plugin-basic-ssl": "^2.3.0",
//     "html5-qrcode": "^2.3.8",
//     "react": "^19.2.4",
//     "react-dom": "^19.2.4"
//   },
//   "devDependencies": {
//     "@eslint/js": "^9.39.4",
//     "@types/react": "^19.2.14",
//     "@types/react-dom": "^19.2.3",
//     "@vitejs/plugin-react": "^6.0.1",
//     "electron": "^41.1.1",
//     "electron-builder": "^26.8.1",
//     "eslint": "^9.39.4",
//     "eslint-plugin-react-hooks": "^7.0.1",
//     "eslint-plugin-react-refresh": "^0.5.2",
//     "globals": "^17.4.0",
//     "vite": "^8.0.1"
//   }
  
// }
