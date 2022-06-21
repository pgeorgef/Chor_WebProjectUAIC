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
    response2 = await fetch('http://127.0.0.1/child/getChild', {
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
  let kid = await response2.json();
  kid = JSON.parse(kid);

  const image = document.getElementsByClassName('one')[0];
  image.src = kid.imgPath;
  console.log(`avem path${kid.imgPath}`);

  const paragraph = document.getElementById('p');
  let zi = kid.dateOfBirth;
  zi = zi.slice(0, 10);
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
                BIRTHDAY: ${zi} <br>
                OWNER'S FULL NAME: ${ownerName} <br>
                OWNER'S E-MAIL ADDRESS: ${ownerEmail} <br>
                `;

  document.createTextNode(text);
  paragraph.innerHTML = text;
  const container = document.getElementsByClassName('container')[0];
  const deviceHeart = document.createElement('p');
  deviceHeart.setAttribute('class', 'font heart');
  container.appendChild(deviceHeart);
}

const getInfo = async () => {
  const id = localStorage.getItem('idCat');
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
    // to do
  }
  const body = JSON.parse(await response.json());
  console.log(`in get info response e: ${JSON.stringify(body)}`);
  let heartRate;
  let status;
  let ok = 1;
  try {
    response = await fetch(`http://${body.IP}/heart`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // to do
    console.log(error);
    ok = 0;
    heartRate = 0;
    status = 'Child is not wearing the device';
  }
  if (ok) {
    const heartData = await response.json();
    console.log(heartData);
    heartRate = heartData.avgBPM;
    status = +heartData.status === 0 ? 'Child is not wearing the device' : 'Child is wearing the device';
    console.log(heartData);
    console.log(heartRate);
    console.log(status);
    const heartP = document.getElementsByTagName('p')[0];
    console.log(heartP.innerHTML);
    heartP.innerHTML = `${heartP.innerHTML.replace(/Average heart rate BPM is : \d+ <br>/, '')} Average heart rate BPM is : ${heartRate} <br>`;
    heartP.innerHTML = `${heartP.innerHTML.replace(/Child is wearing the device <br>/, '').replace(/Child is not wearing the device <br>/, '')} ${status} <br>`;
  }
};

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

window.onload = async function () {
  generateCards();
  textBox();
  await getInfo();
};

setInterval(getInfo, 10000);
