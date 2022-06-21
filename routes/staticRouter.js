const Router = require('../lib/router');
const {
  mainPage, catsPage, infoPage, mapPage, camPage,
} = require('../controllers/staticController');

const staticRouter = new Router();
staticRouter.get('/mainPage', mainPage);

staticRouter.get('/catsPage', catsPage);

staticRouter.get('/infoPage', infoPage);

staticRouter.get('/mapPage', mapPage);

staticRouter.get('/camPage', camPage);
module.exports = staticRouter;
