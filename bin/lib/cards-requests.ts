import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/_old/api/database/database'
import { writeFileSync } from 'fs'
import SQL, { SQLStatement } from 'sql-template-strings'

export async function requestCards(
  cardRequests: CardRequest[],
  isProdRun: boolean
): Promise<any> {
  const requestResults = await Promise.all(
    await cardRequests.map(async (cardRequest) => {
      const insertQuery: SQLStatement = SQL`
        INSERT INTO `.append(getCardsDatabaseName()).append(`.cards
          (player_name, teamID, playerID, card_rarity, sub_type, pullable, approved, position, overall, high_shots, low_shots, quickness, control, conditioning, skating, shooting, hands, checking, defense, season, author_paid)
        VALUES ("${cardRequest.player_name.trim()}", ${cardRequest.teamID}, ${
          cardRequest.playerID
        }, "${cardRequest.card_rarity}", ${cardRequest.sub_type}, 0, 0, "${
          cardRequest.position
        }", ${cardRequest.overall}, ${cardRequest.high_shots}, ${
          cardRequest.low_shots
        }, ${cardRequest.quickness}, ${cardRequest.control}, ${
          cardRequest.conditioning
        }, ${cardRequest.skating}, ${cardRequest.shooting}, ${
          cardRequest.hands
        }, ${cardRequest.checking}, ${cardRequest.defense}, ${
          cardRequest.season
        }, 0);`)

      if (isProdRun) {
        return await queryDatabase(insertQuery)
      } else {
        return insertQuery
      }
    })
  )

  await writeFileSync('temp/card-requests.txt', JSON.stringify(requestResults))
  console.log(
    isProdRun
      ? `Prod run finished. ${requestResults.length} cards inserted`
      : 'Dry run finished'
  )
  return
}
