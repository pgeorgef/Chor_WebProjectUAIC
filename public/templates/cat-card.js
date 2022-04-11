

customElements.define('cat-card',
class extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById('cat-card');
        console.log(template)
        let templateContent = template.content;
        const shadowRoot = this.attachShadow({ mode : 'open'});
        shadowRoot.appendChild(templateContent.cloneNode(true))
    }
})

function generateCards(){
    let numCats = 10; // this is going to be fetched from the backend
    let container = document.getElementsByClassName('grid-container')[0];
    for(let i = 0; i < numCats; ++i)
    {
        let newCat = document.createElement('cat-card');
        newCat.setAttribute('class', `cat-${i}`)
        container.appendChild(newCat)
    }
}
window.onload = function(){
    generateCards();
}
console.log("cat card")