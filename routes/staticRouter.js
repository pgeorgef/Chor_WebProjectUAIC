const { Router } = require('../lib/router');
const { getToken, verifyToken } = require('../lib/utils');

const staticRouter = new Router();
staticRouter.get('/mainPage', async (req, res) => {
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
});

staticRouter.get('/catsPage', async (req, res) => {
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
});

staticRouter.get('/infoPage', async (req, res) => {
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
});

staticRouter.get('/mapPage', async (req, res) => {
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
});

staticRouter.get('/camPage', async (req, res) => {
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
});
module.exports = staticRouter;
