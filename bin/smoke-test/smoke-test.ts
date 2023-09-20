#!/usr/bin/env node
import { ArgumentParser } from 'argparse'
import { queryDatabase } from '../../pages/api/database/database'
import axios, { AxiosResponse } from 'axios'
import { GET } from '@constants/http-methods'
import SQL from 'sql-template-strings'

void main()
  .then(async () => {
    console.log('Finished smoke test')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  const indexResult: AxiosResponse<any, any> = await axios({
    method: GET,
    url: 'https://index.simulationhockey.com/api/v1/players/ratings',
  })
  console.log('indexResult', indexResult.data.length)

  const databaseResult = await queryDatabase(SQL`
    SELECT count(*) AS amount
    FROM admin_cards.cards
    WHERE player_name='Tomas Zadina';
  `)
  console.log('cardsDbResult', databaseResult)
}
