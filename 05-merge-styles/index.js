const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(distPath, 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');

const writeStream = fs.createWriteStream(bundlePath);

fs.readdir(
    stylesPath, 
    {withFileTypes: true},
    (err, files) => {
        let cssFiles = files.filter(it => it.name.includes('.css'));
        let cssPathes = cssFiles.map(file => path.join(stylesPath, file.name));
        cssPathes.forEach(cssFile => {
            let readStream = fs.createReadStream(cssFile);
            readStream.on('data', (data) => {
                writeStream.write(data);
            });
        });
    });