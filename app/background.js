// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, ipcMain } from 'electron'
import globalShortcut from 'global-shortcut'
import path from 'path'

import { devMenuTemplate } from './helpers/dev_menu_template'
import { editMenuTemplate } from './helpers/edit_menu_template'
import { windowHelper } from './helpers/window'
import env from './env'
import configuration from './configuration'

var setApplicationMenu = function () {
  var menus = [editMenuTemplate]
  if (env.name !== 'production') {
    menus.push(devMenuTemplate)
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}

app.on('ready', function () {
  setApplicationMenu()

  var mainWindow = windowHelper({
    width: 600,
    height: 400,
    show: false,
    frame: false,
  })

  // mainWindow.webContents.toggleDevTools();

  ipcMain.on('message', (_, message) => {
    console.log('message:', message)
  })

  ipcMain.on('hideWindow', (_, error) => {
    mainWindow.hide()
  })

  globalShortcut.register(configuration.hotkey, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  globalShortcut.register('esc', () => {
    mainWindow.hide()
  })

  mainWindow.loadURL(path.join('file://', __dirname, '/app.html'))
})

app.on('window-all-closed', function () {
  app.quit()
})
