#!/usr/bin/env node

import {
  getCardsDatabaseName,
  queryDatabase,
} from '@pages/api/database/database'
import SQL from 'sql-template-strings'

type DistributionData = {
  userID: number
  cardID: number
}

const CharityData: DistributionData[] = [
  // { userID: 7292, cardID: 7919 }, // PapaSorin
  // { userID: 4060, cardID: 7920 }, // charlieconway
  // { userID: 4065, cardID: 7921 }, // puolivalmiste
  // { userID: 7575, cardID: 7952 }, // RaidTheArcade
  // { userID: 5786, cardID: 7922 }, // mer
  // { userID: 4521, cardID: 7923 }, // Lime
  // { userID: 5784, cardID: 7924 }, // CapnCooper
  // { userID: 2689, cardID: 7925 }, // trella
  // { userID: 4097, cardID: 7926 }, // Rankle
  // { userID: 7282, cardID: 7953 }, // Pyro182
  // { userID: 504, cardID: 7927 }, // OrbitingDeath
  // { userID: 1171, cardID: 7928 }, // micool132
  // { userID: 7594, cardID: 7951 }, // MrPresident
  // { userID: 1662, cardID: 7929 }, // enigmatic
  // { userID: 4880, cardID: 7930 }, // SFresh3
  // { userID: 7737, cardID: 7957 }, // Shiamus
  // { userID: 4410, cardID: 7931 }, // jeffie43
  // { userID: 5468, cardID: 7932 }, // By-Tor
  // { userID: 5632, cardID: 7933 }, // the5urreal
  // { userID: 4990, cardID: 7934 }, // Keven
  // { userID: 3892, cardID: 7935 }, // C9Van
  // { userID: 7629, cardID: 7954 }, // oknom
  // { userID: 2554, cardID: 7936 }, // DrunkenTeddy
  // { userID: 3723, cardID: 7937 }, // Carpy48
  // { userID: 3309, cardID: 7938 }, // hhh81
  // { userID: 1842, cardID: 7939 }, // Rich
  // { userID: 4543, cardID: 7940 }, // boom
  // { userID: 2222, cardID: 7941 }, // Wally
  // { userID: 4435, cardID: 7942 }, // sve7en
  // { userID: 6499, cardID: 7943 }, // lore
  // { userID: 6690, cardID: 7944 }, // Seany148
  // { userID: 4476, cardID: 7945 }, // Rangerjase
  // { userID: 5684, cardID: 7946 }, // Aleris
  // { userID: 3103, cardID: 7947 }, // luke
  // { userID: 6000, cardID: 7948 }, // RAmenAmen
  // { userID: 4726, cardID: 7949 }, // Reno
  // { userID: 7595, cardID: 7955 }, // fubaguy
  // { userID: 5794, cardID: 7950 }, // RashfordU
  // { userID: 3684, cardID: 7956 }, // sköldpaddor
  // { userID: 6469, cardID: 7968 }, // NYR73
]

void main()
  .then(async () => {
    console.log('Finished distributing charity cards')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  await Promise.all(
    CharityData.map(async (charityData: DistributionData) => {
      await queryDatabase(
        SQL`
        INSERT INTO `.append(getCardsDatabaseName()).append(SQL`.collection
          (userID, cardID, packID)
        VALUES
          (${charityData.userID}, ${charityData.cardID}, -1);
      `)
      )
    })
  )
}
