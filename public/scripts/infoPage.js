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
    // to do
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
  container.setAttribute('border-radius', '50%');

  console.log(body);
  let i = 0;
  for (const kid of body) {
    if (kid._id != localStorage.getItem('idCat')) {
      const newCat = document.createElement('div');
      newCat.setAttribute('class', `cat-${kid._id}`);
      const catImg = document.createElement('img');
      catImg.setAttribute('class', 'card-image');
      catImg.setAttribute('onClick', `catPage("${kid._id}")`);
      catImg.setAttribute('src', kid.imgPath);
      newCat.appendChild(catImg);
      container.appendChild(newCat);
      i++;
      if (i == 9) {
        return;
      }
    }
  }
}

function catPage(idCat) {
  console.log(idCat);
  localStorage.setItem('idCat', idCat);
  window.location.replace('infoPage.html'); // hacky, needs to be changed
}

window.onload = function () {
  generateCards();
  textBox();
};
