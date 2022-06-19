customElements.define(
  'cat-card',
  class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('cat-card');
      const templateContent = template.content;
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(templateContent.cloneNode(true));
    }
  },
);

async function generateHeader(req) {
  const container = document.getElementsByClassName('header')[0];

  let response;
  try {
    response = await fetch('http://127.0.0.1/child/getParent', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
  const body = await response.json();

  const text = `Welcome, ${body.firstName} ${body.lastName}.`;
  document.createTextNode(text);
  container.innerHTML = text;
}

async function generateCards() {
  let response;
  try {
    response = await fetch('http://127.0.0.1/child/getAllChildren', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
  const body = await response.json();
  const container = document.getElementsByClassName('grid-container')[0];


  for (const kid of body) {
    const newCat = document.createElement('cat-card');
    newCat.setAttribute('class', `cat-${kid._id}`);

    const catImg = document.createElement('img');
    catImg.setAttribute('class', 'card-image');
    catImg.setAttribute('slot', 'cat-image');
    catImg.setAttribute('onClick', `catPage("${kid._id}")`);
    catImg.setAttribute('src', kid.imgPath); // image from back do be added
    newCat.appendChild(catImg);

    const deleteBut = document.createElement('input');
    deleteBut.setAttribute('type', 'image');
    deleteBut.setAttribute('class', 'delete-button');
    deleteBut.setAttribute('slot', 'cat-delete');
    deleteBut.setAttribute('src', './assets/deleteButton.png');
    deleteBut.setAttribute('onClick', `deleteChild("${kid._id}")`);
    newCat.appendChild(deleteBut);

    const favButton = document.createElement('input');
    favButton.setAttribute('type', 'image');
    favButton.setAttribute('class', 'favorite-button');
    favButton.setAttribute('slot', 'cat-favorite');
    favButton.setAttribute('src', './assets/star-empty.png');
    favButton.setAttribute('onClick', `favoriteChild("${kid._id}")`);
    newCat.appendChild(favButton);

    const settingButton = document.createElement('input');
    settingButton.setAttribute('type', 'image');
    settingButton.setAttribute('src', './assets/settings.png');
    settingButton.setAttribute('slot', 'settingsButton');
    settingButton.setAttribute('class', 'settings-button');
    settingButton.setAttribute('onclick', `settingsChild("${kid._id}")`);
    newCat.appendChild(settingButton);

    const catName = document.createElement('p');
    catName.setAttribute('slot', 'cat-name');
    catName.setAttribute('class', 'card-name');
    catName.textContent = `${kid.firstName} ${kid.lastName}`;
    newCat.appendChild(catName);
    console.log(newCat);
    container.appendChild(newCat);
  }

  // add the add child container
  const addChild = document.createElement('div');
  addChild.setAttribute('class', 'card-container');
  const buttonAddChild = document.createElement('button');
  buttonAddChild.setAttribute('class', 'add-child-button');
  buttonAddChild.setAttribute('onClick', 'openForm()');
  buttonAddChild.textContent = 'Add Child';
  addChild.appendChild(buttonAddChild);
  container.appendChild(addChild);
}
async function settingsChild(id) {
  let response;
  try {
    response = await fetch('http://127.0.0.1/child/getChild', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
      credentials: 'include',
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
  let body = await response.json();
  body = JSON.parse(body);
  console.log(body);

  document.getElementById('popupForm').style.display = 'block';
  const popup = document.getElementById('popupForm');
  const container = popup.getElementsByClassName('formContainer')[0];
  const firstName = container.getElementsByClassName('firstName')[0];
  firstName.value = body.firstName;
  const lastName = container.getElementsByClassName('lastName')[0];
  lastName.value = body.lastName;

  const address = container.getElementsByClassName('address')[0];
  address.value = body.adress;

  const birthday = container.getElementsByClassName('birthday')[0];
  let birth = body.dateOfBirth;
  birth = birth.slice(0, 10);
  console.log(birth);
  birthday.value = birth;

}
function catPage(idCat) {
  console.log(idCat);
  localStorage.setItem('idCat', idCat);
  window.location.replace('infoPage.html'); // hacky, needs to be changed
}
async function deleteChild(id) {
  if (confirm('Do you really want to delete this child?')) {
    let response;
    try {
      response = await fetch('http://127.0.0.1/child/deleteChild', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        credentials: 'include',
      });
      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.log(error);
    }

    console.log(response);
  }
}

function favoriteChild(id) {
  console.log(id);
  if (e.target.src.includes('star-empty')) {
    e.target.src = e.target.src.replace('star-empty', 'star-full');
  } else {
    e.target.src = e.target.src.replace('star-full', 'star-empty');
  }
}
window.onload = function () {
  generateCards();
  generateHeader();
};

function openForm() {
  document.getElementById('popupForm').style.display = 'block';
  overlay.style.display = 'block';
}
function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
  overlay.style.display = 'none';
}

const logout = async () => {
  let response;
  try {
    response = await fetch('http://127.0.0.1/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
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

const addChildForm = async (event) => {
  event.preventDefault();
  closeForm();

  const addChildFormData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    adress: document.getElementById('address').value,
    dateOfBirth: document.getElementById('birthday').value,
  };

  let response;
  const formImage = URL.createObjectURL(document.getElementById('file').files[0]);
  console.log('imagine este:');
  console.log(formImage);
  const blob = await fetch(formImage).then((r) => r.blob());

  console.log(`blobul este ${typeof (blob)}`);
  console.log(blob);

  console.log(addChildFormData);
  const formdata = new FormData();
  formdata.append('form', JSON.stringify(addChildFormData));
  formdata.append('image', blob);
  try {
    response = await fetch('http://127.0.0.1/child/addChild', {
      method: 'POST',
      body: formdata,
      credentials: 'include',
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
  const body = await response.json();
  // TO DO CHECK EROARE
};
