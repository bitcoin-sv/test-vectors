const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

function jsonToCsv(sourceFile, targetFile, headers) {
    const jsonData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
    const csvWriter = createCsvWriter({
        path: targetFile,
        header: headers
    });

    csvWriter.writeRecords(jsonData)
        .then(() => console.log('The CSV file was written successfully'));
}

jsonToCsv(
    '../../../bitcoin-sv/src/test/data/script_tests.json',
    '../script_vectors.csv',
    // TODO: improve this, straight copy from the bitcoin-sv JSON file
    ['[[wit..., amount]?', 'scriptSig', 'scriptPubKey', 'flags', 'expected_scripterror', 'comments']
);
// TODO: import the others from sv-node