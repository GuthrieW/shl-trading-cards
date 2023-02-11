#!/usr/bin/env node

import { GET } from '@constants/http-methods'
import { ArgumentParser } from 'argparse'
import axios from 'axios'

type PlayerData = {
  id: string
  league: number
  season: number
  name: string
  team: string
  screening: number
  gettingOpen: number
  passing: number
  puckhandling: number
  shootingAccuracy: number
  shootingRange: number
  offensiveRead: number
  checking: number
  hitting: number
  positioning: number
  stickchecking: number
  shotBlocking: number
  faceoffs: number
  defensiveRead: number
  acceleration: number
  agility: number
  balance: number
  speed: number
  stamina: number
  strength: number
  fighting: number
  aggression: number
  bravery: number
  determination: number
  teamPlayer: number
  leadership: number
  temperament: number
  professionalism: number
  position: string
  appliedTPE: number
}

type CardData = {}

let parser = new ArgumentParser()

parser.add_argument('--season', {
  type: Number,
  required: true,
})

let args: {
  season?: number
} = parser.parse_args()

const generateCardData = (players: PlayerData[]): CardData[] => {
  return [{}]
}

const checkCreateNewRequest = () => {}

async function main() {
  if (!args.season) throw new Error('Season number required')

  // players for a season
  const players = await axios({
    method: GET,
    url: `https://index.simulationhockey.com/api/v1/players/ratings?season=${args.season}`,
  })

  if (players.status !== 200) throw new Error('Error fetching players')

  // generate new card information
  const cards: CardData[] = generateCardData(players.data)

  // create a request for all players that don't already have an existing card of the same rarity
}

void main()
  .then(async () => {
    console.log('Finished generating card requests')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })
