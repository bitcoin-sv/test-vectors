const fs = require('fs');
const {parse} = require('csv-parse');
const Handlebars = require('handlebars');

function csvToJs(sourceFile, targetFile) {
    const rows = [];

    fs.createReadStream(sourceFile)
        .pipe(parse({
            comment: '#',
            relax_column_count: true,
            skip_empty_lines: true,
            from_line: 2, // skipping the header
        }))
        .on('readable', function () {
            let record;
            while (record = this.read()) {
                rows.push(record);
            }
        })
        .on('end', () => {
            const templateString = fs.readFileSync('scripts/js-export-template.handlebars', 'utf-8');
            const template = Handlebars.compile(templateString);
            const jsData = template({
                rows: rows.map((row) => {
                    if (row[0].startsWith('#')) {
                        return row[0].replace('#', '//');
                    }
                    return JSON.stringify(row)
                })
            });
            fs.writeFileSync(targetFile, jsData);
        });
}

// Usage
csvToJs('./data/script_vectors.csv', './npm/script_vectors.js');