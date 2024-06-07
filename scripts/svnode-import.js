const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

function jsonToCsv(sourceFile, targetFile, headers) {
    const csvWriter = createCsvWriter({
        path: targetFile,
        header: headers
    });
    let jsonData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
    // Modify rows with only one cell, these are comments and will be marked
    // when parsing this data, make sure to use a library that support comments
    // e.g. https://csv.js.org/parse/options/comment/
    jsonData = jsonData.map(row => {
        if (row.length === 1) {
            row[0] = `# ${row[0]}`;
        }
        return row;
    });

    csvWriter.writeRecords(jsonData)
        .then(() => console.log('The CSV file was written successfully'));
}

jsonToCsv(
    '../bitcoin-sv/src/test/data/script_tests.json',
    './data/script_vectors.csv',
    // TODO: improve this, straight copy from the bitcoin-sv JSON file
    ['[[wit..., amount]?', 'scriptSig', 'flags', 'expected_scripterror', 'comments']
);
// TODO: import the others from sv-node