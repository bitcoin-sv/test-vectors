import fs from 'fs';
import path from 'path';
import { csvToJs } from './csv-to-js.js';

// read in all CSV files from the data directory and convert them to JS
const dataPath = './data';
const outputPath = './npm';
fs.readdir(dataPath, (err, files) => {
  if (err) {
    throw new Error('Unable to scan directory', err);
  }

  files.forEach((file) => {
    const filePath = path.join(dataPath, file);
    if (path.extname(filePath) === '.csv') {
      const jsFilePath = path.join(outputPath, file.replace('.csv', '.js'));
      csvToJs(filePath, jsFilePath);
    }
  });
});
