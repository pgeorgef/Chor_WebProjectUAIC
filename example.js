require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('./lib/server');
const { Router } = require('./lib/router');
const {
  sendFileRes, cors, validateMail, validateUsername, saveUser, validateLogin,
} = require('./lib/utils');
const User = require('./models/user');
const cookieParser = require("cookie-parser");

const dbURI = 'mongodb+srv://chor:ct7H1gFt3PuE5vrL@cluster0.boslzhe.mongodb.net/?retryWrites=true&w=majority';

const main = async () => {
  await mongoose.connect(dbURI);
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
    //TO DO - verify first/last name ( doar litere + spatii )
    //TO DO - verify password (doar litere, cifre, si alte simboluri? sqlinsertio?)
    if (await validateUsername(JSON.parse(req.body).userName, User)) {
      return res.json({ err: 'Username already taken!' });
    }

    if (await validateMail(JSON.parse(req.body).email, User)) {
      return res.json({ err: 'Mail already taken!' });
    }
    try {
      await saveUser(res.body);
      return res.json({ success: 'user saved' });
    } catch (error) {
      return res.json({ err: 'err while creating user' });
    }
  });

  routerPrincipal.post('/verify', (req, res) => {

    console.log(JSON.parse(req.body).token);
    const tip = JSON.parse(req.body).token
    try{
      jwt.verify(tip, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'20s'}, (err, name) => {
        if(err) return res.send(err);
        res.send(name.userName);
      })
    }catch(err){
      res.send('session expired');
    }
  });

  //to add in middleware

  routerPrincipal.post('/login', async(req, res) => {
 
    let user;
    if( ( user = await validateLogin(JSON.parse(req.body).userName, JSON.parse(req.body).pass, User)) == null ){
      return res.json({err: 'username/password inccorect!'});
    }

    const accessToken = jwt.sign({userName: user.userName}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'20s'});
    //const refreshToken = jwt.sign({userName: user.userName}, process.env.REFRESH_TOKEN_SECRET);
    //res.json({ token: accessToken });
    res.writeHead(200, {
      'Set-Cookie':'token='+accessToken+'; Path=/token; expires='+new Date(new Date().getTime()+86409000).toUTCString(),
      "Content-Type": `text/plain`
    });
    res.send("success");
  });

  routerPrincipal.post('/token', (req,res) => {
    let list = {};
    const cookieHeader = req.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    console.log(list.token);

    //TO DO - verify the token using verify
    res.send('gj my nigga. token: \n' + list.token);
  });
  //to destroy https://stackoverflow.com/questions/27978868/destroy-cookie-nodejs

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
