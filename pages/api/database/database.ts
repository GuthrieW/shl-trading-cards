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

export const queryDatabase = async (query): Promise<any> => {
  try {
    const results = await dbConnection.query(query)
    await dbConnection.end()
    return results
  } catch (error) {
    return { error }
  }
}

export const getCardsDatabaseName = () => {
  return process.env.APP_ENV === 'production' ? 'admin_cards' : 'dev_cards'
}

export const getUsersDatabaseName = () => {
  // TODO: DO NOT MERGE THIS CHANGE
  return process.env.APP_ENV === 'production' ? 'admin_mybb' : 'admin_mybb'
}
