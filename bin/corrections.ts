#!/usr/bin/env node
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'
import { cardsQuery } from '@pages/api/database/database'
import SQL from 'sql-template-strings'

const playerIdIndex = 1 as const
const cardRarityIndex = 5 as const
const cardSubTypeIndex = 6 as const
const seasonIndex = 4 as const
const positionIndex = 19 as const
const overallIndex = 20 as const
const defenseIndex = 25 as const

void main()
  .then(async () => {
    console.log('Finished correcting cards')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function processFile<T>(): Promise<T[]> {
  const records = []
  const parser = createReadStream(`${__dirname}/temp.csv`).pipe(parse({}))
  for await (const record of parser) {
    if (record[positionIndex] || record[overallIndex] || record[defenseIndex]) {
      records.push({
        playerId: record[playerIdIndex],
        rarity: record[cardRarityIndex],
        subType: record[cardSubTypeIndex],
        season: record[seasonIndex],
        position: record[positionIndex],
        overall: record[overallIndex],
        defense: record[defenseIndex],
      })
    }
  }
  records.shift()
  return records
}

async function main() {
  const records = await processFile<{
    playerId: number
    rarity: string
    subType: string
    season: number
    position: string
    overall: number
    defense: number
  }>()
  await Promise.all(
    records.map(async (record, index) => {
      const query = SQL`SELECT cardID, player_name, sub_type FROM cards WHERE playerID=${record.playerId} AND card_rarity=${record.rarity} AND sub_type=${record.subType}`
      const result = await cardsQuery(query)
      if (result.length > 1) {
        console.info(result.length, result)
      }
    })
  )
}
