const headerBar = document.getElementById("headerBar")
const taskSelect = document.getElementById("taskSelect")

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

fetchTaskOptions()
async function fetchTaskOptions() {
  try {
    let response = await fetch('/fetchTasks/')
    let data = await response.json();

    data.forEach(task => {
      let option = document.createElement('option')
      option.value = task.id
      option.innerText = task.name
      taskSelect.appendChild(option)
    })
  } catch (error) {
    console.error('Error:', error);
  }
}
