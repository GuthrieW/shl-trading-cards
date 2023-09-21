#!/usr/bin/env node
import { ArgumentParser } from 'argparse'
import SQL, { SQLStatement } from 'sql-template-strings'
import { queryDatabase } from '@pages/api/database/database'
import sortBy from 'lodash/sortBy'

let parser = new ArgumentParser()

parser.addArgument('--prodRun', {
  type: Boolean,
  action: 'storeTrue',
  defaultValue: false,
})

let args: {
  prodRun?: boolean
} = parser.parseArgs()

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
  console.log('args', args)

  const duplicateCardIds: string[] = await getDuplicateCardIds()
  console.log(`${duplicateCardIds.length} duplicate cards found`)
  const { cardIdsToDelete, cardIdsToMoveToMisprint } = await checkShouldDelete(
    duplicateCardIds
  )

  // await moveMisprints(cardIdsToMoveToMisprint, args.prodRun)
  // await deleteDuplicates(cardIdsToDelete, args.prodRun)
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

  console.log('total number of duplictes', duplicatesRows.length)

  const cardIdsToDelete: string[] = []

  await Promise.all(
    await duplicatesRows.map(async (duplicatesRow): Promise<void> => {
      type DuplicateCheck = {
        cardId: string
        image_url: string
        author_userID: string
      }

      const duplicates = (await queryDatabase<DuplicateCheck>(SQL`
        SELECT cardId, image_url, author_userID
        FROM admin_cards.cards
        WHERE player_name=${duplicatesRow.player_name}
          AND teamID=${duplicatesRow.teamID}
          AND playerID=${duplicatesRow.playerID}
          AND card_rarity=${duplicatesRow.card_rarity}
          AND (sub_type=${duplicatesRow.sub_type} OR (sub_type IS NULL AND ${duplicatesRow.sub_type} IS NULL))
          AND position=${duplicatesRow.position}
          AND season=${duplicatesRow.season};
      `)) as DuplicateCheck[]

      const sortedDuplicates = sortBy(duplicates, [
        'image_url',
        'author_userID',
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
  prodRun: boolean
): Promise<void> {
  const updateQueries: SQLStatement[] = cardIds.map(
    (cardId) => SQL`
      UPDATE admin_cards.cards
      SET card_rarity='Misprint'
      WHERE cardID=${cardId};
    `
  )

  console.log('Move Misprints Queries:', JSON.stringify(updateQueries, null, 2))

  if (prodRun) {
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
  prodRun: boolean
): Promise<void> {
  const query: SQLStatement = SQL`
    DELETE FROM admin_cards.cards
    WHERE cardID IN ${cardIds};
  `

  console.log('delete query', query)
  if (prodRun) {
    await queryDatabase(query)
  }
}
