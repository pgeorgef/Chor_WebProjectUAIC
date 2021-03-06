const modal = document.getElementById('modal');
const overlay = document.getElementById('overlayPopup');

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

function openModal() {
  modal.style.display = 'block';
  overlay.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
  overlay.style.display = 'none';
}

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

const register = async (event) => {
  event.preventDefault();
  const registerInfo = {
    firstName: document.getElementsByName('firstName')[0].value,
    lastName: document.getElementsByName('lastName')[0].value,
    userName: document.getElementsByName('username')[0].value,
    email: document.getElementsByName('email')[0].value,
    pass: document.getElementsByName('password')[0].value,
  };
  document.getElementById('registerForm').reset();
  let response;
  try {
    response = await fetch('http://127.0.0.1/account/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerInfo),
      credentials: 'include',
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
  const body = await response.json();
  console.log(body);
  if (Object.prototype.hasOwnProperty.call(body, 'err')) {
    alert(body.err);
  }
  console.log(response.data);
  if (Object.prototype.hasOwnProperty.call(response.data, 'err')) {
    alert(response.data.err);
  }
};

const login = async (event) => {
  event.preventDefault();
  const loginInfo = {
    userName: document.getElementById('loginUserName').value,
    pass: document.getElementById('loginPass').value,
  };
  document.getElementById('loginForm').reset();
  let response;
  try {
    response = await fetch('http://127.0.0.1/account/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginInfo),
      credentials: 'include',
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
  const body = await response.json();
  console.log(body);
  if (Object.prototype.hasOwnProperty.call(body, 'err')) {
    alert(body.err);
  }
};
