import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { indexAxios, query } from '@pages/api/database/query'
import { PortalInfo, Team } from '@pages/api/v3'
import axios from 'axios'

export const generateCardTooltipContent = (
  card: Card,
  teamData: Team[],
  portalInfo: PortalInfo
) => {
  const teamInfo = teamData.find((t) => t.id === card.teamID)
  const portalPlayer = portalInfo?.[0]

  const portalGenInfo = portalPlayer
    ? `Jersey Num: ${portalPlayer.jerseyNumber}\n    Render: ${portalPlayer.render}`
    : `No Jersey Found | ${card.render_name}`
  const award_rarity =
    card.card_rarity === 'Awards'
      ? `Awards - ${card.sub_type}`
      : card.card_rarity

  const basicInfo = `
    ${card.player_name}
    ${portalGenInfo}
    Rarity: ${award_rarity} 
    Pos: ${card.position}
    Season: ${card.season} | Overall: ${card.overall}
    Team: ${teamInfo.name} (${teamInfo.abbreviation})
      `.trim()

  let positionSkills = ``

  if (card.position === 'G') {
    positionSkills += `HGH: ${card.high_shots} | LOW: ${card.low_shots} | QCK: ${card.quickness} | CTL: ${card.control} | CND: ${card.conditioning}`
  } else {
    positionSkills += `SKT: ${card.skating} | SHT: ${card.shooting} | HND: ${card.hands} | CHK: ${card.checking} | DEF: ${card.defense}`
  }

  return `${basicInfo}\n${positionSkills}`
}

export const CardInfo = ({ card }: { card: Card }) => {
  const [isVisible, setIsVisible] = useState(true)

  const { payload: teamData, isLoading: teamDataIsLoading } = query<Team[]>({
    queryKey: ['teamData', String(card.leagueID)],
    queryFn: () =>
      indexAxios({
        method: 'GET',
        url: `/api/v1/teams?league=${card.leagueID}`,
      }),
  })

  const { payload: portalInfo, isLoading: portalInfoIsLoading } =
    query<PortalInfo>({
      queryKey: ['portalInfo', String(card.leagueID), String(card.playerID)],
      queryFn: () =>
        axios({
          method: 'GET',
          url: `/api/v3/cards/portalInfo?leagueID=${card.leagueID}&playerID=${card.playerID}`,
        }),
    })

  return (
    <div className="pt-2">
      <Button
        className="bg-primary text-secondary"
        onClick={() => setIsVisible(!isVisible)}
      >
        Show Card Info
      </Button>
      {isVisible && !teamDataIsLoading && !portalInfoIsLoading && (
        <pre className="whitespace-pre-wrap break-words font-mono mt-2 sm:mt-4 lg:mt-6">
          {generateCardTooltipContent(card, teamData, portalInfo)}
        </pre>
      )}
    </div>
  )
}
