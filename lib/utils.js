const betterResponse = (res) => {
  res.send = (message) => res.end(message);
  res.json = (message) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(message));
  };
  return res;
};

const processMiddleware = (middleware, req, res) => new Promise((resolve, reject) => {
  middleware(req, res, (...args) => {
    if (args.length > 0) {
      reject(args);
    } else if (args.length === 0) {
      resolve();
    }
  });
  // daca am ajuns aici e clar ca nu e bine
  reject(new Error('No next in middleware'));
});

module.exports = {
  betterResponse,
  processMiddleware,
};
