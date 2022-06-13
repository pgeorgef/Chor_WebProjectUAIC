const fs = require('fs');

const betterResponse = (res) => {
  res.send = (message) => res.end(message);
  res.json = (message) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(message));
  };
  return res;
};

const readBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', (chunk) => {
    body += `${chunk}`;
  });
  req.on('end', () => {
    resolve(body);
  });
  req.on('error', (err) => {
    reject(err);
  });
});
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

const sendFileRes = (response, filepath, type) => {
  fs.readFile(filepath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./404.html', (error, content) => {
          response.writeHead(404, { 'Content-Type': type });
          response.end(content, 'utf-8');
        });
      } else {
        response.writeHead(500);
        response.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
      }
    } else {
      response.writeHead(200, { 'Content-Type': type });
      response.end(content, 'utf-8');
    }
  });
};

const cors = (req, res, next) => {
  let oneof = false;
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if (req.headers['access-control-request-method']) {
    res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if (req.headers['access-control-request-headers']) {
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }
  if (oneof) {
    res.setHeader('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }

  // intercept OPTIONS method
  if (oneof && req.method === 'OPTIONS') {
    res.send(String(200));
  } else {
    next();
  }
};

module.exports = {
  betterResponse,
  processMiddleware,
  sendFileRes,
  readBody,
  cors,
};
