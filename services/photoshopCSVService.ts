import { allTeamsMaps } from '@constants/teams-map'

const emptyTeamFlags = Object.fromEntries(
  Object.values(allTeamsMaps)
    .filter((t) => t.league === 'SHL')
    .map((t) => [t.abbreviation, false])
) as Record<string, boolean>

export function createPhotoshopCsv(
  cardRequests: CardRequest[]
): Photoshopcsv[] {
  return cardRequests.map((cardRequest) => {
    const [firstName, ...rest] = cardRequest.player_name.split(' ')
    const lastName = rest.join(' ')

    const team = Object.values(allTeamsMaps).filter((t) => t.league === 'SHL')[
      cardRequest.teamID.toString()
    ]
    const teamAbbr = team?.abbreviation
    const teamFlags = { ...emptyTeamFlags }
    if (teamAbbr) {
      teamFlags[teamAbbr] = true
    }

    const rarityFlags: Record<string, boolean> = {
      bronze: false,
      silver: false,
      gold: false,
      ruby: false,
      diamond: false,
    }

    const rarityKey = cardRequest.card_rarity.toLowerCase()
    if (rarityKey in rarityFlags) {
      rarityFlags[rarityKey] = true
    }

    return {
      firstName,
      lastName,
      render: null,
      position: cardRequest.position,
      skater: cardRequest.position !== 'G',
      goalie: cardRequest.position === 'G',
      ...teamFlags,
      OA: cardRequest.overall,
      season: cardRequest.season,
      ...rarityFlags,
      SKTHGH: cardRequest.skating ?? cardRequest.high_shots,
      SHTLOW: cardRequest.shooting ?? cardRequest.low_shots,
      HNDQCK: cardRequest.hands ?? cardRequest.quickness,
      CHKCTL: cardRequest.checking ?? cardRequest.control,
      DEFCND: cardRequest.defense ?? cardRequest.conditioning,
    } as Photoshopcsv
  })
}
