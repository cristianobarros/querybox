'use strict';

import fs from 'fs';
import electron from 'electron';
const dialog = electron.remote.dialog;
import NProgress from 'nprogress';

import Timer from './../util/timer';
import DatabaseFactory from './../db/database-factory';

function QueryActions() {

  NProgress.configure({ showSpinner : false });

  function openFile(app) {

    const files = dialog.showOpenDialog({
      filters: [
        { name: 'SQL', extensions: ['sql'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (files === undefined) {
      return;
    }

    fs.readFile(files[0], 'utf-8', function (error, data) {
      if (error) {
        app.setMessage(error.message);
      }
      app.setSql(data);
    });
  }

  function saveFile(app) {

    const file = dialog.showSaveDialog({
      filters: [
        { name: 'SQL', extensions: ['sql'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (file === undefined) {
      return;
    }

    fs.writeFile(file, app.getSql(), function (error) {
      if (error) {
        app.setMessage(error.message);
      }
    });
  }

  async function executeSQL(app) {

    if (!DatabaseFactory.hasConfig()) {
      app.setMessage('No connection configured.');
      return;
    }

    NProgress.start();
    const timer = new Timer();

    timer.start();

     try {

      const result = await DatabaseFactory.create().execute(app.getSQL());

      timer.stop();

      app.setMessage(`${result.rows.length} rows in ${timer.getTime()} ms`);
      app.setResult(result);

    } catch (error) {
      app.setError(error);
     } finally {
      NProgress.done();
     }
   }

   return {
     openFile : openFile,
     saveFile : saveFile,
     executeSQL : executeSQL
   }
}

module.exports = new QueryActions();
