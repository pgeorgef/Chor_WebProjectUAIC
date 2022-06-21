const fs = require('fs');
const crypto = require('crypto');
const formidable = require('formidable');
const User = require('../models/user');

const betterResponse = (res) => {
  res.send = (message) => res.end(message);
  res.json = (message) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(message));
  };
  res.redirect = (path) => {
    console.log('in redirect');
    // the path can be: https://google.com if it's external
    // the path can be: /path/with/site if it's internal
    res.writeHead(302, { Location: path });
    res.end();
  };
  return res;
};

const readBody = (req) => new Promise((resolve, reject) => {
  if (req.headers.hasOwnProperty('content-type')) {
    if (req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
      let body = {};
      if (!fs.existsSync(`${__dirname}/../public/images`)) { // check if the folder exists
        // create it
        fs.mkdirSync(`${__dirname}/../public/images`);
      }
      const form = new formidable.IncomingForm({ uploadDir: `${__dirname}/../public/images` }); // hacky-ish way
      form.parse(req, (err, fields, files) => {
        body = { ...body, fields };
        body = { ...body, files };
        resolve(body);
      });
    } else if (req.headers['content-type'] === 'application/octet-stream') {
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      });
      req.on('end', () => {
        body = Buffer.concat(body);
        resolve(body);
      });
      req.on('error', (err) => {
        reject(err);
      });
    } else if (req.headers['content-type'] === 'application/json') {
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
    }
  } else {
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
  }
});
const processMiddleware = (middleware, req, res) => new Promise(async (resolve, reject) => {
  await middleware(req, res, (...args) => {
    if (args.length > 0) {
      reject(args);
    } else if (args.length === 0) {
      resolve();
    }
  });
  // daca am ajuns aici e clar ca nu e bine
  reject(new Error('No next in middleware'));
});

const saveUser = async (body) => {
  const user = new User(JSON.parse(body));
  user.pass = crypto.createHash('sha256').update(user.pass).digest('hex');
  console.log(user);
  await user.save();
};

module.exports = {
  betterResponse,
  processMiddleware,
  readBody,
  saveUser,

};
