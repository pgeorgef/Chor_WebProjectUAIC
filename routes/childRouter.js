const fs = require('fs');
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

  console.log(`am primit id: ${id}`);

  try {
    const kid = await Child.findById(id);
    if (kid == null || kid === undefined) {
      return res.json({ err: 'doesnt exist' });
    }
    console.log(kid);
    return res.json(JSON.stringify(kid));
  } catch (err) {
    console.log(err);
    return res.json({ err: 'internal error' });
  }
});

childRouter.patch('/editChild', async (req, res) => {
  console.log('/chil/editChild');
  console.log(req.body);
  const childFormDataEdit = JSON.parse(req.body).editChildFormData;
  const { id } = childFormDataEdit;
  const editChildFormData = {
    firstName: childFormDataEdit.firstName,
    lastName: childFormDataEdit.lastName,
    adress: childFormDataEdit.adress,
    dateOfBirth: childFormDataEdit.dateOfBirth,
    IP: childFormDataEdit.IP,

  };
  console.log(`ID-UL ESTE ${id}`);
  console.log('``````````````````````');
  console.log(`id-ul userului este:${req.user}`);
  try {
    console.log(`id este: ${id}`);
    const child = await Child.findById(id);
    console.log(`child gasit este: ${child}`);
    child.firstName = editChildFormData.firstName;
    child.lastName = editChildFormData.lastName;
    child.adress = editChildFormData.adress;
    child.IP = editChildFormData.IP;
    child.dateOfBirth = editChildFormData.dateOfBirth;
    console.log('child modificat este:');
    console.log(child);
    child.save();
    res.redirect('../catsPage');
  } catch (error) {
    return res.json({ err: 'error while editing the child' });
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
      return res.json({ err: 'id incorect' });
    }
  } catch (err) {
    console.log(err);
    return res.json({ err: 'internal error' });
  }
  const index = parent.children.indexOf(id);
  if (index > -1) {
    parent.children.splice(index, 1);
    parent.save();
  }
  res.redirect('../catsPage');
});

childRouter.get('/getParent', async (req, res) => {
  try {
    const parent = await User.findOne({ userName: req.user });
    if (parent == null) { return res.json({ err: 'id incorect' }); }

    return res.json(parent);
  } catch (err) {
    console.log(err);
    return res.json({ err: 'internal error' });
  }
});

childRouter.patch('/favoriteStatus', async (req, res) => {
  const { status } = JSON.parse(req.body);
  const { id } = JSON.parse(req.body);

  try {
    const kid = await Child.findById(id);
    if (kid == null) {
      return res.json({ err: 'id invalid' });
    }
    kid.favorite = status;
    kid.save();
  } catch (err) {
    console.log(err);
    return res.json({ err: 'internal error' });
  }
});

module.exports = childRouter;
