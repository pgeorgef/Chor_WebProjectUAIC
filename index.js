require('dotenv').config();
const mongoose = require('mongoose');
const { Server } = require('./lib/server');
const cors = require('./lib/cors');
const staticMiddleware = require('./lib/static');
const staticRouter = require('./routes/staticRouter');
const accountRouter = require('./routes/accountRouter');
const childRouter = require('./routes/childRouter');
const Auth = require('./lib/authMiddlewares');

const dbURI = 'mongodb+srv://chor:ct7H1gFt3PuE5vrL@cluster0.boslzhe.mongodb.net/?retryWrites=true&w=majority';

const main = async () => {
  await mongoose.connect(dbURI);
  const app = new Server(80);

  app.use('/', staticRouter);
  app.use('/account', accountRouter);
  childRouter.use(Auth());
  app.use('/child', childRouter);

  app.use(cors());
  app.use(staticMiddleware('public'));
};

main();
// middleware pentru static pe route-ul de static
