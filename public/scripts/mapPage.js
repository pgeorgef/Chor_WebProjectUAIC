function createMap() {
  const lat = 45.9443;
  const long = 25.0094;
  const map = L.map('map', {
    center: [lat, long],
    zoom: 7.3,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
  const latitude = 47.163574;
  const longitude = 27.582550;
  const marker1 = L.marker([latitude, longitude]).addTo(map);
  const pacurari = [47.173461, 27.557282];
  const gara = [47.168035, 27.568705];
  const marasesti = [45.875360, 27.219712];

  if (L.latLng(gara).distanceTo(pacurari) < 2000) {
    marker1.bindPopup('<b>Sunt in Iasi!</b><br>Sniggers.').openPopup();
  }
}

window.onload = function () {
  createMap();
};

function goToInfo() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('infoPage.html');
}
function goToCam() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('camPage.html');
}
