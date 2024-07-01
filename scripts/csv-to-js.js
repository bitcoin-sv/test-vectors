import fs from 'fs';
import { parse } from 'csv-parse';
import Handlebars from 'handlebars';

// Helper function to format an array as a string
Handlebars.registerHelper('formatRow', (row) => {
  if (typeof row[0] === 'string' && row[0].startsWith('#')) {
    return row[0].replace('#', '//');
  }

  return `[${row.map((item) => {
    if (Array.isArray(item)) {
      return Handlebars.helpers.formatArray(item);
    } if (typeof item === 'object') {
      return `{${Object.keys(item).map((key) => {
        let value = item[key];
        if (typeof value === 'string') {
          value = `'${value}'`;
        }
        return `'${key}': ${value}`;
      }).join(', ')}}`;
    } if (typeof item === 'string') {
      if (['false', 'true'].includes(item)) {
        return item;
      }
      return `'${item.replace(/'/g, "\\'")}'`;
    }
    return item;
  }).join(', ')}]`;
});

export const csvToJs = (sourceFile, targetFile) => {
  const rows = [];

  fs.createReadStream(sourceFile)
    .pipe(parse({
      comment: '#',
      relax_column_count: true,
      skip_empty_lines: true,
      from_line: 1,
    }))
    .on('readable', function () {
      let record;
      // eslint-disable-next-line no-cond-assign
      while (record = this.read()) {
        rows.push(record);
      }
    })
    .on('end', () => {
      const templateString = fs.readFileSync('scripts/js-export.handlebars', 'utf-8');
      const template = Handlebars.compile(templateString);
      // Extract headers from the first row
      const headers = rows.shift();
      fs.writeFileSync(targetFile, template({
        targetFile,
        headers,
        rows,
      }));
    });
};
