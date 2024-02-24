const moment = require("moment");
// (5) create a middleware function
// takes 3 parameters - req, res, next -> to call next middleware functions
const logger = (req, res, next) => {
    // req.originalURL is the thing after localhost:port
    // (6) Third-party package: moment
    // to deal with date formatting 
    // moment().format() - to get the current date format
    // you can use FS module to save into a file
    console.log(`${req.protocol}://${req.get('host')}${
        req.originalUrl
    }: ${moment().format()}`); 
    next();
}

module.exports = logger;