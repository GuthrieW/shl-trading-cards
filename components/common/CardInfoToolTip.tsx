import React from 'react'
import { Tooltip } from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'
import { iihfTeamsMap, shlTeamMap } from '@constants/teams-map'

export const generateCardTooltipContent = (card: Card) => {
  const league = card.card_rarity === 'IIHF Awards' ? 'IIHF' : 'SHL'
  const teamMap = league === 'IIHF' ? iihfTeamsMap : shlTeamMap
  const teamInfo = teamMap[card.teamID] || { label: 'Unknown Team' }

  const basicInfo = `
${card.player_name}
Rarity: ${card.card_rarity} | Pos: ${card.position}
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

export const CardInfoTooltip = ({ card }: { card: Card }) => {
  return (
    <Tooltip
      label={generateCardTooltipContent(card)}
      placement="top"
      shouldWrapChildren
      whiteSpace="pre-line"
    >
      <InfoIcon className="text-primary cursor-pointer" />
    </Tooltip>
  )
}
