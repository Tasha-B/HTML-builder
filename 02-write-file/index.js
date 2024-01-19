const fs = require('fs');
const path = require('path');

const { stdin, stdout, exit } = process;
let writableStream = fs.createWriteStream(path.join(__dirname, 'file.txt'));

stdout.write('Hello! Please, enter your message:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('OK! Welcome!');
    exit();
  } else {
    writableStream.write(data);
  }
});

process.on('SIGINT', () => {
  stdout.write('OK! Welcome!');
  exit();
});
