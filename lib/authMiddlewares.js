const { getToken, verifyToken } = require('./utils');

// auth
const Auth = () => async (req, res, next) => {
  console.log('in Auth middleware');
  let token = getToken(req.headers?.cookie);
  if (token === {}) { token = ''; }
  try {
    const verified = await verifyToken(token);
    console.log(verified);
    next();
  } catch (error) {
    console.log('eroarea este:');
    console.log(error);
    res.redirect('/mainPage');
  }
};
module.exports = Auth;
