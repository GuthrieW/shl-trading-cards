import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'
import { iihfTeamsMap, shlTeamMap } from '@constants/teams-map'

export const generateCardTooltipContent = (card: Card) => {
  const league = card.card_rarity === 'IIHF Awards' ? 'IIHF' : 'SHL'
  const teamMap = league === 'IIHF' ? iihfTeamsMap : shlTeamMap
  const teamInfo = teamMap[card.teamID] || { label: 'Unknown Team' }
  const award_rarity =
    card.card_rarity === 'Awards'
      ? `Awards - ${card.sub_type}`
      : card.card_rarity

  const basicInfo = `
${card.player_name}
Rarity: ${award_rarity} | Pos: ${card.position}
Season: ${card.season} | Overall: ${card.overall}
Team: ${teamInfo.label} (${teamInfo.abbreviation})
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

  return (
    <div className="pt-2">
      <Button
        className="bg-primary text-secondary"
        onClick={() => setIsVisible(!isVisible)}
      >
        Show Card Info
      </Button>
      {isVisible && (
        <pre className="whitespace-pre-wrap break-words font-mono mt-2 sm:mt-4 lg:mt-6">
          {generateCardTooltipContent(card)}
        </pre>
      )}
    </div>
  )
}
