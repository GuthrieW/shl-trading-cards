import mysql from 'serverless-mysql'

let config
if (process.env.APP_ENV === 'production') {
  config = {
    config: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
  }
}

if (process.env.APP_ENV === 'development') {
  config = {
    config: {
      host: process.env.DEV_DATABASE_HOST,
      user: process.env.DEV_DATABASE_USER,
      password: process.env.DEV_DATABASE_PASSWORD,
      database: process.env.DEV_DATABASE_NAME,
    },
  }
}

if (process.env.APP_ENV === 'script') {
  config = {
    config: {},
  }
}

console.log('env', process.env.APP_ENV)
process.env.APP_ENV !== 'production'
  ? console.log('dbconfig', config)
  : console.log('dbconfig', 'production')

const dbConnection = mysql(config)

export async function queryDatabase<T>(query): Promise<T[] | T> {
  const results: T[] | T = await dbConnection.query(query)
  await dbConnection.end()
  return results
}

export const getCardsDatabaseName = () =>
  process.env.APP_ENV === 'production' ? 'admin_cards' : 'dev_cards'

export const getUsersDatabaseName = () =>
  process.env.APP_ENV === 'production' ? 'admin_mybb' : 'admin_mybb'

export const getPortalDatabaseName = () =>
  process.env.APP_ENV === 'production' ? 'admin_portal' : 'dev_portal'
