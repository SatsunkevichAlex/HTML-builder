const fs = require('fs');
const path = require('path');

const destPath = path.join(__dirname, 'files-copy');
const inputPath = path.join(__dirname, 'files');

function copyDir() {
    // create folder
    fs.mkdir(
        destPath,
        { recursive: true },
        (err, createdDirPath) => {
            // if folder just created
            if (createdDirPath) {
                fs.readdir(
                    inputPath,
                    { withFileTypes: true },
                    (err, files) => {
                        files.forEach(file => {
                            copyFile(file.name);
                        });
                    });                
            }
            // if folder already exists
            else {
                fs.readdir(inputPath, (err, inputFiles) => {
                    fs.readdir(destPath, (err, destFiles) => {
                        // if new files added, copy them
                        let newFiles = inputFiles.filter(it => !destFiles.includes(it));
                        if (newFiles) {
                            newFiles.forEach(newFile => {
                                copyFile(newFile);
                            });
                        }
                        // if some files delete, remove them
                        let deletedFiles = destFiles.filter(it => !inputFiles.includes(it));
                        if (deletedFiles) {
                            deletedFiles.forEach(deletedFile => {
                                unlinkFile(deletedFile);
                            });
                        }
                    });
                });
            }
        }
    );
    console.log('files copied!');
}

function copyFile(fileName) {
    let fileStartPath = path.join(inputPath, fileName);
    let fileEndPath = path.join(destPath, fileName);
    fs.copyFile(fileStartPath, fileEndPath, () => {
        console.log(`added new file to copy folder: '${fileName}'`);
    });
}

function unlinkFile(fileName) {
    let fileToDelete = path.join(destPath, fileName);
    fs.unlink(fileToDelete, () => {
        console.log(`deleted old file from copy folder: '${fileName}'`);
    });
}

copyDir();
