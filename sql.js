import sqlite3 from 'better-sqlite3'
const db = sqlite3('./db/database.db')

export function getId(email) {
  const sqltext = 'select id from user where email = ?'
  const sql = db.prepare(sqltext)
  const response = sql.all(email)
  if (response.length == 0) {
    return false
  }
  return response[0].id
}

export function getUser(userid) {
  const sqltext = 'select user.id, user.name, email, password, roleid, role.name as role from user inner join role on roleid = role.id where user.id = ?;'
  const sql = db.prepare(sqltext)
  const response = sql.all(userid)
  if (response.length == 0) {
    return false
  }
  return response[0]
}

export function genUser(username, email, password) {
  if (getId(username)) {
    return false
  }

  const sqltext = 'insert into user (name, email, password, roleid) values (?, ?, ?, ?)'
  const sql = db.prepare(sqltext)
  const response = sql.run(username, email, password, 3)
  return response
}

export function fetchTasks() {
  const sqltext = 'select id, name from task;'
  const sql = db.prepare(sqltext)
  const response = sql.all()
  return response
}

export function genOrder(userid, taskid, text) {
  const sqltext = 'insert into orders (userid, taskid, statusid, text) values (?, ?, ?, ?);'
  const sql = db.prepare(sqltext)
  const response = sql.run(userid, taskid, 1, text)
  return response
}

export function fetchOrders() {
  const sqltext = 'select orders.id, user.name as username, task.name as task, status.name as status, userid, technicianid, taskid, statusid, text from orders inner join user on userid = user.id inner join task on taskid = task.id inner join status on statusid = status.id;'
  const sql = db.prepare(sqltext)
  const response = sql.all()
  return response
}
