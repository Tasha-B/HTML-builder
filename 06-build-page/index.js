const fs = require('fs');
const {
  mkdir,
  rm,
  copyFile,
  readFile,
  writeFile,
  readdir,
} = require('fs/promises');
const path = require('path');
const distFolder = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const assetsDist = path.join(__dirname, 'project-dist', 'assets');
const htmlFile = path.join(__dirname, 'project-dist', 'index.html');

async function createDist() {
  await mkdir(distFolder, { recursive: true }, (error) => {
    if (error) throw error;
  });
}

async function buildHTML() {
  try {
    let template = await readFile(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
    const components = await readdir(path.join(__dirname, 'components'));
    for (let i = 0; i < components.length; i++) {
      let content = await readFile(
        path.join(__dirname, 'components', components[i]),
        'utf-8',
      );
      let component = `{{${components[i].split('.')[0]}}}`;
      template = template.replace(`${component}`, `${content}`);
      await writeFile(path.join(htmlFile), template);
    }
  } catch (error) {
    console.log(error);
  }
}

const styles = path.join(__dirname, 'styles');
const style = path.join(__dirname, 'project-dist', 'style.css');
const writableStream = fs.createWriteStream(path.join(style));

fs.readdir(styles, { withFileTypes: true }, (error, data) => {
  if (error) throw error;
  data.forEach((file) => {
    fs.stat(path.join(styles, file.name), function (error, stat) {
      if (error) throw error;

      if (file.isFile() && path.extname(file.name) === '.css') {
        const readableStream = fs.createReadStream(
          path.join(styles, file.name),
          'utf-8',
        );
        readableStream.pipe(writableStream);
      }
    });
  });
});

async function copyAssets(orig, copy) {
  await rm(copy, { recursive: true, force: true });
  await mkdir(copy, { recursive: true });
  const files = await readdir(orig, { withFileTypes: true }, (error) => {
    if (error) throw error;
  });

  for (const file of files) {
    if (file.isDirectory()) {
      await copyAssets(path.join(orig, file.name), path.join(copy, file.name));
    } else {
      await copyFile(path.join(orig, file.name), path.join(copy, file.name));
    }
  }
}

buildHTML();
createDist();
copyAssets(assets, assetsDist);
