import mysql, { type ServerlessMysql } from 'serverless-mysql'
import { SQLStatement } from 'sql-template-strings'

const initializeDB = (database: string | undefined) =>
  mysql({
    config: {
      host: process.env.DATABASE_HOST,
      database,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
  })

const cardsDb = initializeDB('production' ? 'admin_cards' : 'dev_cards')
const usersDb = initializeDB('admin_mybb')
const portalDb = initializeDB('production' ? 'admin_portal' : 'dev_portal')

const getQueryFn =
  (db: ServerlessMysql) =>
  async <T extends unknown>(
    query: SQLStatement
  ): Promise<T[] | { error: unknown }> => {
    try {
      const result: T[] = await db.query(query)
      await db.end()
      return result
    } catch (error) {
      return { error }
    }
  }

export const queryCards = getQueryFn(cardsDb)
export const queryUsers = getQueryFn(usersDb)
export const queryPortal = getQueryFn(portalDb)
