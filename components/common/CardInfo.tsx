import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { iihfTeamsMap, shlTeamMap } from '@constants/teams-map'
import { indexAxios, query } from '@pages/api/database/query'
import { Team } from '@pages/api/v3'

export const generateCardTooltipContent = (card: Card, teamData: Team[]) => {
  const teamInfo = teamData[card.teamID]
  const award_rarity =
    card.card_rarity === 'Awards'
      ? `Awards - ${card.sub_type}`
      : card.card_rarity

  const basicInfo = `
${card.player_name}
Rarity: ${award_rarity} | Pos: ${card.position}
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

  return (
    <div className="pt-2">
      <Button
        className="bg-primary text-secondary"
        onClick={() => setIsVisible(!isVisible)}
      >
        Show Card Info
      </Button>
      {isVisible && !teamDataIsLoading && (
        <pre className="whitespace-pre-wrap break-words font-mono mt-2 sm:mt-4 lg:mt-6">
          {generateCardTooltipContent(card, teamData)}
        </pre>
      )}
    </div>
  )
}
