require('dotenv').config();
const mongoose = require('mongoose');
const { Server } = require('./lib/server');
const { Router } = require('./lib/router');
const {
  cors,
} = require('./lib/utils');
const staticMiddleware = require('./lib/static');
const staticRouter = require('./routes/staticRouter');
const accountRouter = require('./routes/accountRouter');
const childRouter = require('./routes/childRouter');
const Auth = require('./lib/authMiddlewares');

const dbURI = 'mongodb+srv://chor:ct7H1gFt3PuE5vrL@cluster0.boslzhe.mongodb.net/?retryWrites=true&w=majority';

const main = async () => {
  await mongoose.connect(dbURI);
  const app = new Server(80);
  const routerPrincipal = new Router();

  routerPrincipal.post('/logout', (req, res) => {
    res.setHeader('Set-Cookie', `token=''; Path=/; expires=${new Date(new Date().getTime()).toUTCString()}`);
    res.setHeader('withCredentials', true);

    res.redirect('mainPage');
  });

  app.use('/', routerPrincipal);
  app.use('/', staticRouter);
  app.use('/account', accountRouter);
  childRouter.use(Auth());
  app.use('/child', childRouter);

  app.use((req, res, next) => {
    console.log('middleware peste tot');
    next();
    // res.send('am omorat tot');
  });
  app.use(cors);
  app.use(staticMiddleware('public'));
  routerPrincipal.use((req, res, next) => {
    console.log('in routerul principal: ');
    console.log(req.url);
    next();
  });
};

main();
// middleware pentru static pe route-ul de static
