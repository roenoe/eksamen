import * as sql from './sql.js'
import * as crypto from './crypto.js'

import express from 'express'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const staticPath = path.join(__dirname, 'public')

// Middleware/session (req.session)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // This is just because of HTTP vs HTTPS
}))

// Function for checking whether user is logged in
function checkLoggedIn(req, res, next) {
  console.log("checkLoggedIn")
  if (req.session.loggedin) {
    console.log('User is logged in')
    return next()
  } else {
    console.log('User is not logged in')
    return res.redirect('/login.html')
  }
}

// Function for checking whether user is <role>
function checkRole(role, req, res, next) {
  console.log("checkRole", role)
  if ((req.session.role == role) || (req.session.role == role)) {
    console.log('User is', role)
    return next()
  } else {
    console.log('User is not', role)
    return res.status(403).send('You need to be', role, 'to see this page')
  }
}



// Routes to check
app.get('/', checkLoggedIn, (req, res) => {
  res.sendFile(path.join(staticPath, '/'))
})



// Login function
app.post('/login', async (req, res) => {
  // Define variables from form for comparison
  const { email, password } = req.body
  let match = false

  // Get user from database
  const userid = sql.getId(email)
  if (!userid) {
    return res.status(401).send('Invalid username or password')
  }
  const user = sql.getUser(userid)

  // Check if password matches
  if (await crypto.comparePassword(password, user.password)) {
    match = true
  } else {
    match = false
    console.log("Invalid password")
  }

  // Save login info in session
  if (match) {
    console.log("Logged in")
    req.session.loggedin = true
    req.session.username = user.name
    req.session.email = user.email
    req.session.userid = user.id
    req.session.role = user.role
  } else {
    return res.status(401).send('Invalid username or password')
  }

  // Redirect user to home page
  console.log(req.session)
  return res.redirect('/')
})

// Log out function
app.get('/logout', checkLoggedIn, (req, res) => {
  req.session.destroy()
  res.redirect('/')
})



// Fetch username
app.get('/fetchUsername', checkLoggedIn, (req, res) => {
  let data = { username: req.session.username }
  return res.send(data)
})







app.use(express.static(staticPath))

const serverport = 21570
app.listen(serverport, () => console.log('Server running on http://127.0.0.1:' + serverport))
