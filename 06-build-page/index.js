const fs = require('fs');
const path = require('path');
const template = path.join(__dirname, 'template.html');
const htmlFile = path.join(__dirname, 'project-dist', 'index.html');
const components = path.join(__dirname, 'components');

fs.mkdir(
  path.join('06-build-page', 'project-dist'),
  { recursive: true },
  (error) => {
    if (error) throw error;
  },
);

async function copyHTML() {
  let content = await fs.readFile(template, 'utf-8');
  const comps = await fs.readdir(components, { withFileTypes: true });
  for (let i of comps) {
    if (comps[i].isFile() && path.extname(comps[i].name) === '.html') {
      const file = path.join(components, comps[i].name);
      const fileContent = await fs.readfile(file, 'utf-8');
      content = content.replace(
        `{{${path.basename(comps[i].name, '.html')}}}`,
        fileContent,
      );
    }
  }
  fs.writeFile(htmlFile, template, (error) => {
    if (error) throw error;
  });
}

copyHTML();

const styles = path.join(__dirname, 'styles');
const style = path.join(__dirname, 'project-dist', 'style.css');
const writableStream = fs.createWriteStream(path.join(style));

fs.readdir(styles, { withFileTypes: true }, (error, data) => {
  if (error) throw error;

  data.forEach((file) => {
    fs.stat(path.join(styles, file.name), function (error) {
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

const assets = path.join(__dirname, 'assets');
const newAssets = path.join(__dirname, 'project-dist', 'assets');

async function copyAssets() {
  fs.mkdir(newAssets, { recursive: true }, (error) => {
    if (error) throw error;
  });

  await fs.readdir(newAssets, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    for (let file of data) {
      fs.unlink(path.join(newAssets, file.name), (error) => {
        if (error) throw error;
      });
    }
  });

  fs.readdir(assets, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    for (let file of data) {
      fs.copyFile(
        path.join(assets, file.name),
        path.join(newAssets, file.name),
      );
    }
  });
}
copyAssets();
