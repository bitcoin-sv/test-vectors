import fs from 'fs';
import { createArrayCsvWriter } from 'csv-writer';

export const jsonToCsv = (
  sourceFile,
  targetFile,
  headers,
  singleCellComments = true,
  rowProcessor = false,
) => {
  const csvWriter = createArrayCsvWriter({
    path: targetFile,
    header: headers,
  });
  let jsonData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
  // Modify rows with only one cell, these are comments and will be marked
  // when parsing this data, make sure to use a library that support comments
  // e.g. https://csv.js.org/parse/options/comment/
  jsonData = jsonData.map((row) => {
    if (rowProcessor) {
      return rowProcessor(row);
    }
    if (singleCellComments && row.length === 1) {
      return [`# ${row[0]}`];
    }
    return row;
  });

  csvWriter.writeRecords(jsonData)
    .then(() => console.log(`The CSV file ${targetFile} was written successfully`));
};
