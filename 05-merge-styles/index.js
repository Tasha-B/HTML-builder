const fs = require('fs');
const path = require('path');
const writableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (error, data) => {
    if (error) throw error;

    data.forEach((file) => {
      fs.stat(
        path.join(__dirname, 'styles', file.name),
        function (error, stat) {
          if (error) throw error;

          if (stat.isFile() && path.extname(file.name) === '.css') {
            const readableStream = fs.createReadStream(
              path.join(__dirname, 'styles', file.name),
              'utf-8',
            );
            readableStream.pipe(writableStream);
          }
        },
      );
    });
  },
);
