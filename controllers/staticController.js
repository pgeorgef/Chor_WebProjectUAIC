const { getToken, verifyToken } = require('../lib/tokens');

const mainPage = async (req, res) => {
  console.log('in mainpage');
  let token = getToken(req.headers?.cookie);

  if (token === {}) { token = ''; }
  try {
    const verified = await verifyToken(token);
    console.log(verified);
    res.redirect('/catsPage');
  } catch (error) {
    console.log('eroarea este:');
    console.log(error);
  }
};

const catsPage = async (req, res) => {
  console.log('in catsPage');
  let token = getToken(req.headers?.cookie);
  if (token === {}) { token = ''; }
  try {
    const verified = await verifyToken(token);
    console.log(verified);
  } catch (error) {
    console.log('eroarea este:');
    console.log(error);
    res.redirect('/mainPage');
  }
};

const infoPage = async (req, res) => {
  console.log('in infoPage');
  let token = getToken(req.headers?.cookie);
  if (token === {}) { token = ''; }
  try {
    const verified = await verifyToken(token);
    console.log(verified);
  } catch (error) {
    console.log('eroarea este:');
    console.log(error);
    res.redirect('/mainPage');
  }
};

const mapPage = async (req, res) => {
  console.log('in mapPage');
  let token = getToken(req.headers?.cookie);
  if (token === {}) { token = ''; }
  try {
    const verified = await verifyToken(token);
    console.log(verified);
  } catch (error) {
    console.log('eroarea este:');
    console.log(error);
    res.redirect('/mainPage');
  }
};

const camPage = async (req, res) => {
  console.log('in camPage');
  let token = getToken(req.headers?.cookie);
  if (token === {}) { token = ''; }
  try {
    const verified = await verifyToken(token);
    console.log(verified);
  } catch (error) {
    console.log('eroarea este:');
    console.log(error);
    res.redirect('/mainPage');
  }
};
module.exports = {
  mainPage,
  catsPage,
  infoPage,
  mapPage,
  camPage,
};
