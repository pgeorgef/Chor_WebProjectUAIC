

customElements.define('cat-card',
class extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById('cat-card');
        let templateContent = template.content;
        const shadowRoot = this.attachShadow({ mode : 'open'});
        shadowRoot.appendChild(templateContent.cloneNode(true))
    }
})

function generateCards(){
    
    let numCats = 10; // this is going to be fetched from the backend
    //pisi.src = "https://media.istockphoto.com/photos/ro/pisica-european%C4%83-cu-p%C4%83r-scurt-id1072769156?s=612x612"
    //console.log(pisi)
    let randImages = ['https://i.redd.it/dm6ze58ywka71.jpg', 'https://i.redd.it/ltdwutfkwpp71.jpg','https://i.redd.it/fndazfdlnzl71.jpg','https://preview.redd.it/qz5mzemlwon71.jpg?width=1390&format=pjpg&auto=webp&s=6e0689ff1bb6651a856d3307589ed86396a3dfba','https://i.redd.it/tsnalhemkgl71.jpg', 'https://i.redd.it/i80qyn1ht9m81.jpg', 'https://preview.redd.it/9ltty7vsxux71.jpg?width=3120&format=pjpg&auto=webp&s=dfeed52092c4ffc61a1b9b755f83013120d2e83b', 'https://i.redd.it/j9m5ywu3z9h81.jpg','https://i.imgur.com/r4PT8WQ.jpg']
    let randNames = ['Luna', 'Oliver', 'Leo', 'Bella', 'Paul', 'Princess', 'Leon']

    let container = document.getElementsByClassName('grid-container')[0];
    for(let i = 0; i < numCats; ++i)
    {
        let newCat = document.createElement('cat-card');
        newCat.setAttribute('class', `cat-${i}`);
        let catImg = document.createElement('img');
        catImg.setAttribute('class', 'card-image');
        catImg.setAttribute('slot', 'cat-image');
        catImg.setAttribute('onClick', 'catPage()')
        catImg.setAttribute('src', randImages[Math.floor(Math.random() * 9)]); // image from back
        newCat.appendChild(catImg);
        let catName = document.createElement('p');
        catName.setAttribute('slot', 'cat-name');
        catName.setAttribute('class', 'card-name');
        catName.textContent=randNames[Math.floor(Math.random() * 7)]; // text from back
        newCat.appendChild(catName);
        console.log(newCat)
        container.appendChild(newCat)
    }
    // add the add child container
    let addChild = document.createElement('div');
    addChild.setAttribute('class', 'card-container');
    let buttonAddChild = document.createElement('button');
    buttonAddChild.setAttribute('class', 'add-child-button')
    buttonAddChild.setAttribute('onClick', 'openForm()');
    buttonAddChild.textContent = "Add Child"
    addChild.appendChild(buttonAddChild)
    container.appendChild(addChild);
}
function catPage(){
    window.location.replace('infoPage.html'); // hacky, needs to be changed
}
function deleteChild(){
    confirm("Are you sure you want to delete this child?")
}
function favoriteChild(e){
    if(e.target.src.includes('star-empty'))
    {
        e.target.src = e.target.src.replace('star-empty', 'star-full');
    }
    else
    {
        e.target.src = e.target.src.replace('star-full', 'star-empty');
    }
}
window.onload = function(){
    generateCards();
}

function openForm() {
    document.getElementById("popupForm").style.display = "block";
    overlay.style.display = "block";
  }
  function closeForm() {
    document.getElementById("popupForm").style.display = "none";
    overlay.style.display = "none";
  }