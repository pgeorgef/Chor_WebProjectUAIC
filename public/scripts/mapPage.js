function initMap() {
  // receive lat and lng as parameters in the future?
  const uluru = { lat: -25.344, lng: 131.036 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru,
  });
  const marker = new google.maps.Marker({
    position: uluru,
    map,
  });
}

function goToInfo() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('infoPage.html');
}
function goToCam() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('camPage.html');
}
