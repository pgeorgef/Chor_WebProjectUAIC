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

childRouter.post('/getChild', async(req, res) => {
  console.log(req.body)
  const id = JSON.parse(req.body).id;
  console.log("am priit id: " + id)
  try{
    const kid = await Child.findById(id);
    if( kid == null || kid == undefined){
      return res.send('doent exist');
    }
    console.log(kid);
    return res.json(JSON.stringify(kid));
  } catch( err ){
    console.log(err);
    return res.send(err);
  }
});

childRouter.get('/getParent', async(req,res) => {

  try{
    const parent = await User.findOne({userName: req.user});
    if( parent == null )
      return res.send('doent exist');
    return res.json(parent);
  } catch( err ){
    console.log(err);
    return res.send(err);
  }
});

module.exports = childRouter;
