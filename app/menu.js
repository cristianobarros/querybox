'use strict';

function buildTemplate() {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'Ctrl+O',
          click: (item, win) => win.webContents.send('quantum:open'),
        },
        {
					label: 'Save',
          accelerator: 'Ctrl+S',
          click: (item, win) => win.webContents.send('quantum:save'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Execute',
          accelerator: 'Ctrl+Enter',
          click: (item, win) => win.webContents.send('quantum:execute'),
        },
				{
          label: 'Format',
          accelerator: 'Ctrl+Shift+F',
          click: (item, win) => win.webContents.send('quantum:format'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Connection',
          click: (item, win) => win.webContents.send('quantum:edit-connection'),
        },
        {
          label: 'Configuration',
          click: (item, win) => win.webContents.send('quantum:edit-configuration'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Exit',
          role: 'quit',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Ctrl+R',
          role: 'reload',
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Ctrl+Shift+I',
          role: 'toggledevtools',
        },
        {
          type: 'separator',
        },
        {
          label: 'Reset Zoom',
          accelerator: 'Ctrl+0',
          role: 'resetzoom',
        },
        {
          label: 'Zoom Out',
          accelerator: 'Ctrl+-',
          role: 'zoomout',
        },
        {
          label: 'Zoom In',
          accelerator: 'Ctrl+=',
          role: 'zoomin',
        }
      ],
    }
  ];
}

module.exports = buildTemplate;
