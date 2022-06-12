class Router {
  routes = {};

  get = async (path, func) => {
    if (func.length === 3) {
      // check if the path exists first, if not create empty path
      if (!Object.prototype.hasOwnProperty.call(this.routes, path)) {
        this.routes[path] = {};
      }
      if (Object.prototype.hasOwnProperty.call(this.routes[path], 'GET-MIDDLEWARE')) {
        this.routes[path]['GET-MIDDLEWARE'].push(func);
      } else {
        this.routes[path]['GET-MIDDLEWARE'] = [];
        this.routes[path]['GET-MIDDLEWARE'].push(func);
      }
    } else {
      this.routes[path] = { ...this.routes[path], GET: func };
    }
  };

  post = async (path, func) => {
    if (func.length === 3) {
      // check if the path exists first, if not create empty path
      if (!Object.prototype.hasOwnProperty.call(this.routes, path)) {
        this.routes[path] = {};
      }
      if (Object.prototype.hasOwnProperty.call(this.routes[path], 'POST-MIDDLEWARE')) {
        this.routes[path]['POST-MIDDLEWARE'].push(func);
      } else {
        this.routes[path]['POST-MIDDLEWARE'] = [];
        this.routes[path]['POST-MIDDLEWARE'].push(func);
      }
    } else {
      this.routes[path] = { ...this.routes[path], POST: func };
    }
  };

  use = async (func) => {
    if (func.length === 3) {
      if (Object.prototype.hasOwnProperty.call(this.routes, 'GENERAL-MIDDLEWARE')) {
        this.routes['GENERAL-MIDDLEWARE'].push(func);
      } else {
        this.routes['GENERAL-MIDDLEWARE'] = [];
        this.routes['GENERAL-MIDDLEWARE'].push(func);
      }
    }
  // middleware, add to this.routes[middlewares] = push func
  };
}

module.exports = {
  Router,
};
