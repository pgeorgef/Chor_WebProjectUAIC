const fs = require('fs');
const User = require('../models/user');
const Child = require('../models/child');
const { validateFields } = require('../lib/validate');

const getAllChildren = async (req, res) => {
  const parent = await User.findOne({ userName: req.user });
  parent
    .populate('children')
    .then((p) => res.json(p.children))
    .catch((error) => console.log(error));
};

const addChild = async (req, res) => {
  console.log('~~~~~~~~~~~~~');
  console.log(req.body.fields.form);
  console.log('~~~~~~~~~~~~~');
  const bodyData = JSON.parse(req.body.fields.form);
  if (await validateFields(bodyData) === false) {
    const parent = await User.findOne({ userName: req.user });
    fs.renameSync(req.body.files.image.filepath, `${req.body.files.image.filepath}.png`);
    bodyData.imgPath = (`${req.body.files.image.filepath}.png`).split('public')[1];
    const child = new Child(bodyData);
    child.save();
    // patch similar
    parent.children.push(child._id);
    parent.save();
    res.redirect('../catsPage');
  } else {
    return res.json({ err: 'invalid form' });
  }
};
const getChild = async (req, res) => {
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
};

const editChild = async (req, res) => {
  if (await validateFields(JSON.parse(req.body).editChildFormData) === false) {
    const { id } = JSON.parse(req.body).editChildFormData;
    const editChildFormData = {
      firstName: JSON.parse(req.body).editChildFormData.firstName,
      lastName: JSON.parse(req.body).editChildFormData.lastName,
      adress: JSON.parse(req.body).editChildFormData.adress,
      IP: JSON.parse(req.body).editChildFormData.IP,
      dateOfBirth: JSON.parse(req.body).editChildFormData.dateOfBirth,
    };
    try {
      const child = await Child.findById(id);
      child.firstName = editChildFormData.firstName;
      child.lastName = editChildFormData.lastName;
      child.adress = editChildFormData.adress;
      child.IP = editChildFormData.IP;
      child.dateOfBirth = editChildFormData.dateOfBirth;
      child.save();
      res.redirect('../catsPage');
    } catch (error) {
      return res.json({ err: 'error while editing the child' });
    }
  } else {
    return res.json({ err: 'invalid form' });
  }
};

const deleteChild = async (req, res) => {
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
};
const getParent = async (req, res) => {
  try {
    const parent = await User.findOne({ userName: req.user });
    if (parent == null) { return res.json({ err: 'id incorect' }); }

    return res.json(parent);
  } catch (err) {
    console.log(err);
    return res.json({ err: 'internal error' });
  }
};
const favoriteStatus = async (req, res) => {
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
};

module.exports = {
  getAllChildren,
  addChild,
  getChild,
  editChild,
  deleteChild,
  getParent,
  favoriteStatus,
};
