import mysql from 'mysql'

const openConnection = () => {
  const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  })

  connection.connect()
  return connection
}

export default openConnection
