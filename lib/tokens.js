const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const verifyToken = async (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, name) => {
    if (err) reject(err);
    resolve(name.userName);
  });
});

const getToken = (cookies) => {
  const list = {};
  const cookieHeader = cookies;
  if (!cookieHeader) return list;
  for (const cookie of cookieHeader.split(';')) {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) continue;
    const value = rest.join('=').trim();
    if (!value) continue;
    list[name] = decodeURIComponent(value);
  }

  return (list.token);
};

module.exports = {
  verifyToken,
  getToken,
};
