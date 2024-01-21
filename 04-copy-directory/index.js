const fs = require('fs');
const path = require('path');
const { copyFile } = require('fs/promises');
const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

async function copying() {
  fs.mkdir(folderCopy, { recursive: true }, (error) => {
    if (error) throw error;
  });

  await fs.readdir(folderCopy, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    for (let file of data) {
      fs.unlink(path.join(folderCopy, file.name), (error) => {
        if (error) throw error;
      });
    }
  });

  fs.readdir(folder, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    for (let file of data) {
      copyFile(path.join(folder, file.name), path.join(folderCopy, file.name));
    }
  });
}
copying();
