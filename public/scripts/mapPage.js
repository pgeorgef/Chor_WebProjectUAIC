const markersLayer = new L.LayerGroup();
let map;

async function updateMap() {
  const lat = 45.9443;
  const long = 25.0094;

  const latitude = 47.163574;
  const longitude = 27.582550;

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
  const childFirstName = body.firstName;
  const childLastName = body.lastName;
  console.log(`in get info response e: ${JSON.stringify(body)}`);
  let heartRate;
  let status;
  let ok = 1;
  try {
    response = await fetch(`http://${body.IP}/location`, {
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
  }
  if (ok) {
    const mapData = await response.json();
    console.log(mapData);
    /*
    heartP.innerHTML = `${heartP.innerHTML.replace(/Average heart rate BPM is : \d+ <br>/, '')} Average heart rate BPM is : ${heartRate} <br>`;
    heartP.innerHTML = `${heartP.innerHTML.replace(/Child is wearing the device <br>/, '').replace(/Child is not wearing the device <br>/, '')} ${status} <br>`; */
    const { latitude } = mapData;
    const { longitude } = mapData;
    markersLayer.clearLayers();
    const marker1 = L.marker([latitude, longitude]).addTo(map);
    marker1.bindPopup(`<b>Aici este ${childFirstName} ${childLastName} </b>`).openPopup();
    markersLayer.addLayer(marker1);
    markersLayer.addTo(map);
  }
}

async function createMap() {
  const lat = 45.9443;
  const long = 25.0094;
  map = L.map('map', {
    center: [lat, long],
    zoom: 7.3,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
  markersLayer.addTo(map);
  const latitude = 47.163574;
  const longitude = 27.582550;
  // const marker1 = L.marker([latitude, longitude]).addTo(map);
  /*
  const pacurari = [47.173461, 27.557282];
  const gara = [47.168035, 27.568705];
  const marasesti = [45.875360, 27.219712];

  if (L.latLng(gara).distanceTo(pacurari) < 2000) {
    marker1.bindPopup('<b>Sunt in Iasi!</b><br>Sniggers.').openPopup();
  } */
}

window.onload = async function () {
  createMap();
  await updateMap();
};

setInterval(updateMap, 30000);
function goToInfo() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('infoPage.html');
}
function goToCam() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('camPage.html');
}
