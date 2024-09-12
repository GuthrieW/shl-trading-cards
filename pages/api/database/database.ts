import mysql, { ServerlessMysql } from 'serverless-mysql'
import { SQLStatement } from 'sql-template-strings'

const initializeDB = (database: string | undefined) =>
  mysql({
    config: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database,
    },
  })

const cardsDatabase = initializeDB(
  process.env.APP_ENV === 'production' ? 'admin_cards' : 'dev_cards'
)

const usersDatabase = initializeDB(
  process.env.APP_ENV === 'production' ? 'admin_mybb' : 'admin_testdb'
)

const portalDatabase = initializeDB(
  process.env.APP_ENV === 'production' ? 'admin_portal' : 'dev_portal'
)

const getQueryFn =
  (db: ServerlessMysql) =>
  async <T extends unknown>(
    query: SQLStatement
  ): Promise<T[] | { error: unknown }> => {
    try {
      const results: T[] = await db.query(query)
      await db.end()
      return results
    } catch (error) {
      return { error }
    }
  }

export const cardsQuery = getQueryFn(cardsDatabase)

export const usersQuery = getQueryFn(usersDatabase)

export const portalQuery = getQueryFn(portalDatabase)

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
  console.log('you need to populate the db config with connection information')
  config = {
    config: {
      host: '',
      user: '',
      password: '',
      database: '',
    },
  }
}

console.log('env', process.env.APP_ENV)
process.env.APP_ENV !== 'production'
  ? console.log('dbconfig', config)
  : console.log('dbconfig', 'production')

const dbConnection = mysql(config)

/**
 * @deprecated
 */
export async function queryDatabase<T>(query): Promise<T[]> {
  try {
    const results: T[] = await dbConnection.query(query)
    await dbConnection.end()
    return results
  } catch (error) {
    console.log('error', error)
    return []
  }
}

/**
 * @deprecated
 */
export const getCardsDatabaseName = () =>
  process.env.APP_ENV === 'production' || 'script' ? 'admin_cards' : 'dev_cards'

/**
 * @deprecated
 */
export const getUsersDatabaseName = () =>
  process.env.APP_ENV === 'production' ? 'admin_mybb' : 'admin_mybb'

/**
 * @deprecated
 */
export const getPortalDatabaseName = () =>
  process.env.APP_ENV === 'production' ? 'admin_portal' : 'dev_portal'
