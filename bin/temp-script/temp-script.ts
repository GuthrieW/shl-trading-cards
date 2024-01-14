#!/usr/bin/env node

import { queryDatabase } from '@pages/api/database/database'
import { readFileSync, writeFileSync } from 'fs'
import SQL from 'sql-template-strings'

void main()
  .then(async () => {
    console.log('Finished creating card data')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  const orginialData = await readFileSync('temp/card-ids.txt')
  const cardIds = orginialData.toString().split('\n')
  const fullData = await Promise.all(
    cardIds.map(async (cardId) => {
      const query = SQL`
        SELECT player_name FROM admin_cards.cards WHERE playerID=${cardId} LIMIT 1;
      `

      const result = await queryDatabase<any>(query)
      console.log('result', result)
      return `${cardId} - ${result[0]?.player_name} - `
    })
  )

  console.log('fullData', fullData)

  await writeFileSync('temp/card-data.txt', fullData.join('\n'))
}
