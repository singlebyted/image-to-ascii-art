const chokidar = require('chokidar');
const path = require('path');
const { exec } = require('child_process');

const watcher = chokidar.watch(path.resolve(__dirname, '../src', '*'));

const LOG_TAG = 'build dev: ';

watcher.on('change', p => {
  exec('npm run babel', (err, stdout, stderr) => {
    console.time(LOG_TAG, p);
    if (err) {
      console.error(err);
      return;
    }
    console.timeEnd(LOG_TAG, stdout);
  });
});