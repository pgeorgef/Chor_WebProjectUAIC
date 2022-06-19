const fs = require('fs');
const { Blob } = require('buffer');
const { Router } = require('../lib/router');
const User = require('../models/user');
const Child = require('../models/child');

const childRouter = new Router();

childRouter.get('/getAllChildren', async (req, res) => {
  const parent = await User.findOne({ userName: req.user });
  parent
    .populate('children')
    .then((p) => res.json(p.children))
    .catch((error) => console.log(error));
});

childRouter.post('/addChild', async (req, res) => {
  console.log('in add child');
  /*
  const parent = await User.findOne({userName : req.user});
  console.log(parent);

  const child = new Child(JSON.parse(req.body));
  // child.save();
  parent.children.push(child._id);
  // parent.save();
  */
  console.log('req este: ');
  // console.log(typeof (req.body));
  console.log(req.body);
  console.log(JSON.parse(req.body.fields.form));
  console.log(req.body.files.image.filepath);

  // console.log(new Blob([req.body], { type: 'image/png' }));
  // fs.createWriteStream('test.png').write(req.body);
});

childRouter.get('/getChild', async (req, res) => {
  const id = '62ae125493b10048aa217d47';
  // de luat din req

  try {
    const kid = await Child.findById(id);
    if (kid === null) {
      return res.send('doent exist');
    }
    return res.json(kid);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

module.exports = childRouter;
