#!/usr/bin/env node
import { ArgumentParser } from 'argparse'
import axios, { AxiosResponse } from 'axios'
import SQL, { SQLStatement } from 'sql-template-strings'
import { queryDatabase } from '@pages/api/database/database'
import { GET } from '@constants/http-methods'
import { DeleteRequest } from './delete-duplicate-cards.d'

let parser = new ArgumentParser()

parser.addArgument('--dryRun', {
  type: Boolean,
  required: true,
})

let args: {
  season: number
  dryRun: boolean
} = parser.parseArgs()

void main()
  .then(async () => {
    console.log('Finished generating card requests')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  if (!args.season) throw new Error('argument --season required')
  if (!args.season) throw new Error('argument --dryRun required')

  const deleteRequests: DeleteRequest[] =
    await checkForDuplicatesAndGenerateDeleteQueries()
  const deleteRequestsResult: string[] = await deleteCards(
    deleteRequests,
    args.dryRun
  )
  console.log(JSON.stringify(deleteRequestsResult, null, 2))
}

/**
 * check for duplicate cards based on
 */
async function checkForDuplicatesAndGenerateDeleteQueries(): Promise<
  DeleteRequest[]
> {
  return null
}

/**
 * send delete requests to the trading cards database
 */
async function deleteCards(
  deleteRequests: DeleteRequest[],
  isDryRun: boolean
): Promise<string[]> {
  const deleteQueries: SQLStatement[] = deleteRequests.map(
    (deleteRequest: DeleteRequest) => {
      return SQL`DELETE FROM admin_cards.cards WHERE cardId=${deleteRequest.cardId};`
    }
  )

  if (isDryRun) {
    console.log(JSON.stringify(deleteQueries, null, 2))
    return ['Dry run finished']
  }

  const results = await Promise.all(
    deleteQueries.map(async (deleteQuery) => await queryDatabase(deleteQuery))
  )
  return results
}
