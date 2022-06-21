function goToMap() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('mapPage.html');
}
function goToInfo() {
  console.log(localStorage.getItem('idCat'));
  window.location.replace('camInfo.html');
}

const setCam = async () => {
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
  console.log('aoc');
  document.getElementsByTagName('iframe')[0].src = `http://${body.IP}/stream`;
};

window.onload = async function () {
  await setCam();
};
