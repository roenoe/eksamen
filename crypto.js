import bcrypt from 'bcrypt'

export async function comparePassword(submittedPassword, password) {
  if (submittedPassword === password) {
    return true
  } else {
    return false
  }
}
