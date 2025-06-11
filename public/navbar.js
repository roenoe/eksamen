const navbar = document.getElementById("navbar")

displaynavbar()
function displaynavbar() {
  navbar.innerHTML = `
    <a href="/">Home</a>
    <a href="/admin/">Admin</a>
    <a href="/logout">Log out</a>
  `
}
