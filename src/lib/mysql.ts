import mysql from 'mysql2/promise'

const MYSQL_HOST = process.env.MYSQL_HOST || '192.168.4.161'
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10)
const MYSQL_USER = process.env.MYSQL_USER || 'local'
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'local'
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'local'

let pool: mysql.Pool | null = null

export function getMysqlPool(): mysql.Pool | null {
  if (!MYSQL_USER && !MYSQL_PASSWORD) return null
  if (!pool) {
    pool = mysql.createPool({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

export function isMysqlConfigured(): boolean {
  return !!(MYSQL_USER && MYSQL_PASSWORD)
}
