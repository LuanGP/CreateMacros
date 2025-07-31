const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
  // Cria a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png'), // Opcional: ícone do app
    titleBarStyle: 'default',
    show: false // Não mostra até estar pronto
  })

  // Carrega o app
  if (isDev) {
    // Em desenvolvimento, carrega do servidor Vite
    mainWindow.loadURL('http://localhost:5173')
    // Abre DevTools em desenvolvimento
    mainWindow.webContents.openDevTools()
  } else {
    // Em produção, carrega do arquivo build
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Mostra a janela quando estiver pronto
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Define window.electron para detecção no frontend
  mainWindow.webContents.executeJavaScript(`
    window.electron = true;
    window.require = require;
  `)

  // Fecha quando todas as janelas estão fechadas
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Este método será chamado quando o Electron terminar de inicializar
app.whenReady().then(createWindow)

// Quit quando todas as janelas estiverem fechadas
app.on('window-all-closed', () => {
  // No macOS é comum para aplicações manterem-se ativas mesmo quando todas as janelas estão fechadas
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // No macOS é comum recriar uma janela no app quando o dock icon é clicado e não há outras janelas abertas
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Previne múltiplas instâncias do app
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Alguém tentou executar uma segunda instância, devemos focar nossa janela
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// IPC handlers para comunicação entre processos (se necessário)
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-app-name', () => {
  return app.getName()
}) 