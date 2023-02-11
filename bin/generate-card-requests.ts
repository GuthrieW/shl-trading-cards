#!/usr/bin/env node

import { ArgumentParser } from 'argparse'

let parser = new ArgumentParser()

parser.add_argument('--season', {
  type: Number,
  required: true,
})

let args: {
  season?: number
} = parser.parse_args()

async function main() {
  if (!args.season) {
    throw new Error('Season number required')
  }
}

void main()
  .then(async () => {
    console.log('Finished generating card requests')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(2)
  })
