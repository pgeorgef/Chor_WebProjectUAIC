const { Router } = require('../lib/router');
const User = require('../models/user');
const Child = require('../models/child');

const childRouter = new Router();

childRouter.get('/getAllChildren', async (req, res) => {
  const parent = await User.findById('62ae124b93b10048aa217d44');
  // const parinte = req.user;

  parent
    .populate('children')
    .then((p) => res.json(p.children))
    .catch((error) => console.log(error));
});

module.exports = childRouter;
