class Router {
  routes = {};

  set = async (path, func, method) => {
    if (func.length === 3) {
      // check if the path exists first, if not create empty path
      if (!Object.prototype.hasOwnProperty.call(this.routes, path)) {
        this.routes[path] = {};
      }
      if (Object.prototype.hasOwnProperty.call(this.routes[path], `${method}-MIDDLEWARE`)) {
        this.routes[path]['GET-MIDDLEWARE'].push(func);
      } else {
        this.routes[path]['GET-MIDDLEWARE'] = [];
        this.routes[path]['GET-MIDDLEWARE'].push(func);
      }
    } else {
      this.routes[path] = { ...this.routes[path], [method]: func };
    }
  };

  delete = async (path, func) => {
    this.set(path, func, 'DELETE');
  };

  patch = async (path, func) => {
    this.set(path, func, 'PATCH');
  };

  get = async (path, func) => {
    this.set(path, func, 'GET');
  };

  post = async (path, func) => {
    this.set(path, func, 'POST');
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

module.exports = Router;
