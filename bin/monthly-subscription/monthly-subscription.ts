#!/usr/bin/env node
import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import dayjs from 'dayjs'
import { packService } from 'services/packService'
import SQL from 'sql-template-strings'

void main()
  .then(async () => {
    console.log('Finished distributing monthly subscriptions')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

type SubscriptionUser = {
  uid: number
  subscription: number
}

async function main() {
  const subscribedUsers = await queryDatabase<SubscriptionUser>(
    SQL`
    SELECT uid
    FROM `.append(getCardsDatabaseName()).append(SQL`.monthly_subscriptions
    WHERE subscription > 0;
  `)
  )

  console.log('Users to distribute to: ', JSON.stringify(subscribedUsers))

  await Promise.all(
    await subscribedUsers.map(async (subscribedUser: SubscriptionUser) => {
      console.log(`Distributing packs for user ${subscribedUser.uid}`)

      for (let i = 0; i < 10; i++) {
        await queryDatabase(
          SQL`
          INSERT INTO `.append(getCardsDatabaseName()).append(SQL`.packs_owned
            (userID, packType, source)
          VALUES
            (${subscribedUser.uid}, ${
              packService.packs.base.id
            }, ${`Monthly Subscription ${dayjs(new Date()).format(
              'MMMM YYYY'
            )}`});
          `)
        )
      }

      console.log(`Finished distributing packs for user ${subscribedUser.uid}`)
    })
  )

  console.log('Finished distributing packs')
}
