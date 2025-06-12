const navbar = document.getElementById("navbar")

displaynavbar()
function displaynavbar() {
  navbar.innerHTML = `
    <a href="/">Home</a>
    <a href="/technician/">Technician</a>
    <a href="/tos.html">TOS</a>
    <a href="/logout">Log out</a>
  `
}
