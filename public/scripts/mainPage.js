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
    response = await axios.post('http://127.0.0.1/register', registerInfo);
  } catch (error) {
    console.log(error);
  }
  console.log(response.data);
  if( response.data == 'succes' ){
    alert('Successful registration');
  }
  else if( response.data == 'mail' ){
    alert('Mail already taken!');
  }
  else if( response.data == 'username' ) {
    alert('Username already taken!');
  }
  else if( response.data == 'validation' ){
    alert('All form fields must be completed.')
  }
};

const login = async(event) => {

  //TO DO
};
