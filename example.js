const { Server } = require('./lib/server');
const { Router } = require('./lib/router');
const { sendFileRes } = require('./lib/utils.js');

const main = async () => {
  const app = new Server(80);
  const routerMarcel = new Router();
  const routerPrincipal = new Router();

  routerPrincipal.get('/', (req, res) => {
    sendFileRes(res,'./public/mainPage.html', 'text/html');
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

  routerPrincipal.post('/', (req, res) => {
 
    let data = '';
    let chunks = [];

    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {

      data.split('&').forEach(element => {
        chunks.push(element.split('=').at(1))
      })

      console.log(chunks);
      sendFileRes(res,'./public/mainPage.html', 'text/html');
    });
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
};

main();
// middleware pentru static pe route-ul de static
