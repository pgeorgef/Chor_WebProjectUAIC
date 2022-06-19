require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { Server } = require('./lib/server');
const { Router } = require('./lib/router');
const {
  sendFileRes, cors, validateMail, validateUsername, validateFirstName, validateLastName, validatePassword, checkResult, saveUser, validateLogin, verifyToken,
} = require('./lib/utils');
const User = require('./models/user');

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
  if ( await validateFirstName(JSON.parse(req.body).firstName)){
    return res.json({err: 'Invalid first name'});
  }
  if (await validateLastName(JSON.parse(req.body).lastName)){
    return res.json({err: 'Invalid last name'});
  }
  if (await validatePassword(JSON.parse(req.body).pass)){
    return res.json({err: 'Invalid password'});
  }
  if (await validateUsername(JSON.parse(req.body).userName, User)) {
    return res.json({ err: 'Username already taken!' });
  }
  if (await validateMail(JSON.parse(req.body).email, User)) {
    return res.json({ err: 'Mail already taken!' });
  }
    try {
      await saveUser(req.body);
      return res.json({ success: 'user saved' });
    } catch (error) {
      console.log(error);
      return res.json({ err: 'err while creating user' });
    }
  });

  routerPrincipal.post('/login', async (req, res) => {
    const user = await validateLogin(JSON.parse(req.body).userName, JSON.parse(req.body).pass, User);
    if (user === null) {
      return res.json({ err: 'username/password inccorect!' });
    }
    // de pus in confing
    const accessToken = jwt.sign({ userName: user.userName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
    // const refreshToken = jwt.sign({userName: user.userName}, process.env.REFRESH_TOKEN_SECRET);
    // res.json({ token: accessToken });
    res.writeHead(200, {
      'Set-Cookie': `token=${accessToken}; Path=/; expires=${new Date(new Date().getTime() + 86409000).toUTCString()}`,
      'Content-Type': 'text/plain',
    });
    
    return res.send('success');
  });

  routerPrincipal.get('/getInfo', async(req,res) =>{
    if(req.body=='')
    return res.send('not logged in');
    console.log('firstname');
    console.log(JSON.parse(req.body).firstName);
    console.log('lastname');
    console.log(JSON.parse(req.body).lastName);
    let result = JSON.parse(req.body).firstName + ' ' +JSON.parse(req.body).lastName;
    return res.send(result)
  });

  // should be in middleware
  routerPrincipal.post('/token', async (req, res) => {
    const list = {};
    const cookieHeader = req.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(';').forEach((cookie) => {
      let [name, ...rest] = cookie.split('=');
      name = name?.trim();
      if (!name) return;
      const value = rest.join('=').trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
    });
    let answer;
    console.log(list.token);
    try {
      answer = await verifyToken(list.token);
    } catch (error) {
      return res.send('bye bye');
    }

    console.log(answer);
    // TO DO - verify the token using verify
    return res.send(`gj my nigga. token: \n${list.token} ${answer}`);
  });

  routerPrincipal.post('/logout', (req, res) => {
    const cookie = req.headers?.cookie.split('=')[1];
    console.log(cookie);

    res.writeHead(200, {
      'Set-Cookie': `token=''; expires=${new Date(new Date().getTime()).toUTCString()}`,
      'Content-Type': 'text/plain',
    });

    res.send('should be dead');
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
