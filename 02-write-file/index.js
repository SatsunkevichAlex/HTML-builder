const fs = require('fs');
const { stdin, stdout } = require('process');
const path = require('path');
const os = require('os');

const file = path.join(__dirname, 'output.txt');

const write = fs.createWriteStream(file);
stdout.write('Hi, user!\nText some input in file:\n');
stdin.on('data', data => {
    let strData = data.toString().trim();
    if (strData === 'exit') {
        exitHandler();
    }
    write.write(strData + os.EOL);
    stdout.write('Input added. Add more data, or print "exit"\n');
});

process.on('SIGINT', exitHandler);

function exitHandler() {
    stdout.write('Thanks, good luck!');
    process.exit();
}