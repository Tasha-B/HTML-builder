const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (error, data) => {
    if (error) {
      return console.log(error);
    } else {
      data.forEach((file) => {
        if (file.isFile()) {
          fs.stat(
            path.join(__dirname, 'secret-folder', file.name),
            (error, stats) => {
              if (error) {
                return console.log(error);
              }
              console.log(
                `${path.parse(file.name).name} - ${path
                  .parse(file.name)
                  .ext.substring(1)} - ${stats.size} bytes`,
              );
            },
          );
        }
      });
    }
  },
);
