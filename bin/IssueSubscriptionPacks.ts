import SQL from 'sql-template-strings'
import { queryDatabase } from '../pages/api/database/database'

function issueSubscriptionPacks() {
  const maximumDailyPacks = 3

  const addSubscribedPacksResult = queryDatabase(SQL`
    UPDATE admin_cards.packs_owned,
    SET quantity = quantity + (${maximumDailyPacks} - packs_purchased_today)
    WHERE subscribed != 0;
  `)

  console.log({ addSubscribedPacksResult })

  const resetPackPurchases = queryDatabase(SQL`
    UPDATE admin_cards.packs_owned
    SET packs_purchased_today = 0;
  `)

  console.log({ resetPackPurchases })
}

function main() {
  issueSubscriptionPacks()
}

export default main
