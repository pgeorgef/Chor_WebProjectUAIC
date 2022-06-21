const jwt = require('jsonwebtoken');
const {
  validateMail, validateUsername, validateLogin, validateFirstName, validateLastName, validatePassword,
} = require('../lib/validate');
const { saveUser } = require('../lib/utils');

const User = require('../models/user');

const login = async (req, res) => {
  console.log('in login');
  const user = await validateLogin(JSON.parse(req.body).userName, JSON.parse(req.body).pass, User);
  if (user === null) {
    return res.json({ err: 'username/password inccorect!' });
  }
  // de pus in config
  const accessToken = jwt.sign({ userName: user.userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
  res.setHeader('Set-Cookie', `token=${accessToken}; Path=/; expires=${new Date(new Date().getTime() + 86409000).toUTCString()}`);
  res.setHeader('withCredentials', true);
  // return res.send('nice');
  return res.redirect('../catsPage');
};

const register = async (req, res) => {
  if (await validateFirstName(JSON.parse(req.body).firstName, User)) {
    return res.json({ err: 'Invalid first name' });
  }
  if (await validateLastName(JSON.parse(req.body).lastName, User)) {
    return res.json({ err: 'Invalid last name!' });
  }
  if (await validatePassword(JSON.parse(req.body).pass, User)) {
    return res.json({ err: 'Invalid password' });
  }
  if (await validateUsername(JSON.parse(req.body).userName, User)) {
    return res.json({ err: 'Username already taken!' });
  }

  if (await validateMail(JSON.parse(req.body).email, User)) {
    return res.json({ err: 'Mail already taken!' });
  }
  try {
    await saveUser(req.body);
    return res.json({ success: 'user saved' });
  } catch (error) {
    console.log(error);
    return res.json({ err: 'err while creating user' });
  }
};
const logout = (req, res) => {
  res.setHeader('Set-Cookie', `token=''; Path=/; expires=${new Date(new Date().getTime()).toUTCString()}`);
  res.setHeader('withCredentials', true);

  res.redirect('../mainPage');
};
module.exports = {
  login,
  register,
  logout,
};
