/** ***************************************************************************
 * Copyright © 2018 Monaize Singapore PTE. LTD.                               *
 *                                                                            *
 * See the AUTHORS, and LICENSE files at the top-level directory of this      *
 * distribution for the individual copyright holder information and the       *
 * developer policies on copyright and licensing.                             *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Monaize Singapore PTE. LTD software, including this file may be copied,    *
 * modified, propagated or distributed except according to the terms          *
 * contained in the LICENSE file                                              *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

import { app, BrowserWindow, Menu, shell } from 'electron';

require('electron-debug')({ showDevTools: true });
const path = require('path');
const ipc = require('electron').ipcMain;
const { protocol } = require('electron');
const { session } = require('electron')
const { coins } = require('libwallet-utrum')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

/**
 * Create windows electron for open aboutView.
 * @returns {null} None
 */
function aboutView() {
  mainWindow.webContents.send('aboutView');
}

/**
 * Create windows electron with specifications.
 * @returns {null} None
 */
function createWindow() {
  /**
   * Initial window options
   */
  const environment = process.env.NODE_ENV;
  mainWindow = new BrowserWindow({
    // useContentSize: true,
    // titleBarStyle: 'hidden',
    // transparent: true, frame: false,
    center: true,
    width: 1100,
    height: 755,
    minWidth: 1100,
    minHeight: 580,
    webPreferences: {
      //preload: path.resolve(__dirname, "..", "..", "src", "main", "preload.js"), // TODO: experiment
      nodeIntegration: false,  // SECURITY: don't change!
      contextIsolation: true,  // SECURITY: don't change!
      sandbox: environment === 'development' ? false : true,  // SECURITY: don't change!
      webSecurity: true,  // SECURITY: don't change!
      allowRunningInsecureContent: false,  // SECURITY: don't change!
      enableRemoteModule: false,  // SECURITY: don't change!
    },
  });

  const template = [{
    label: 'Utrum Wallet App',
    submenu: [
        { label: 'About Utrum Wallet', click: function () { aboutView() } },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function () { app.quit(); } },
    ] }, {
      label: 'Edit',
      submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
          { label: 'Open DevTools', accelerator: 'F12', click: function() { mainWindow.webContents.openDevTools(); } },
      ] },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  ipc.on('console', function (ev) {
    const args = [].slice.call(arguments, 1);
    const r = console.log.apply(console, args);
    ev.returnValue = [r];
  });
  ipc.on('app', function (ev, msg) {
    const args = [].slice.call(arguments, 2);
    ev.returnValue = [app[msg].apply(app, args)];
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// create a list of trusted url's
function getTrustedUrlList () {
  let urlList = [
    'http://localhost:9080/',
    'chrome-devtools://',
    'chrome-extension://',
    'file://',
    'https://api.coinmarketcap.com/',
    'https://api.coingecko.com/',
    'https://api.coinpaprika.com/',
    'https://api.blockcypher.com/',
    'https://bitcoinfees.earn.com/'
  ];
  let allCoins = coins.all;
  for (let i = 0; i < allCoins.length; i++) {
    urlList.push(allCoins[i].explorer);
  }
  return urlList;
}

app.on('ready', () => {
  createWindow();
  const trustedUrlList = getTrustedUrlList();
  // SECURITY: block unexpected requests
  session.defaultSession.webRequest.onBeforeRequest({urls:['*']}, (details, callback) => {
    let url = details.url;
    let output = {cancel: true}  // blocked by default
    for (var i = 0; i < trustedUrlList.length; i++) {
      let trustedUrl = trustedUrlList[i];
      if (url.startsWith(trustedUrl)){
        output = {cancel: false};  // allowed
      }
    }
    if (output.cancel === true) {
      console.log("PLEASE REPORT IMMEDIATELY - Blocked url:", url)
    }
    callback(output);
  })
});

// SECURITY: disable navigation and creation of new windows
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
  })
  contents.on('new-window', async (event, navigationUrl) => {
    event.preventDefault()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
