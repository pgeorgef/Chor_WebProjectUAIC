const { login, register, logout } = require('../controllers/accountController');
const Router = require('../lib/router');

const accountRouter = new Router();

accountRouter.post('/login', login);

accountRouter.post('/register', register);

accountRouter.post('/logout', logout);
module.exports = accountRouter;
