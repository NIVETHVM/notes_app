//file write
const fs = require('fs');

function logger(req,res,next) {
    const log = `${req.method} ${req.url} - ${new Date().toISOString()}\n`;
    console.log(log);
    fs.appendFileSync('logs.txt',log);
    next();
}

module.exports = logger;