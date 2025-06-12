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
function checkRoleMiddleware(role) {
  return function(req, res, next) {
    if (req.session.role === "admin") {
      console.log("User is admin")
      return next();
    }

    console.log("checkRole", role);

    if (req.session && req.session.role === role) {
      console.log('User is', role);
      return next();
    } else {
      console.log('User is not', role);
      return res.status(403).send(`You need to be ${role} to see this page`);
    }
  };
}


// Routes to check
app.get('/', checkLoggedIn, (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'))
})

app.get('/index.html', checkLoggedIn, (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'))
})

app.get('/technician/', checkLoggedIn, checkRoleMiddleware("technician"), (req, res) => {
  res.sendFile(path.join(staticPath, 'technician/index.html'))
})

app.get('/technician/index.html', checkLoggedIn, checkRoleMiddleware("technician"), (req, res) => {
  res.sendFile(path.join(staticPath, 'technician/index.html'))
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

// Signup function
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body

  const hash = crypto.encryptPassword(password)

  // Check if user already exists
  if (sql.getId(email)) {
    res.status(409).send('Username already taken')
  }

  // Generate user in sql
  if (!sql.genUser(username, email, hash)) {
    return res.errored
  }

  // Redirect user to login page
  return res.redirect('/login.html')
})

// Order function
app.post('/order', async (req, res) => {
  const { taskSelect, beskrivelse } = req.body
  const userid = req.session.userid
  console.log(userid, taskSelect, beskrivelse)

  // Generate order in sql
  if (!sql.genOrder(userid, taskSelect, beskrivelse)) {
    return res.errored
  }

  return res.redirect('/')
})



// Fetch username
app.get('/fetchUsername', checkLoggedIn, (req, res) => {
  let data = { username: req.session.username }
  return res.send(data)
})

app.get('/fetchTasks', checkLoggedIn, (req, res) => {
  let data = sql.fetchTasks()
  res.send(data)
})

app.get('/fetchOrders', checkLoggedIn, checkRoleMiddleware("technician"), (req, res) => {
  let data = sql.fetchOrders()
  return res.send(data)
})






app.use(express.static(staticPath))

const serverport = 21570
app.listen(serverport, () => console.log('Server running on http://127.0.0.1:' + serverport))
