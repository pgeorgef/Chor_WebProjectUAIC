const mongoose = require('mongoose');
const { Server } = require('./lib/server');
const { Router } = require('./lib/router');

const { sendFileRes, cors } = require('./lib/utils');

const main = async () => {
  await mongoose.connect('mongodb://localhost:27017/test');
  const app = new Server(80);
  const routerMarcel = new Router();
  const routerPrincipal = new Router();

  routerPrincipal.get('/', (req, res) => {
    sendFileRes(res, './public/mainPage.html', 'text/html');
  });

  routerPrincipal.get('/stylesheets/mainPage.css', (req, res) => {
    sendFileRes(res, './public/stylesheets/mainPage.css', 'text/css');
  });

  routerPrincipal.get('/scripts/mainPage.js', (req, res) => {
    sendFileRes(res, './public/scripts/mainPage.js', 'text/javascript');
  });

  routerPrincipal.get('/assets/logo.png', (req, res) => {
    sendFileRes(res, './public/assets/logo.png', 'image/png');
  });
  routerPrincipal.get('/public/icon.png', (req, res) => {
    sendFileRes(res, './public/icon.png', 'image/png');
  });

  routerPrincipal.post('/register', async (req, res) => {
    const Cat = mongoose.model('Cat', { name: String });

    const kitty = new Cat({ name: 'sniggers' });
    await kitty.save();
    console.log(JSON.parse(req.body));
    res.send(req.body);
  });

  routerMarcel.get('/create', (req, res, next) => {
    console.log('Looged');
    next();
    res.send('ai pierdut din prima mihai');
  });
  routerMarcel.get('/create', (req, res, next) => {
    console.log('in middleware-ul urmator');
    // res.send('s-a blocat in al doilea middleware');
    next();
  });
  routerMarcel.get('/create', (req, res) => {
    console.log('in create');
    res.send('bun');
  });

  routerMarcel.get('/pisicuti', (req, res) => {
    console.log('pisicuti');
    res.send('pisicuti');
  });
  routerMarcel.get('/', (req, res) => {
    console.log(res);
    console.log('marcel in /');
    res.json({
      user: 'marcel',
      age: 18,
    });
    res.end();
  });

  routerMarcel.use((req, res, next) => {
    console.log('in marcelul general');
    res.send('s-a blocat in marcelul general');
    // next();
  });

  routerMarcel.post('/midd', (req, res, next) => {
    console.log('in primul middlware trece mai departe');
    next();
    // next();
  });
  routerMarcel.post('/midd', (req, res, next) => {
    console.log('in midd doilea middleware');
    res.send('s-a blocat');
    // next();
  });
  routerMarcel.post('/midd', (req, res) => {
    console.log('in midd');
    res.send('buna midd');
  });

  const routerLavinia = new Router();
  routerLavinia.get('/lavinia', (req, res) => {
    res.json({
      lavinia: 1,
    });
  });
  routerLavinia.get('/create', (req, res) => {
    res.send('lavinia');
  });
  app.use('/api', routerMarcel);
  app.use('/apiLavinia', routerLavinia);
  app.use('/', routerPrincipal);
  app.use((req, res, next) => {
    console.log('middleware peste tot');
    next();
    // res.send('am omorat tot');
  });
  app.use(cors);
};

main();
// middleware pentru static pe route-ul de static
