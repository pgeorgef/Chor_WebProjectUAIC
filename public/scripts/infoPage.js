var elements = document.getElementsByClassName("column");
var paragraph = document.getElementById("p");

var i;

function three() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.flex = "33%";
    }
}
function two() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.flex = "50%";
    }
}
function one() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.flex = "100%";
    }
}

let firstName = "Pisicuta";
let lastName = "Suparata";
let address = "654 B Street Eagan";
let birthday = "31.02.2020";
let ownerName = "Frederikke Doretta";
let ownerEmail = "FrederikkeDorettaSwift@gmail.com";
let ownerNumber = "07621059821";
let deviceInfo = "yatta yatta"

paragraph.setAttribute('style', 'white-space: pre;');

let text = `
            NAME: ${firstName} \r\n 
            SURNAME:  ${lastName} \r\n 
            ADDRESS: ${address} \r\n
            BIRTDAY: ${birthday} \r\n
            OWNER'S  FULL  NAME: ${ownerName} \r\n
            OWNER'S  PHONE  NUMBER: ${ownerNumber} \r\n
            OWNER'S  E-MAIL  ADDRESS: ${ownerEmail} \r\n
            DEVICE  INFO: ${deviceInfo}
            `;

var final = document.createTextNode(text);
paragraph.textContent = text;
