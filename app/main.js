const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

const path = require('path')
const url = require('url')

const buildTemplate = require('./menu');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let quit

function createWindow () {

	require('electron').ipcMain.on('close-ok', function(event, message) {
		quit = true;
		app.quit();
	});

  var workArea = electron.screen.getPrimaryDisplay().workArea;

  // Create the browser window.
  mainWindow = new BrowserWindow(
		{
			width : workArea.width,
			height : workArea.height,
			title : 'Quantum SQL',
			icon : './build/icon.ico',
			show : false,
			webPreferences : {
				devTools : true
			}
		}
	);

	const template = buildTemplate();
	const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

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
