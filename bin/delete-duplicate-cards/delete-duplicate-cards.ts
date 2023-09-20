#!/usr/bin/env node
import { ArgumentParser } from 'argparse'
import SQL, { SQLStatement } from 'sql-template-strings'
import { queryDatabase } from '@pages/api/database/database'
import sortBy from 'lodash/sortBy'

void main()
  .then(async () => {
    console.log('Finished deleting cards')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  const args = { dryRun: true }
  console.log('args', args)

  const duplicateCardIds: string[] = await getDuplicateCardIds()
  console.log(`${duplicateCardIds.length} duplicate cards found`)
  const { cardIdsToDelete, cardIdsToMoveToMisprint } = await checkShouldDelete(
    duplicateCardIds
  )

  console.log('cardIdsToDelete', cardIdsToDelete)
  console.log('cardIdsToMoveToMisprint', cardIdsToMoveToMisprint)

  await moveMisprints(cardIdsToMoveToMisprint, args.dryRun)
  await deleteDuplicates(cardIdsToDelete, args.dryRun)
}

/**
 * check for duplicate cards based on
 */
async function getDuplicateCardIds(): Promise<string[]> {
  type DuplicateCard = {
    player_name: string
    teamID: string
    playerID: string
    card_rarity: string
    sub_type: string
    position: string
    season: string
    c: number
  }

  const duplicatesRows = (await queryDatabase<DuplicateCard>(SQL`
    SELECT player_name, teamID, playerID, card_rarity, sub_type, position, season, count(*) as c
    FROM admin_cards.cards
    GROUP BY player_name, teamID, playerID, card_rarity, sub_type, position, season
    HAVING c > 1;
  `)) as DuplicateCard[]

  const cardIdsToDelete: string[] = []

  await Promise.all(
    await duplicatesRows.map(async (duplicatesRow): Promise<void> => {
      type DuplicateCheck = {
        cardId: string
        image_url: string
        author_userID: string
        overall: number
      }

      const duplicates = (await queryDatabase<DuplicateCheck>(SQL`
        SELECT cardId, image_url, author_userID, overall
        FROM admin_cards.cards
        WHERE player_name=${duplicatesRow.player_name}
          AND teamID=${duplicatesRow.teamID}
          AND playerID=${duplicatesRow.playerID}
          AND card_rarity=${duplicatesRow.card_rarity}
          AND sub_type=${duplicatesRow.sub_type}
          AND position=${duplicatesRow.position}
          AND season=${duplicatesRow.season};
      `)) as DuplicateCheck[]

      const sortedDuplicates = sortBy(duplicates, [
        'image_url',
        'author_userID',
        'overall',
      ])

      sortedDuplicates.shift()

      cardIdsToDelete.push(
        ...sortedDuplicates.map((duplicate) => duplicate.cardId)
      )
    })
  )

  return cardIdsToDelete
}

/**
 * set cards that should not be deleted to be moved to a misprints array and the rest to a delete array
 */
async function checkShouldDelete(
  cardIdsToCheck: string[]
): Promise<{ cardIdsToDelete: string[]; cardIdsToMoveToMisprint: string[] }> {
  const cardIdsToDelete: string[] = []
  const cardIdsToMoveToMisprint: string[] = []

  await Promise.all(
    await cardIdsToCheck.map(async (cardId: string) => {
      const foundInCollection = await queryDatabase(SQL`
        SELECT count(*) as existingCards
        FROM admin_cards.collection
        WHERE cardID=${cardId};
    `)

      console.log('existingCards', foundInCollection[0].existingCards)

      foundInCollection[0]?.existingCards > 0
        ? cardIdsToMoveToMisprint.push(cardId)
        : cardIdsToDelete.push(cardId)
    })
  )

  return { cardIdsToDelete, cardIdsToMoveToMisprint }
}

/**
 * set the cards with the given cardIDs to be misprints
 */
async function moveMisprints(
  cardIds: string[],
  dryRun: boolean
): Promise<void> {
  const updateQueries: SQLStatement[] = cardIds.map(
    (cardId) => SQL`
      UPDATE admin_cards.cards
      SET card_rarity='Misprint'
      WHERE cardID=${cardId};
    `
  )

  console.log('Move Misprints Queries:', JSON.stringify(updateQueries, null, 2))

  if (!dryRun) {
    await Promise.all(
      await updateQueries.map(async (query) => await queryDatabase(query))
    )
  }
}

/**
 * delete the cards with the given cardIDs
 */
async function deleteDuplicates(
  cardIds: string[],
  dryRun: boolean
): Promise<void> {
  const deleteQueries: SQLStatement[] = cardIds.map(
    (cardId) => SQL`
      DELETE FROM admin_cards.cards
      WHERE cardId=${cardId};`
  )

  console.log('Delete Queries:', JSON.stringify(deleteQueries, null, 2))

  if (!dryRun) {
    await Promise.all(
      await deleteQueries.map(async (query) => await queryDatabase(query))
    )
  }
}
