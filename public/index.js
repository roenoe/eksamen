const headerBar = document.getElementById("headerBar")

fetchUsername()
async function fetchUsername() {
  try {
    let response = await fetch('/fetchUsername/')
    let data = await response.json();

    const username = data.username
    displayUsername(username)
  } catch (error) {
    console.error('Error:', error);
  }

}

function displayUsername(username) {
  headerBar.innerHTML = `Grønn Mobil AS, ${username}`
}
