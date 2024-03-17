#!/usr/bin/env node
import { POST } from '@constants/http-methods'
import axios from 'axios'

void main()
  .then(async () => {
    console.log('Finished converting PNG to WEBP')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  const result = await axios({
    method: POST,
    url: 'https://cards.simulationhockey.com/api/v2/cards/fix',
  })

  console.log('result', result)
}
