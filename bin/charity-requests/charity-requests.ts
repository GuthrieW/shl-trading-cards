#!/usr/bin/env node
import rarityMap from '@constants/rarity-map'
import { queryDatabase } from '@pages/api/database/database'
import { requestCards } from 'bin/base-requests/base-requests'
import { readFileSync } from 'fs'
import SQL from 'sql-template-strings'

void main()
  .then(async () => {
    console.log('Finished creating charity card requests')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  const args = { prodRun: false }
  console.log('args', args)
  const charityCardCsv = await readFileSync('temp/create-charity-card-ids.csv')
  const charityCardData = charityCardCsv.toString().split('\n')
  console.log('charityCardData', charityCardData)
  const charityCardsToAdd = await Promise.all(
    charityCardData.map(async (data, index): Promise<CardRequest> => {
      if (index === 0) {
        return null
      }

      const cardName = data.split(',')[1]
      console.log('cardName', cardName)
      const query = SQL`
        SELECT * FROM admin_cards.cards 
        WHERE player_name=${cardName}
        AND (card_rarity='Bronze' OR card_rarity='Silver' OR card_rarity='Gold' OR card_rarity='Ruby' OR card_rarity='Diamond')
        ORDER BY overall DESC
        LIMIT 1;
      `

      const result = await queryDatabase<any>(query)
      let player = result[0] as Card

      if (!player) {
        console.error(`Existing card not found for ${cardName}`)
        return null
      }
      const newCardBase: CardRequest = {
        teamID: player.teamID,
        playerID: player.playerID,
        player_name: player.player_name,
        season: player.season,
        card_rarity: rarityMap.charity.label,
        sub_type: null,
        position: player.position,
        overall: null,
        skating: null,
        shooting: null,
        hands: null,
        checking: null,
        defense: null,
        high_shots: null,
        low_shots: null,
        quickness: null,
        control: null,
        conditioning: null,
      }
      if (player.position === 'F' || player.position === 'D') {
        return {
          ...newCardBase,
          overall: max99(player.overall + 5),
          skating: max99(player.skating + 1),
          shooting: max99(player.shooting + 1),
          hands: max99(player.hands + 1),
          checking: max99(player.checking + 1),
          defense: max99(player.defense + 1),
        }
      } else {
        return {
          ...newCardBase,
          overall: max99(player.overall + 5),
          high_shots: max99(player.high_shots + 1),
          low_shots: max99(player.low_shots + 1),
          quickness: max99(player.quickness + 1),
          control: max99(player.control + 1),
          conditioning: max99(player.conditioning + 1),
        }
      }
    })
  )

  const charityCardsToAddWithoutMinorsPlayers = charityCardsToAdd.filter(
    (cardRequest) => !!cardRequest
  )

  await requestCards(charityCardsToAddWithoutMinorsPlayers, args.prodRun)
}

function max99(val: number): number {
  return val > 99 ? 99 : val
}
