'use strict';

function buildTemplate() {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'New tab',
          accelerator: 'Ctrl+T',
          click: (item, win) => win.webContents.send('quantum:newTab'),
        },
        {
          label: 'Close tab',
          accelerator: 'Ctrl+W',
          click: (item, win) => win.webContents.send('quantum:closeTab'),
        },
        {
          label: 'Previous tab',
          accelerator: 'Ctrl+PageUp',
          click: (item, win) => win.webContents.send('quantum:previousTab'),
        },
        {
          label: 'Next tab',
          accelerator: 'Ctrl+PageDown',
          click: (item, win) => win.webContents.send('quantum:nextTab'),
        },
        {
          type: 'separator',
        },
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
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Ctrl+Z',
          click: (item, win) => win.webContents.send('quantum:undo'),
        },
        {
          label: 'Redo',
          accelerator: 'Ctrl+Y',
          click: (item, win) => win.webContents.send('quantum:redo'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'Ctrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'Ctrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'Ctrl+V',
          role: 'paste',
        },
        {
          type: 'separator',
        },
        {
          label: 'Find',
          accelerator: 'Ctrl+F',
          click: (item, win) => win.webContents.send('quantum:find'),
        },
        {
          label: 'Replace',
          accelerator: 'Ctrl+H',
          click: (item, win) => win.webContents.send('quantum:replace'),
        }
      ]
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
