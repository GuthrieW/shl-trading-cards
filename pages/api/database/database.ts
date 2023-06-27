import mysql from 'serverless-mysql'

const config =
  process.env.APP_ENV === 'production'
    ? {
        config: {
          host: process.env.DATABASE_HOST,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
        },
      }
    : {
        config: {
          host: process.env.DEV_DATABASE_HOST,
          user: process.env.DEV_DATABASE_USER,
          password: process.env.DEV_DATABASE_PASSWORD,
          database: process.env.DEV_DATABASE_NAME,
        },
      }

console.log('env', process.env.APP_ENV, 'config', config)

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
