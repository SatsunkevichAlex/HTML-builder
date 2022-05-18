const path = require('path');
const fs = require('fs');

const resultAssetsFolder = path.join(__dirname, 'project-dist');
const htmlTemplatePath = path.join(__dirname, 'template.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');
const componentsFolder = path.join(__dirname, 'components');

const resultHtmlPath = path.join(resultAssetsFolder, 'index.html');
const stylesBundle = path.join(resultAssetsFolder, 'style.css');

async function createDistFolderAsync() {
    fs.mkdir(resultAssetsFolder, () => { });

    return new Promise(resolve => {
        resolve();
    });
}

async function readFileAsync(path) {
    return new Promise(resolve => {
        fs.readFile(
            path,
            'utf-8',
            (err, data) => {
                resolve(data);
            }
        );
    });
}

async function writeFileAsync(path, data) {
    return new Promise(resolve => {
        fs.writeFile(
            path,
            data,
            () => {
                resolve();
            }
        );
    });
}

async function buildHtmlAsync() {
    let files = await readFolderAsync(componentsFolder);
    let html = await readFileAsync(htmlTemplatePath);
    files = files.filter(it => it.name.includes('.html'));
    files.forEach(async file => {
        let templatePath = path.join(componentsFolder, file.name);
        let template = await readFileAsync(templatePath);
        let alias = `{{${file.name.slice(0, file.name.indexOf('.'))}}}`;
        html = html.replace(alias, template);
        await writeFileAsync(resultHtmlPath, html);
    });
}

async function mergeStylesAsync() {
    const writeStream = fs.createWriteStream(stylesBundle);
    fs.readdir(
        stylesFolderPath,
        { withFileTypes: true },
        (err, files) => {
            let cssFiles = files.filter(it => it.name.includes('.css'));
            let cssPathes = cssFiles.map(file => path.join(stylesFolderPath, file.name));
            cssPathes.forEach(cssFile => {
                let readStream = fs.createReadStream(cssFile);
                readStream.on('data', (data) => {
                    writeStream.write(data);
                });
            });
        });
}

async function readFolderAsync(path) {
    return new Promise(resolve => {
        fs.readdir(
            path,
            { withFileTypes: true },
            (err, data) => resolve(data));
    });
}

async function copyAssetsAsync() {
    let folders = await readFolderAsync(assetsFolderPath);
    folders.forEach(folder => {
        let inputFolderPath = path.join(assetsFolderPath, folder.name);
        let outputFolderPath = path.join(resultAssetsFolder, 'assets', folder.name);
        copyDir(inputFolderPath, outputFolderPath);
    });
}

function copyDir(inputFolder, outputFolder) {
    // create folder
    fs.mkdir(
        outputFolder,
        { recursive: true },
        (err, createdDirPath) => {
            // if folder just created
            if (createdDirPath) {
                fs.readdir(
                    inputFolder,
                    { withFileTypes: true },
                    (err, files) => {
                        files.forEach(file => {
                            copyFile(file.name, inputFolder, outputFolder);
                        });
                    });
            }
            // if folder already exists
            else {
                fs.readdir(inputFolder, (err, inputFiles) => {
                    fs.readdir(outputFolder, (err, destFiles) => {
                        // if new files added, copy them
                        let newFiles = inputFiles.filter(it => !destFiles.includes(it));
                        if (newFiles) {
                            newFiles.forEach(newFile => {
                                copyFile(newFile, inputFolder, outputFolder);
                            });
                        }
                        // if some files delete, remove them
                        let deletedFiles = destFiles.filter(it => !inputFiles.includes(it));
                        if (deletedFiles) {
                            deletedFiles.forEach(deletedFile => {
                                unlinkFile(deletedFile, outputFolder);
                            });
                        }
                    });
                });
            }
        }
    );
}

function copyFile(fileName, inputFolder, outputFolder) {
    let fileStartPath = path.join(inputFolder, fileName);
    let fileEndPath = path.join(outputFolder, fileName);
    fs.copyFile(fileStartPath, fileEndPath, () => { });
}

function unlinkFile(fileName, outputFolder) {
    let fileToDelete = path.join(outputFolder, fileName);
    fs.unlink(fileToDelete, () => { });
}

(async () => {
    await createDistFolderAsync();
    await buildHtmlAsync();
    await mergeStylesAsync();
    await copyAssetsAsync();
})();
