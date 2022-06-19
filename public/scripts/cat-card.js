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

function generateCards() {
  const numCats = 10; // this is going to be fetched from the backend
  // pisi.src = "https://media.istockphoto.com/photos/ro/pisica-european%C4%83-cu-p%C4%83r-scurt-id1072769156?s=612x612"
  // console.log(pisi)
  const randImages = ['https://i.redd.it/dm6ze58ywka71.jpg', 'https://i.redd.it/ltdwutfkwpp71.jpg', 'https://i.redd.it/fndazfdlnzl71.jpg', 'https://preview.redd.it/qz5mzemlwon71.jpg?width=1390&format=pjpg&auto=webp&s=6e0689ff1bb6651a856d3307589ed86396a3dfba', 'https://i.redd.it/tsnalhemkgl71.jpg', 'https://i.redd.it/i80qyn1ht9m81.jpg', 'https://preview.redd.it/9ltty7vsxux71.jpg?width=3120&format=pjpg&auto=webp&s=dfeed52092c4ffc61a1b9b755f83013120d2e83b', 'https://i.redd.it/j9m5ywu3z9h81.jpg', 'https://i.imgur.com/r4PT8WQ.jpg'];
  const randNames = ['Luna', 'Oliver', 'Leo', 'Bella', 'Paul', 'Princess', 'Leon'];

  const container = document.getElementsByClassName('grid-container')[0];
  for (let i = 0; i < numCats; ++i) {
    const newCat = document.createElement('cat-card');
    newCat.setAttribute('class', `cat-${i}`);
    const catImg = document.createElement('img');
    catImg.setAttribute('class', 'card-image');
    catImg.setAttribute('slot', 'cat-image');
    catImg.setAttribute('onClick', 'catPage()');
    catImg.setAttribute('src', randImages[Math.floor(Math.random() * 9)]); // image from back
    newCat.appendChild(catImg);
    const catName = document.createElement('p');
    catName.setAttribute('slot', 'cat-name');
    catName.setAttribute('class', 'card-name');
    catName.textContent = randNames[Math.floor(Math.random() * 7)]; // text from back
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
function catPage() {
  window.location.replace('infoPage.html'); // hacky, needs to be changed
}
function deleteChild() {
  confirm('Are you sure you want to delete this child?');
}
function favoriteChild(e) {
  if (e.target.src.includes('star-empty')) {
    e.target.src = e.target.src.replace('star-empty', 'star-full');
  } else {
    e.target.src = e.target.src.replace('star-full', 'star-empty');
  }
}
window.onload = function () {
  generateCards();
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
    address: document.getElementById('address').value,
    birth: document.getElementById('birthday').value,
  };
  // document.getElementsByClassName('card-image')[0].src = addChildForm.image;
  // fs.createWriteStream('test').write(addChildForm.image);
  let response;
  console.log('imagine este:');
  console.log(addChildFormData.image);
  const blob = await fetch(addChildFormData.image).then((r) => r.blob());

  // console.log(reader.readAsText(blob));
  console.log(`blobul este ${typeof (blob)}`);
  console.log(blob);
  // console.log(typeof ((await blobToBase64(blob))));

  //  console.log(new Blob([((await blobToBase64(blob)).split(',')[1])], { type: 'image/png' }));
  // blob = await blob.arrayBuffer();
  // const view = ab2str(blob);
  // console.log(view);
  // console.log('aaaa');
  // addChildFormData.image = view;
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
  console.log(body);
};
