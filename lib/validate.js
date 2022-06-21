const crypto = require('crypto');

const validateFirstName = async (firstName) => {
  const firstNameRegex = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;

  if (!firstNameRegex.test(firstName) || firstNameRegex.length > 50 || firstName == undefined) {
    return true;
  }
  return false;
};

const validateLastName = async (lastName) => {
  const lastNameRegex = /\b([A-ZÀ-ÿ][-,a-z ']+[ ]*)+/;
  console.log(lastNameRegex.test(lastName));
  if (!lastNameRegex.test(lastName) || lastName == undefined) {
    console.log('invalid last name');
    return true;
  }
  return false;
};

const validateIP = async (IP) => {
  const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
  console.log(ipRegex.test(IP));
  if (!ipRegex.test(IP) || IP === undefined) {
    console.log('invalid ip');
    return true;
  }
  return false;
};

const validateFields = async (body) => {
  console.log('in validate fields');
  console.log(body);
  console.log(await validateFirstName(body.firstName) + await validateLastName(body.lastName) + await validateIP(body.IP));
  if (await validateFirstName(body.firstName) || await validateLastName(body.lastName) || await validateIP(body.IP)) {
    console.log('invaildee');
    return true;
  }
  return false;
};

const validatePassword = async (password) => {
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[ #?!@$%^&*-]).{8,}$/;
  if (!passwordRegex.test(password) || password == undefined) {
    console.log('invalid password');
    return true;
  }
};

const validateUsername = async (username, UserModel) => {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username) || username === undefined) {
    console.log('invalid username');
    return true;
  }

  try {
    const result = await UserModel.findOne({ userName: username });
    if (result !== null) {
      console.log('username taken');
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return true;
  }
};

const validateMail = async (mail, UserModel) => {
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regexEmail.test(mail) || mail === undefined) {
    console.log('invalid mail');
    return true;
  }

  try {
    const result = await UserModel.findOne({ email: mail });
    if (result !== null) {
      console.log('mail taken');
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return true;
  }
};

const validateLogin = async (userName, pass, UserModel) => {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(userName)) {
    console.log('invalid username');
    return null;
  }
  const encryptedPass = crypto.createHash('sha256').update(pass).digest('hex');
  try {
    const result = await UserModel.findOne({ userName, encryptedPass });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  validateLogin,
  validateMail,
  validateUsername,
  validateFirstName,
  validateLastName,
  validatePassword,
  validateFields,
};
