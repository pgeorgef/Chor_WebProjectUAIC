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

function textBox() {
  const elements = document.getElementsByClassName('column');
  const paragraph = document.getElementById('p');
  const firstName = 'Pisicuta';
  const lastName = 'Suparata';
  const address = '654 B Street Eagan';
  const birthday = '31.02.2020';
  const ownerName = 'Frederikke Doretta';
  const ownerEmail = 'FrederikkeDorettaSwift@gmail.com';
  const ownerNumber = '07621059821';
  const deviceInfo = 'yatta yatta';

  const text = `<br>
                NAME: ${firstName} <br>
                SURNAME: ${lastName} <br>
                ADDRESS: ${address} <br>
                BIRTDAY: ${birthday} <br>
                OWNER'S FULL NAME: ${ownerName} <br>
                OWNER'S PHONE NUMBER: ${ownerNumber} <br>
                OWNER'S E-MAIL ADDRESS: ${ownerEmail} <br>
                DEVICE INFO: ${deviceInfo}<br>
                `;

  const final = document.createTextNode(text);
  paragraph.innerHTML = text;
}
function generateCards() {
  const numCats = 9; // this is going to be fetched from the backend

  const container = document.getElementsByClassName('grid-container')[0];
  container.setAttribute('border-radius', '50%');
  for (let i = 0; i < numCats; ++i) {
    const newCat = document.createElement('cat-card');
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

main();
