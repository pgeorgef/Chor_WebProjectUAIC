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
  const parent = await User.findOne({ userName: req.user });
  const bodyData = JSON.parse(req.body.fields.form);
  fs.renameSync(req.body.files.image.filepath, `${req.body.files.image.filepath}.png`);
  bodyData.imgPath = (`${req.body.files.image.filepath}.png`).split('public')[1];
  const child = new Child(bodyData);
  child.save();
  // patch similar
  parent.children.push(child._id);
  parent.save();
  res.redirect('../catsPage');
});

childRouter.post('/getChild', async (req, res) => {
  console.log(req.body);
  const { id } = JSON.parse(req.body);
  console.log(`am priit id: ${id}`);
  try {
    const kid = await Child.findById(id);
    if (kid == null || kid === undefined) {
      return res.send('doent exist');
    }
    console.log(kid);
    return res.json(JSON.stringify(kid));
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

childRouter.delete('/deleteChild', async (req, res) => {
  const { id } = JSON.parse(req.body);
  console.log(`id-ul userului este:${req.user}`);
  Child.deleteOne({ _id: id }).then(() => {
    console.log('Data deleted');
  }).catch((error) => {
    console.log(error);
  });
  let parent;
  try {
    parent = await User.findOne({ userName: req.user });
    if (parent == null) {
      return res.send('doent exist');
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
  const index = parent.children.indexOf(id);
  if (index > -1) {
    parent.children.splice(index, 1);
    parent.save();
  }
  res.send('success');
});

childRouter.get('/getParent', async (req, res) => {
  try {
    const parent = await User.findOne({ userName: req.user });
    if (parent == null) {
      return res.send('doent exist');
    }
    return res.json(parent);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

module.exports = childRouter;
