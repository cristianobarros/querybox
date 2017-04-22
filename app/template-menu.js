
TemplateMenu = function() {};

TemplateMenu.prototype.buildTemplate = function() {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'New tab',
          accelerator: 'Ctrl+T',
          click: (item, win) => win.webContents.send('querybox:newTab'),
        },
        {
          label: 'Close tab',
          accelerator: 'Ctrl+W',
          click: (item, win) => win.webContents.send('querybox:closeTab'),
        },
        {
          label: 'Restore tab',
          accelerator: 'Ctrl+Shift+T',
          click: (item, win) => win.webContents.send('querybox:restoreTab'),
        },
        {
          label: 'Previous tab',
          accelerator: 'Ctrl+PageUp',
          click: (item, win) => win.webContents.send('querybox:previousTab'),
        },
        {
          label: 'Next tab',
          accelerator: 'Ctrl+PageDown',
          click: (item, win) => win.webContents.send('querybox:nextTab'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Open',
          accelerator: 'Ctrl+O',
          click: (item, win) => win.webContents.send('querybox:open'),
        },
        {
          label: 'Save',
          accelerator: 'Ctrl+S',
          click: (item, win) => win.webContents.send('querybox:save'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Execute',
          accelerator: 'Ctrl+Enter',
          click: (item, win) => win.webContents.send('querybox:execute'),
        },
        {
          label: 'Format',
          accelerator: 'Ctrl+Shift+F',
          click: (item, win) => win.webContents.send('querybox:format'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Connection',
          click: (item, win) => win.webContents.send('querybox:edit-connection'),
        },
        {
          label: 'Configuration',
          click: (item, win) => win.webContents.send('querybox:edit-configuration'),
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
          click: (item, win) => win.webContents.send('querybox:undo'),
        },
        {
          label: 'Redo',
          accelerator: 'Ctrl+Y',
          click: (item, win) => win.webContents.send('querybox:redo'),
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
          click: (item, win) => win.webContents.send('querybox:find'),
        },
        {
          label: 'Replace',
          accelerator: 'Ctrl+H',
          click: (item, win) => win.webContents.send('querybox:replace'),
        }
      ]
    },
    {
      label: 'View',
      submenu: [
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

module.exports = TemplateMenu;
