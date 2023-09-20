import {
  getPortalDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import { ArgumentParser } from 'argparse'
import SQL, { SQLStatement } from 'sql-template-strings'
import { UsersWithPayments } from './pay-card-creators.d'
import rarityMap from '@constants/rarity-map'

const HALL_OF_FAME_CARD_PAY: number = 750000
const TWO_THOUSAND_CLUB_PAY: number = 500000
const AWARDS_CARD_PAY: number = 500000
const CHARITY_CARD_PAY: number = 500000
const LOGO_CARD_PAY: number = 250000
const MISPRINT_CARD_PAY: number = 250000
const BASE_CARD_PAY: number = 250000

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
  const args = { dryRun: true }
  const finishedAndUnpaidCards = await getFinishedAndUnpaidCards()
  const userPayments = calculateAuthorPayments(finishedAndUnpaidCards)
  await generateUserPayments(userPayments)
  if (!args.dryRun) {
    await setCardsAuthorsPaids()
  }
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

async function getFinishedAndUnpaidCards(): Promise<Card[]> {
  const cards: Card[] = (await queryDatabase<Card>(
    SQL`
      SELECT COUNT(*), author_userID, card_rarity FROM admin_cards.cards
      WHERE approved=1
      AND author_paid=0
      AND image_url IS NOT NULL
      GROUP BY author_userID, card_rarity;
    `
  )) as Card[]

  return cards
}

function calculateAuthorPayments(cardsToPayout: Card[]): UsersWithPayments {
  const usersWithPayments: UsersWithPayments = {}
  cardsToPayout.forEach((cardToPayout: Card) => {
    if (!usersWithPayments[cardToPayout.author_userID]) {
      usersWithPayments[cardToPayout.author_userID] = {
        amountToPayAuthor: 0,
        hallOfFame: 0,
        twoThousandClub: 0,
        awards: 0,
        charity: 0,
        logo: 0,
        misprint: 0,
        base: 0,
      }
    }

    if (cardToPayout.card_rarity === rarityMap.hallOfFame.label) {
      usersWithPayments[cardToPayout.author_userID].hallOfFame += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        HALL_OF_FAME_CARD_PAY
    } else if (cardToPayout.card_rarity === rarityMap.twoThousandClub.label) {
      usersWithPayments[cardToPayout.author_userID].twoThousandClub += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        TWO_THOUSAND_CLUB_PAY
    } else if (cardToPayout.card_rarity === rarityMap.award.label) {
      usersWithPayments[cardToPayout.author_userID].awards += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        AWARDS_CARD_PAY
    } else if (cardToPayout.card_rarity === rarityMap.charity.label) {
      usersWithPayments[cardToPayout.author_userID].charity += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        CHARITY_CARD_PAY
    } else if (cardToPayout.card_rarity === rarityMap.logo.label) {
      usersWithPayments[cardToPayout.author_userID].logo += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        LOGO_CARD_PAY
    } else if (cardToPayout.card_rarity === rarityMap.misprint.label) {
      usersWithPayments[cardToPayout.author_userID].misprint += 1
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        MISPRINT_CARD_PAY
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
  const payments: SQLStatement[] = Object.entries(userPayments).map(
    ([userId, paymentData]): SQLStatement => {
      let isFirstPayment = true
      const description = ''
      if (paymentData.hallOfFame > 0) {
        description.concat(
          generatePayDescription(
            HALL_OF_FAME_CARD_PAY,
            paymentData.hallOfFame,
            'Hall of Fame',
            isFirstPayment
          )
        )
        isFirstPayment = false
      }
      if (paymentData.twoThousandClub > 0) {
        description.concat(
          generatePayDescription(
            TWO_THOUSAND_CLUB_PAY,
            paymentData.twoThousandClub,
            'Two Thousand Club',
            isFirstPayment
          )
        )
        isFirstPayment = false
      }
      if (paymentData.awards > 0) {
        description.concat(
          generatePayDescription(
            AWARDS_CARD_PAY,
            paymentData.awards,
            'Awards',
            isFirstPayment
          )
        )
        isFirstPayment = false
      }
      if (paymentData.charity > 0) {
        description.concat(
          generatePayDescription(
            CHARITY_CARD_PAY,
            paymentData.charity,
            'Charity',
            isFirstPayment
          )
        )
        isFirstPayment = false
      }
      if (paymentData.logo > 0) {
        description.concat(
          generatePayDescription(
            LOGO_CARD_PAY,
            paymentData.logo,
            'Logo',
            isFirstPayment
          )
        )
        isFirstPayment = false
      }
      if (paymentData.misprint > 0) {
        description.concat(
          generatePayDescription(
            MISPRINT_CARD_PAY,
            paymentData.misprint,
            'Misprint',
            isFirstPayment
          )
        )
        isFirstPayment = false
      }
      if (paymentData.base > 0) {
        description.concat(
          generatePayDescription(
            BASE_CARD_PAY,
            paymentData.base,
            'Base',
            isFirstPayment
          )
        )
        isFirstPayment = false
      }

      return SQL`
        INSERT INTO `.append(getPortalDatabaseName())
        .append(SQL`.bankTransactions (uid, status, type, description, amount, submitByID)
        VALUES (${userId}, "completed", "cards", "${description}", ${paymentData.amountToPayAuthor}, 0);
      `)
    }
  )
}

function generatePayDescription(
  payPerCard: number,
  numberOfCards: number,
  cardName: string,
  isFirstPayment: boolean
): string {
  const formatter: Intl.NumberFormat = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
  const formattedPay: string = formatter.format(numberOfCards * payPerCard)
  return `${isFirstPayment ? '-' : ''}${numberOfCards} ${cardName} ${
    numberOfCards > 1 ? 'Cards' : 'Card'
  } $(${formattedPay})`
}
