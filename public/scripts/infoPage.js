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

function textBox(){
    var elements = document.getElementsByClassName("column");
    var paragraph = document.getElementById("p");
    let firstName = "Pisicuta";
    let lastName = "Suparata";
    let address = "654 B Street Eagan";
    let birthday = "31.02.2020";
    let ownerName = "Frederikke Doretta";
    let ownerEmail = "FrederikkeDorettaSwift@gmail.com";
    let ownerNumber = "07621059821";
    let deviceInfo = "yatta yatta"
    
    let text = `<br>
                NAME: ${firstName} <br>
                SURNAME: ${lastName} <br>
                ADDRESS: ${address} <br>
                BIRTDAY: ${birthday} <br>
                OWNER'S FULL NAME: ${ownerName} <br>
                OWNER'S PHONE NUMBER: ${ownerNumber} <br>
                OWNER'S E-MAIL ADDRESS: ${ownerEmail} <br>
                DEVICE INFO: ${deviceInfo}<br>
                `;
    
    var final = document.createTextNode(text);
    paragraph.innerHTML=text;
}
function generateCards(){
    let numCats = 9; // this is going to be fetched from the backend

    let container = document.getElementsByClassName('grid-container')[0];
    container.setAttribute('border-radius','50%');
    for(let i = 0; i < numCats; ++i){
        let newCat = document.createElement('cat-card');
        newCat.setAttribute('class', `cat-${i}`);
        let catImg = document.createElement('img');
        catImg.setAttribute('class', 'card-image');
        catImg.setAttribute('onClick', 'catPage()')
        catImg.setAttribute('src', 'http://placekitten.com/200/300'); // image from back
        newCat.appendChild(catImg);
        container.appendChild(newCat)
    }
}

window.onload = function () {
    generateCards();
    textBox();
};

main();