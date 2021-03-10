import mysql from 'mysql'

export const openConnection = () => {
  const connectionCredentials =
    process.env.NODE_ENV === 'production'
      ? {
          host: process.env.DATABASE_HOST,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
        }
      : {
          host: process.env.DEV_DATABASE_HOST,
          username: process.env.DEV_DATABASE_USER,
          password: process.env.DEV_DATABASE_PASSWORD,
          name: process.env.DEV_DATABASE_NAME,
        }

  const connection = mysql.createConnection(connectionCredentials)

  connection.connect()
  return connection
}
