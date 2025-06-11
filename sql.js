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
