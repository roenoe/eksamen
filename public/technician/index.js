const headerBar = document.getElementById("headerBar")
let orders = []

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



fetchOrders()
async function fetchOrders() {
  try {
    let response = await fetch('/fetchOrders')
    let data = await response.json()

    orders = data
    displayOrders()
  } catch (error) {
    console.error('Error:', error)
  }
}

function displayOrders() {
  const orderList = document.getElementById("orderList")
  orderList.innerHTML = `
    <tr>
      <th>User</th>
      <th>Technician</th>
      <th>Task</th>
      <th>Status</th>
      <th>Additional information</th>
    </tr>
  `
  orders.forEach(order => {
    const listItem = document.createElement('tr')
    listItem.innerHTML = `
      <td>${order.username}</td>
      <td>${order.technician}</td>
      <td>${order.task}</td>
      <td>${order.status}</td>
      <td>${order.text}</td>
    `
    orderList.appendChild(listItem)
  })

}
