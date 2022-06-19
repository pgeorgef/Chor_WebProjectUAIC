const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
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
    /*
    res.setHeader('Location', path);
    res.statusCode = 301;
    res.end(); */
    res.writeHead(302, { Location: path });
    res.end();
  };
  return res;
};

const readBody = (req) => new Promise((resolve, reject) => {
  if (req.headers.hasOwnProperty('content-type')) {
    if (req.headers['content-type'].indexOf('multipart/form-data') !== -1) {
      let body = {};
      if (!fs.existsSync(`${__dirname}/images`)) { // check if the folder exists
        // create it
        fs.mkdirSync(`${__dirname}/images`);
      }
      const form = new formidable.IncomingForm({ uploadDir: `${__dirname}/images` }); // hacky-ish way
      form.parse(req, (err, fields, files) => {
        body = { ...body, fields };
        body = { ...body, files };
        resolve(body);
      });
    } else if (req.headers['content-type'] === 'application/octet-stream') {
      console.log('in if');
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
      console.log('in application json');
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
    console.log('in else');
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
    console.log('in next');
    if (args.length > 0) {
      reject(args);
    } else if (args.length === 0) {
      resolve();
    }
  });
  // daca am ajuns aici e clar ca nu e bine
  console.log('dupa functia de middleware');
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
    res.setHeader('credentials', true);
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

const validateUsername = async (username, UserModel) => {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    console.log('invalid username');
    return true;
  }

  try {
    const result = await UserModel.findOne({ userName: username });
    if (result !== null) {
      console.log('username taken');
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return true;
  }
};

const validateMail = async (mail, UserModel) => {
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regexEmail.test(mail)) {
    console.log('invalid mail');
    return true;
  }

  try {
    const result = await UserModel.findOne({ email: mail });
    if (result !== null) {
      console.log('mail taken');
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return true;
  }
};

const validateLogin = async (userName, pass, UserModel) => {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(userName)) {
    console.log('invalid username');
    return null;
  }
  const encryptedPass = crypto.createHash('sha256').update(pass).digest('hex');
  try {
    const result = await UserModel.findOne({ userName, encryptedPass });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const saveUser = async (body) => {
  const user = new User(JSON.parse(body));
  user.pass = crypto.createHash('sha256').update(user.pass).digest('hex');
  console.log(user);
  await user.save();
};

const verifyToken = async (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, name) => {
    if (err) reject(err);
    resolve(name.userName);
  });
});

const getToken = (cookies) => {
  const list = {};
  const cookieHeader = cookies;
  if (!cookieHeader) return list;
  for (const cookie of cookieHeader.split(';')) {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) continue;
    const value = rest.join('=').trim();
    if (!value) continue;
    list[name] = decodeURIComponent(value);
  }

  return (list.token);
};

const authMiddleware = () => (req, res, next) => {

};

module.exports = {
  betterResponse,
  processMiddleware,
  sendFileRes,
  readBody,
  cors,
  validateMail,
  validateUsername,
  saveUser,
  validateLogin,
  verifyToken,
  getToken,
};
