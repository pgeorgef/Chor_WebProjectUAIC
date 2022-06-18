const fs = require('fs');
const crypto = require('crypto');
const User = require('../models/user');

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

const validateLogin = async(userName, pass, UserModel) =>{

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(userName)) {
    console.log('invalid username');
    return null;
  }

  pass = crypto.createHash('sha256').update(pass).digest('hex');
  try{
    const result = await UserModel.findOne({ userName: userName, pass: pass });
    return result;
  } catch(error){
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
};
