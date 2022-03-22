import SQL from 'sql-template-strings'
import { queryDatabase } from '../pages/api/database/database'

function issueSubscriptionPacks() {
  const maximumDailyPacks = 3
  // const maximumDailyPacks = queryDatabase(SQL`
  //   SELECT maximum_packs
  //   FROM admin_cards.constants;
  // `)

  const updateSubscribedUsers = queryDatabase(SQL`
    UPDATE admin_cards.packs_owned,
    SET base_quantity = base_quantity + (${maximumDailyPacks} - packs_purchased_today), packs_purchased_today = 3
    WHERE subscribed = 1;
  `)

  console.log({ updateSubscribedUsers })

  const updateUnsubscribedUsers = queryDatabase(SQL`
    UPDATE admin_cards.packs_owned,
    SET packs_purchased_today = 0
    WHERE subscribed = 0;
  `)

  console.log({ updateUnsubscribedUsers })
}

function main() {
  issueSubscriptionPacks()
}

export default main
