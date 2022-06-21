const fs = require('fs');
const path = require('node:path');

const staticMiddleware = (directoryPath) =>
  // path is the path of the public folder
  (req, res, next) => {
    let { url } = req;
    if (url.indexOf('.') === -1) { // add the html ending
      url += '.html';
    } else {
      req.url = req.url.split('.')[0];
    }
    if (fs.existsSync(path.join(directoryPath, url))) {
      // const file = fs.readFileSync(path.join(directoryPath, url));
      // res.end(file);
      const stream = fs.createReadStream(path.join(directoryPath, url));
      stream.pipe(res);
    }
    next();
  };

module.exports = staticMiddleware;
