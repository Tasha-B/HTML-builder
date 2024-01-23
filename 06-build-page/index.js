const fs = require('fs');
const {
  mkdir,
  stat,
  rm,
  copyFile,
  readFile,
  writeFile,
  readdir,
} = require('fs/promises');
const path = require('path');
const distFolder = path.join(__dirname, 'project-dist');
// const template = path.join(__dirname, 'template.html');
// const components = path.join(__dirname, 'components');
// const htmlFile = path.join(__dirname, 'project-dist', 'index.html');

async function createDist() {
  await mkdir(distFolder, { recursive: true }, (error) => {
    if (error) throw error;
  });
}
createDist();

async function copyHTML() {
  let content = await readFile(template, 'utf-8');
  const comps = await readdir(
    components,
    { withFileTypes: true },
    (error, data) => {
      if (error) throw error;
    },
		data.forEach((file) => {
      await stat(
        path.join(components, file.name),
        function (error, stat) {
          if (error) throw error;

          if (stat.isFile() && path.extname(file.name) === '.html') {
            const readableStream = fs.createReadStream(
              path.join(components, file.name),
              'utf-8',
            );
            readableStream.pipe(writableStream);
          }
        },
      );
    });
  );

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

// const styles = path.join(__dirname, 'styles');
// const style = path.join(__dirname, 'project-dist', 'style.css');
// const writableStream = fs.createWriteStream(path.join(style));

// fs.readdir(styles, { withFileTypes: true }, (error, data) => {
//   if (error) throw error;
//   data.forEach((file) => {
//     fs.stat(path.join(styles, file.name), function (error, stat) {
//       if (error) throw error;

//       if (file.isFile() && path.extname(file.name) === '.css') {
//         const readableStream = fs.createReadStream(
//           path.join(styles, file.name),
//           'utf-8',
//         );
//         readableStream.pipe(writableStream);
//       }
//     });
//   });
// });

const assets = path.join(__dirname, 'assets');
const newAssets = path.join(__dirname, 'project-dist', 'assets');

async function copyAssets() {
  try {
    await rm(newAssets, { recursive: true, force: true });
    await mkdir(newAssets, { recursive: true });
  } catch (error) {
    if (error) {
      await mkdir(newAssets, { recursive: true });
    }
  }

  const files = await readdir(newAssets, { withFileTypes: true });

  for (let file of files) {
    if (file.isFile()) {
      await copyFile(
        path.join(assets, file.name),
        path.join(newAssets, file.name),
      );
    }
    if (file.isDirectory) {
      await copyFile(
        path.join(assets, file.name),
        path.join(newAssets, file.name),
      );
    }
  }
}
copyAssets();
