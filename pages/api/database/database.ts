import mysql from 'serverless-mysql'

const dbConnection = mysql(
  process.env.NODE_ENV === 'production'
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
)

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
  return process.env.NODE_ENV === 'production' ? 'admin_cards' : 'dev_cards'
}

export const getUsersDatabaseName = () => {
  return process.env.NODE_ENV === 'production' ? 'admin_mybb' : 'dev_bank'
}
