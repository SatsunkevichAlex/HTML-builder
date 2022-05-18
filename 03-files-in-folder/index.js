const fs = require('fs');
const path = require('path');


const folder = path.join(__dirname, 'secret-folder');
fs.readdir(
    folder,
    { withFileTypes: true },
    (err, files) => {
        if (err) {
            console.log(err);
        }
        handleFiles(files);
    });

function handleFiles(files) {
    files.forEach(file => {
        let filePath = path.join(folder, file.name);
        fs.stat(filePath, (err, stat) => {
            if (err) {
                console.log(err);
            }
            if (file.isFile()){
                displayFileInfo(file, stat);
            }
        });
    });
}

function displayFileInfo(file, fileStat) {
    let name = file.name.split('.')[0];
    let ext = file.name.split('.')[1];
    let size = fileStat.size / 1000;
    let result = `${name} - ${ext} - ${size}kb`;
    console.log(result);
}