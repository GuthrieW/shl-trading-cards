#!/usr/bin/env node
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'

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
    records.push(record)
  }
  return records
}

async function main() {
  const records = await processFile<{
    cardID: number
    newOverall: number
    newDefense: number
  }>()
  await Promise.all(
    records.map(async (record) => {
      return
    })
  )
  console.info(records)
}
