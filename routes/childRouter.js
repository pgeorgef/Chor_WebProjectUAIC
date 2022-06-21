const Router = require('../lib/router');
const {
  getAllChildren, addChild, getChild, editChild, deleteChild, getParent, favoriteStatus,
} = require('../controllers/childController');

const childRouter = new Router();

childRouter.get('/getAllChildren', getAllChildren);

childRouter.post('/addChild', addChild);

childRouter.post('/getChild', getChild);

childRouter.patch('/editChild', editChild);

childRouter.delete('/deleteChild', deleteChild);

childRouter.get('/getParent', getParent);

childRouter.patch('/favoriteStatus', favoriteStatus);

module.exports = childRouter;
