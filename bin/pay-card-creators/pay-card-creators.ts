#!/usr/bin/env node
import { queryDatabase } from '@pages/api/database/database'
import { ArgumentParser } from 'argparse'
import SQL, { SQLStatement } from 'sql-template-strings'
import rarityMap from '@constants/rarity-map'

type UsersWithPayments = Record<
  string,
  {
    base: number
    logo: number
    awards: number
    hallOfFame: number
    twoThousandClub: number
    misprint: number
    charity: number
    amountToPayAuthor: number
  }
>

type AuthorPayoutForRarity = {
  cardsMade: number
  author_userID: string
  card_rarity: string
}

const HALL_OF_FAME_CARD_PAY: number = 750000
const TWO_THOUSAND_CLUB_PAY: number = 500000
const AWARDS_CARD_PAY: number = 500000
const CHARITY_CARD_PAY: number = 500000
const LOGO_CARD_PAY: number = 250000
const MISPRINT_CARD_PAY: number = 250000
const BASE_CARD_PAY: number = 250000

let parser = new ArgumentParser()

parser.add_argument('--prodRun', {
  action: 'store_true',
  default: false,
})

let args: {
  prodRun?: boolean
} = parser.parse_args()

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
  console.log('args', args)

  const finishedAndUnpaidCards: AuthorPayoutForRarity[] =
    await getFinishedAndUnpaidCards()
  const authorPayments: UsersWithPayments = calculateAuthorPayments(
    finishedAndUnpaidCards
  )
  const paymentQueries: SQLStatement[] =
    await generateUserPayments(authorPayments)

  console.log('paymentQueries', paymentQueries)

  if (args.prodRun) {
    await payAuthors(paymentQueries)
    await setCardsAuthorsPaids()
  }
}

async function payAuthors(paymentQueries: SQLStatement[]): Promise<void> {
  await Promise.all(
    await paymentQueries.map(
      async (paymentQuery) => await queryDatabase(paymentQuery)
    )
  )
}

async function setCardsAuthorsPaids(): Promise<void> {
  await queryDatabase(
    SQL`
      UPDATE admin_cards.cards
      SET author_paid=1
      WHERE approved=1
      AND author_paid=0
      AND image_url IS NOT NULL;
    `
  )
}

async function getFinishedAndUnpaidCards(): Promise<AuthorPayoutForRarity[]> {
  const cards: AuthorPayoutForRarity[] =
    await queryDatabase<AuthorPayoutForRarity>(
      SQL`
        SELECT COUNT(*) as cardsMade, author_userID, card_rarity FROM admin_cards.cards
        WHERE approved=1
        AND author_paid=0
        AND image_url IS NOT NULL
        GROUP BY author_userID, card_rarity;
      `
    )

  return cards
}

function calculateAuthorPayments(
  cardsToPayout: AuthorPayoutForRarity[]
): UsersWithPayments {
  const usersWithPayments: UsersWithPayments = {}
  cardsToPayout.forEach((cardToPayout: AuthorPayoutForRarity) => {
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
      usersWithPayments[cardToPayout.author_userID].hallOfFame +=
        cardToPayout.cardsMade
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        HALL_OF_FAME_CARD_PAY * cardToPayout.cardsMade
    } else if (cardToPayout.card_rarity === rarityMap.twoThousandClub.label) {
      usersWithPayments[cardToPayout.author_userID].twoThousandClub +=
        cardToPayout.cardsMade
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        TWO_THOUSAND_CLUB_PAY * cardToPayout.cardsMade
    } else if (cardToPayout.card_rarity === rarityMap.award.label) {
      usersWithPayments[cardToPayout.author_userID].awards +=
        cardToPayout.cardsMade
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        AWARDS_CARD_PAY * cardToPayout.cardsMade
    } else if (cardToPayout.card_rarity === rarityMap.charity.label) {
      usersWithPayments[cardToPayout.author_userID].charity +=
        cardToPayout.cardsMade
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        CHARITY_CARD_PAY * cardToPayout.cardsMade
    } else if (cardToPayout.card_rarity === rarityMap.logo.label) {
      usersWithPayments[cardToPayout.author_userID].logo +=
        cardToPayout.cardsMade
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        LOGO_CARD_PAY * cardToPayout.cardsMade
    } else if (cardToPayout.card_rarity === rarityMap.misprint.label) {
      usersWithPayments[cardToPayout.author_userID].misprint +=
        cardToPayout.cardsMade
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        MISPRINT_CARD_PAY * cardToPayout.cardsMade
    } else {
      usersWithPayments[cardToPayout.author_userID].base +=
        cardToPayout.cardsMade
      usersWithPayments[cardToPayout.author_userID].amountToPayAuthor +=
        BASE_CARD_PAY * cardToPayout.cardsMade
    }
  })

  return usersWithPayments
}

async function generateUserPayments(
  userPayments: UsersWithPayments
): Promise<SQLStatement[]> {
  return Object.entries(userPayments).map(
    ([userId, paymentData]): SQLStatement => {
      const description: string[] = []
      if (paymentData.hallOfFame > 0) {
        description.push(
          generatePayDescription(
            HALL_OF_FAME_CARD_PAY,
            paymentData.hallOfFame,
            rarityMap.hallOfFame.label
          )
        )
      }
      if (paymentData.twoThousandClub > 0) {
        description.push(
          generatePayDescription(
            TWO_THOUSAND_CLUB_PAY,
            paymentData.twoThousandClub,
            rarityMap.twoThousandClub.label
          )
        )
      }
      if (paymentData.awards > 0) {
        description.push(
          generatePayDescription(
            AWARDS_CARD_PAY,
            paymentData.awards,
            rarityMap.award.label
          )
        )
      }
      if (paymentData.charity > 0) {
        description.push(
          generatePayDescription(
            CHARITY_CARD_PAY,
            paymentData.charity,
            rarityMap.charity.label
          )
        )
      }
      if (paymentData.logo > 0) {
        description.push(
          generatePayDescription(
            LOGO_CARD_PAY,
            paymentData.logo,
            rarityMap.logo.label
          )
        )
      }
      if (paymentData.misprint > 0) {
        description.push(
          generatePayDescription(
            MISPRINT_CARD_PAY,
            paymentData.misprint,
            rarityMap.misprint.label
          )
        )
      }
      if (paymentData.base > 0) {
        description.push(
          generatePayDescription(BASE_CARD_PAY, paymentData.base, 'Base')
        )
      }

      return SQL`
        CALL admin_cards.card_payouts(${userId}, ${description.join('-')}, ${
          paymentData.amountToPayAuthor
        }, 2856);`
    }
  )
}

function generatePayDescription(
  payPerCard: number,
  numberOfCards: number,
  cardName: string
): string {
  const formatter: Intl.NumberFormat = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
  const formattedPay: string = formatter.format(numberOfCards * payPerCard)
  return `${numberOfCards} ${cardName} ${
    numberOfCards > 1 ? 'Cards' : 'Card'
  } (${formattedPay})`
}
