const { Router } = require('../lib/router');
const User = require('../models/user');
const Child = require('../models/child');
const formidable = require('formidable');

const childRouter = new Router();

childRouter.get('/getAllChildren', async (req, res) => {

  const parent = await User.findOne({userName : req.user});
  parent
    .populate('children')
    .then((p) => res.json(p.children))
    .catch((error) => console.log(error));
});

childRouter.post('/addChild', async (req, res) => {
  /*
  const parent = await User.findOne({userName : req.user});
  console.log(parent);

  const child = new Child(JSON.parse(req.body));
  // child.save();
  parent.children.push(child._id);
  // parent.save();
  */

  res.send('good');
});

childRouter.get('/getChild', async(req, res) => {

  const id = '62ae125493b10048aa217d47';
  // de luat din req

  try{
    const kid = await Child.findById(id);
    if( kid == null ){
      return res.send('doent exist');
    }else{
      return res.json(kid);
    }
  } catch( err ){
    console.log(err);
    return res.send(err);
  } 
});

module.exports = childRouter;
