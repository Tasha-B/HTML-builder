const fs = require('fs');
const {
  mkdir,
  stat,
  unlink,
  copyFile,
  readFile,
  writeFile,
  readdir,
} = require('fs/promises');
const path = require('path');
const template = path.join(__dirname, 'template.html');
const htmlFile = path.join(__dirname, 'project-dist', 'index.html');
const components = path.join(__dirname, 'components');

async function createDist() {
  await mkdir(
    path.join('06-build-page', 'project-dist'),
    { recursive: true },
    (error) => {
      if (error) throw error;
    },
  );
}

createDist();

async function copyHTML() {
  let content = await readFile(template, 'utf-8');
  const comps = await readdir(components, { withFileTypes: true });
  for (let comp of comps) {
    if (comp.isFile() && path.extname(comp.name) === '.html') {
      const file = path.join(components, comp.name);
      const fileContent = await readFile(file, 'utf-8');
      content = content.replace(
        `{{${path.basename(comp.name, '.html')}}}`,
        fileContent,
      );
    }
  }
  writeFile(htmlFile, template, (error) => {
    if (error) throw error;
  });
}

copyHTML();
const styles = path.join(__dirname, 'styles');
const style = path.join(__dirname, 'project-dist', 'style.css');
async function distStyles() {
  const writableStream = fs.createWriteStream(path.join(style));

  await readdir(styles, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    data.forEach((file) => {
      stat(path.join(styles, file.name), (error, stats) => {
        if (error) throw error;

        if (stats.isFile() && path.extname(file.name) === '.css') {
          const readableStream = fs.createReadStream(
            path.join(styles, file.name),
            'utf-8',
          );
          readableStream.pipe(writableStream);
        }
      });
    });
  });
}
distStyles();
const assets = path.join(__dirname, 'assets');
const newAssets = path.join(__dirname, 'project-dist', 'assets');

async function copyAssets() {
  mkdir(newAssets, { recursive: true }, (error) => {
    if (error) throw error;
  });

  await readdir(newAssets, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    for (let file of data) {
      unlink(path.join(newAssets, file.name), (error) => {
        if (error) throw error;
      });
    }
  });

  await readdir(assets, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    for (let file of data) {
      copyFile(path.join(assets, file.name), path.join(newAssets, file.name));
    }
  });
}
copyAssets();
