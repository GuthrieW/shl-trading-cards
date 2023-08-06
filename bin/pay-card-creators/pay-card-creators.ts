import { queryDatabase } from '@pages/api/database/database'
import { ArgumentParser } from 'argparse'
import SQL from 'sql-template-strings'
import fs from 'fs'
import { UsersWithPayments } from './pay-card-creators.d'
import rarityMap from '@constants/rarity-map'

const BASE_CARD_PAY: number = 250000
const AWARDS_CARD_PAY: number = 500000
const HALL_OF_FAME_CARD_PAY: number = 750000

let parser = new ArgumentParser()

parser.addArgument('--dryRun', {
  type: Boolean,
  required: true,
})

let args: {
  dryRun?: boolean
} = parser.parseArgs()

void main()
  .then(async () => {
    console.log('Finished paying card creators')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  if (!args.dryRun) throw new Error('argument --dryRun required')

  const finishedAndUnpaidCards = await getFinishedAndUnpaidCards()
  const userPayments = calculateAuthorPayments(finishedAndUnpaidCards)
  await generateUserPayments(userPayments)
  if (!args.dryRun) {
    await setCardsAuthorsPaids()
  }
}

async function getFinishedAndUnpaidCards(): Promise<Card[]> {
  const cards: Card[] = await queryDatabase(
    SQL`
    SELECT COUNT(*), author_userID, card_rarity FROM admin_cards.cards
    WHERE approved=1
    AND author_paid=0
    AND image_url IS NOT NULL
    GROUP BY author_userID, card_rarity;`
  )

  return cards
}

function calculateAuthorPayments(cardsToPayout: Card[]): UsersWithPayments {
  const usersWithPayments: UsersWithPayments = {}
  cardsToPayout.forEach((cardToPayout: Card) => {
    if (!usersWithPayments[cardToPayout.author_userID]) {
      usersWithPayments[cardToPayout.author_userID] = {
        base: 0,
        awards: 0,
        hallOfFame: 0,
        amountToPayAuthor: 0,
      }
    }

    if (cardToPayout.card_rarity === rarityMap.hallOfFame.label) {
      usersWithPayments[cardToPayout.author_userID].hallOfFame += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        HALL_OF_FAME_CARD_PAY
    } else if (
      cardToPayout.card_rarity === rarityMap.award.label ||
      cardToPayout.card_rarity === rarityMap.twoThousandClub.label
    ) {
      usersWithPayments[cardToPayout.author_userID].awards += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        AWARDS_CARD_PAY
    } else {
      usersWithPayments[cardToPayout.author_userID].base += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        BASE_CARD_PAY
    }
  })

  return usersWithPayments
}

async function generateUserPayments(
  userPayments: UsersWithPayments
): Promise<void> {
  const paymentOutput = ''
  Object.entries(userPayments).forEach(([userId, paymentData]) => {
    paymentOutput.concat(
      `UserID: ${userId}\nBase Cards: ${paymentData.base} ($${
        paymentData.base * BASE_CARD_PAY
      })\nAwards Cards: ${paymentData.awards} ($${
        paymentData.awards * AWARDS_CARD_PAY
      })\nHall of Fame Cards: ${paymentData.hallOfFame} ($${
        paymentData.hallOfFame * HALL_OF_FAME_CARD_PAY
      })\n--------------------------------\n\n`
    )
  })

  try {
    await fs.writeFileSync(
      `./payouts-${new Date().toJSON()}.txt`,
      paymentOutput
    )
  } catch (err) {
    console.log(err)
  }
  return
}

async function setCardsAuthorsPaids(): Promise<void> {
  await queryDatabase(
    SQL`
    UPDATE admin_cards.cards
    SET author_paid=1
    WHERE approved=1
    AND author_paid=0
    AND image_url IS NOT NULL;`
  )

  return
}
