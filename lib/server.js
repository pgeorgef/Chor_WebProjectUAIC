const http = require('http');
const { betterResponse, processMiddleware, readBody } = require('./utils');

class Server {
  paths = {};

  middlewares = [];

  requestListener = async (req, res) => {
    // deconstruct the path received in the req and check if it exists in paths - ex: api/users/create, first we check api/users/create if not found we check api/users, if not found we check api, when we find it, we check in the router if the part after "found/" exists
    // verificam daca paht-ul este /
    // console.log(req.url);
    // check if we have middlewares for the entire server

    // eslint-disable-next-line no-param-reassign
    res = betterResponse(res); // better response

    req.body = await readBody(req); // here because we might need the body in the first middleware
    let ok = 1;
    // check if we have middlewares in server
    if (this.middlewares.length !== 0) {
      for (const middlewareFunction of this.middlewares) {
        try {
          await processMiddleware(middlewareFunction, req, res);
          ok = 1;
        } catch (error) {
          ok = 0;
          console.log(error);
        }
        if (ok === 0) break;
      }
    }
    if (ok === 0) return; // if the general middleware didn't have next then we don't go further
    const listPaths = req.url === '/' ? [''] : req.url.split('/');
    const lenListPaths = listPaths.length;
    for (let i = lenListPaths; i > 0; i -= 1) {
      let path = listPaths.slice(0, i).join('/');
      if (path === '') path = '/'; // the root url
      if (Object.prototype.hasOwnProperty.call(this.paths, path)) {
        const rightSidePath = `/${listPaths.slice(i, lenListPaths).join('/')}`;
        for (const router of this.paths[path]) {
          // daca apare o problema cu middlware-ul general , trebuie mutat in if-ul dupa ce am verificat daca path-ul exista in router
          if (Object.prototype.hasOwnProperty.call(router.routes, 'GENERAL-MIDDLEWARE')) {
            for (const middlewareFunction of router.routes['GENERAL-MIDDLEWARE']) {
              try {
                await processMiddleware(middlewareFunction, req, res);
                ok = 1;
              } catch (error) {
                ok = 0;
                console.log(error);
              }
              console.log('dupa apel ok este:d');
              console.log(ok);
              if (ok === 0) { break; }
            }
            if (ok === 0) { break; }
          }
          // check if the right side exists in the router
          if (Object.prototype.hasOwnProperty.call(router.routes, rightSidePath)) {
            if (Object.prototype.hasOwnProperty.call(router.routes[rightSidePath], req.method)) {
              // check if we have middlewares, first check in router
              if (Object.prototype.hasOwnProperty.call(router.routes[rightSidePath], `${req.method}-MIDDLEWARE`)) {
                console.log(router.routes[rightSidePath][`${req.method}-MIDDLEWARE`]);
                for (const middlewareFunction of router.routes[rightSidePath][`${req.method}-MIDDLEWARE`]) {
                  try {
                    await processMiddleware(middlewareFunction, req, res);
                    ok = 1;
                  } catch (error) {
                    ok = 0;
                    console.log(error);
                  }
                  console.log('dupa apel ok este:d');
                  console.log(ok);
                  if (ok === 0) { break; }
                }
              }
              console.log('dupa for ok este:');
              console.log(ok);
              if (ok === 0) { break; }
              router.routes[rightSidePath][req.method](req, res);
              break; // break out of the for after finding the router with the right path
            }

            // router.routes[rightSidePath] ;
          }
        }
      }
    }
    // to chek if we called a function from any route, if not send a 404
  };

  constructor(port) {
    this.port = port;
    this.server = http.createServer(this.requestListener);
    this.server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${port}`);
    });
  }

  use = async (...args) => {
    // only one arguments when we have a middlware
    if (args.length === 1) {
      this.middlewares.push(args[0]); // add to the middlwares
    } else {
      // the path is in the first element of the args and the function is in the second element
      const path = args[0];
      const func = args[1];
      // check if the path exist, if it does append the router/middleware, if it doesn't create it in the paths object
      // eslint-disable-next-line no-lonely-if
      if (Object.prototype.hasOwnProperty.call(this.paths, path)) {
        this.paths[path].push(func);
      } else {
        this.paths[path] = [];
        this.paths[path].push(func);
      }
    }
  };
}

module.exports = {
  Server,
};
