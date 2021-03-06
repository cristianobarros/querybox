const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

const path = require('path')
const url = require('url')

import AppPath from './util/app-path';
import Configuration from './util/configuration';
import TemplateMenu from './template-menu-factory';

AppPath.createAppPathIfDoNotExists();
Configuration.createDefaultIfDoNotExists();

global.configuration = Configuration.load();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let quit

function loadMenu() {
	const template = TemplateMenu.buildTemplate(global.configuration.keybindings);
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}

function createWindow () {

	ipcMain.on('querybox:reloadMenu', () => {
		loadMenu();
	});

	ipcMain.on('querybox:close', () => {
		Configuration.save(global.configuration);
		quit = true;
		app.quit();
	});

  var workArea = electron.screen.getPrimaryDisplay().workArea;

  // Create the browser window.
  mainWindow = new BrowserWindow(
		{
			width : workArea.width,
			height : workArea.height,
			title : 'QueryBox',
			icon : './build/icon.ico',
			show : false,
			webPreferences : {
				devTools : true
			}
		}
	);

	loadMenu();

  // and load the index.html of the app.
	if (process.env.NODE_ENV === 'development') {
		mainWindow.loadURL("http://localhost:8080/app/index.html");
	} else {
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		}));
	}

  mainWindow.on('close', function (event) {
	  if (!quit) {
		  event.preventDefault();
		  mainWindow.webContents.send('close');
	  }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.maximize();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
