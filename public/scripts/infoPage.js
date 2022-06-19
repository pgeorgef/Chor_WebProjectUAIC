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

async function textBox() {
  const id = localStorage.getItem('idCat');
  // <input type="image" src="./assets/logout.png" class="logout">
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
  const parent = await response.json();

  let response2;
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
    if (response2.redirected) {
      window.location.href = response2.url;
    }
  } catch (error) {
  }
  let kid = await response.json();
  kid = JSON.parse(kid);

  const image = document.getElementsByClassName('one')[0];
  image.src = kid.imgPath;
  console.log(`avem path${kid.imgPath}`);

  const paragraph = document.getElementById('p');
  const { firstName } = kid;
  const { lastName } = kid;
  const { adress } = kid;
  const { dateOfBirth } = kid;
  const ownerName = `${parent.firstName} ${parent.lastName}`;
  const ownerEmail = parent.email;
  const deviceInfo = 'yatta yatta';

  const text = `<br>
                NAME: ${firstName} <br>
                SURNAME: ${lastName} <br>
                ADDRESS: ${adress} <br>
                BIRTDAY: ${dateOfBirth} <br>
                OWNER'S FULL NAME: ${ownerName} <br>
                OWNER'S E-MAIL ADDRESS: ${ownerEmail} <br>
                DEVICE INFO: ${deviceInfo}<br>
                `;

  document.createTextNode(text);
  paragraph.innerHTML = text;
}
function goToMap() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('mapPage.html');
}
function goToCam() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('camPage.html');
}
function generateCards() {
  const numCats = 9; // this is going to be fetched from the backend

  const container = document.getElementsByClassName('grid-container')[0];
  container.setAttribute('border-radius', '50%');
  for (let i = 0; i < numCats; ++i) {
    const newCat = document.createElement('div');
    newCat.setAttribute('class', `cat-${i}`);
    const catImg = document.createElement('img');
    catImg.setAttribute('class', 'card-image');
    catImg.setAttribute('onClick', 'catPage()');
    catImg.setAttribute('src', 'http://placekitten.com/200/300'); // image from back
    newCat.appendChild(catImg);
    container.appendChild(newCat);
  }
}

window.onload = function () {
  generateCards();
  textBox();
};
