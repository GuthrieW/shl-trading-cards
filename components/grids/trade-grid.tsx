import DropdownWithCheckboxGroup from '@components/dropdowns/dropdown-with-checkbox-group'
import TradingCard from '@components/images/trading-card'
import SearchBar from '@components/inputs/search-bar'
import pathToCards from '@constants/path-to-cards'
import rarityMap from '@constants/rarity-map'
import teamsMap from '@constants/teams-map'
import React, { useMemo, useState, useRef, useCallback } from 'react'
import { useVirtual } from 'react-virtual'

type TradeGridProps = {
  gridData: TradeCard[]
  onSelect: (cardToToggle: TradeCard, isCurrentUser: boolean) => void
  isCurrentUser: boolean
}

const TradeGrid = ({ gridData, onSelect, isCurrentUser }: TradeGridProps) => {
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const parentRef = useRef()

  const data = useMemo(() => {
    const lowerCaseSearchString = searchString.toLowerCase()

    return gridData
      .filter((card) => {
        const lowerCaseCardName = card.player_name.toLowerCase()
        return (
          lowerCaseCardName.includes(lowerCaseSearchString) ||
          card.player_name.includes(searchString)
        )
      })
      .filter((card) => {
        return (
          selectedRarities.length === 0 ||
          selectedRarities.includes(card.card_rarity)
        )
      })
      .filter((card) => {
        return (
          selectedTeams.length === 0 ||
          selectedTeams.includes(card.teamID.toString())
        )
      })
  }, [gridData, searchString, selectedRarities, selectedTeams])

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      return b.overall - a.overall
    })
  }, [data])

  const rowVirtualization = useVirtual({
    size: data.length,
    overscan: 10,
    parentRef,
    estimateSize: useCallback(() => 35, []),
  })

  const handleUpdateSearchString = (event) =>
    setSearchString(event.target.value || '')

  const updateSelectedRarityButtonIds = (toggleId) =>
    selectedRarities.includes(toggleId)
      ? setSelectedRarities(
          selectedRarities.filter((rarity) => rarity != toggleId)
        )
      : setSelectedRarities(selectedRarities.concat(toggleId))

  const updateSelectedTeamButtonIds = (toggleId) =>
    selectedTeams.includes(toggleId)
      ? setSelectedTeams(selectedTeams.filter((team) => team != toggleId))
      : setSelectedTeams(selectedTeams.concat(toggleId))

  const playerCardRarityCheckboxes: CollectionTableButtons[] = Object.values(
    rarityMap
  ).map((rarity) => {
    return {
      id: rarity.label,
      text: rarity.label === 'Hall of Fame' ? 'HOF' : rarity.label,
      onClick: () => updateSelectedRarityButtonIds(rarity.label),
    }
  })

  const teamCheckboxes: CollectionTableButtons[] = Object.keys(teamsMap).map(
    (key) => {
      return {
        id: key,
        text: teamsMap[key].abbreviation,
        onClick: () => updateSelectedTeamButtonIds(key),
      }
    }
  )

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex justify-between items-center">
        <div className="flex">
          <DropdownWithCheckboxGroup
            title="Rarity"
            checkboxes={playerCardRarityCheckboxes}
            selectedCheckboxIds={selectedRarities}
          />
          <DropdownWithCheckboxGroup
            title="Team"
            checkboxes={teamCheckboxes}
            selectedCheckboxIds={selectedTeams}
          />
        </div>
        <div className="flex flex-row items-center">
          <SearchBar onChange={handleUpdateSearchString} />
        </div>
      </div>
      <div
        className="flex flex-col justify-center items-center"
        ref={parentRef}
      >
        <div
          className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          style={{ height: `${rowVirtualization.totalSize}px` }}
        >
          {rowVirtualization.virtualItems.map((item, index) => {
            const card = sortedData[item.index]
            return (
              <div
                className="relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                key={index}
                onClick={() => onSelect(card, isCurrentUser)}
              >
                <TradingCard
                  source={card.image_url}
                  rarity={card.card_rarity}
                  playerName={card.player_name}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TradeGrid
