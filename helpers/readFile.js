const fs = require('fs');

const getDataFromTxtFile = (path) => {
    return fs.readFileSync(path, 'utf8');
}

module.exports = {
    getDataFromTxtFile
}