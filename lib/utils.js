const fs = require('fs');

const betterResponse = (res) => {
  res.send = (message) => res.end(message);
  res.json = (message) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(message));
  };
  return res;
};

const processMiddleware = (middleware, req, res) => new Promise((resolve, reject) => {
  middleware(req, res, (...args) => {
    if (args.length > 0) {
      reject(args);
    } else if (args.length === 0) {
      resolve();
    }
  });
  // daca am ajuns aici e clar ca nu e bine
  reject(new Error('No next in middleware'));
});

const sendFileRes = (response, filepath, type)  => {

  fs.readFile(filepath, function(error, content) {
    if (error) {
        if(error.code == 'ENOENT') {
            fs.readFile('./404.html', function(error, content) {
                response.writeHead(404, { 'Content-Type': type });
                response.end(content, 'utf-8');
            });
        }
        else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
        }
    }
    else {
        response.writeHead(200, { 'Content-Type': type });
        response.end(content, 'utf-8');
    }
});
}

module.exports = {
  betterResponse,
  processMiddleware,
  sendFileRes
};
