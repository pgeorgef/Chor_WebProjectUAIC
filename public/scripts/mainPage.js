const modal = document.getElementById('modal');
const overlay = document.getElementById('overlayPopup');

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');


function openModal(){
    modal.style.display = "block";
    overlay.style.display = "block";
}

function closeModal(){
    modal.style.display = "none";
    overlay.style.display = "none";
}

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
