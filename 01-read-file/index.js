const fs = require('fs');
const path = require('path');
path.join(__dirname, '01-read-file');

const readableStream = new fs.createReadStream(
  '01-read-file/text.txt',
  'utf-8',
);
readableStream.on('data', (chunk) => console.log(chunk));
