import pathToCards from '@constants/path-to-cards'
import React, { useMemo, useState } from 'react'

import SearchBar from '@components/inputs/search-bar'
import rarityMap from '@constants/rarity-map'
import CardLightBoxModal from '@components/modals/card-lightbox-modal'
import DropdownWithCheckboxGroup from '@components/dropdowns/dropdown-with-checkbox-group'
import { useVirtual } from 'react-virtual'
import teamsMap from '@constants/teams-map'
import { CollectionCard, CollectionTableButtons } from 'index.d'

type CollectionGridProps = {
  gridData: CollectionCard[]
}

const CollectionGrid = ({ gridData }: CollectionGridProps) => {
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const parentRef = React.useRef()

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

  // sort by overall
  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      return b.overall - a.overall
    })
  }, [data])

  const rowVirtualization = useVirtual({
    size: data.length,
    overscan: 10,
    parentRef,
    estimateSize: React.useCallback(() => 35, []),
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

  const PlayerCardRarityCheckboxes: CollectionTableButtons[] = Object.values(
    rarityMap
  ).map((rarity) => {
    return {
      id: rarity.label,
      text: rarity.label === 'Hall of Fame' ? 'HOF' : rarity.label,
      onClick: () => updateSelectedRarityButtonIds(rarity.label),
    }
  })

  const TeamCheckboxes: CollectionTableButtons[] = Object.keys(teamsMap).map(
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
      <div className="w-full lg:w-3/4 flex justify-between items-center">
        <div className="flex">
          <DropdownWithCheckboxGroup
            title="Rarity"
            checkboxes={PlayerCardRarityCheckboxes}
            selectedCheckboxIds={selectedRarities}
          />
          <DropdownWithCheckboxGroup
            title="Team"
            checkboxes={TeamCheckboxes}
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
          className="w-full lg:w-3/4 mx-auto relative m-4 grid grid-cols-3 md:grid-cols-6 gap-4 lg:gap-8"
          style={{ height: `${rowVirtualization.totalSize}px` }}
        >
          {rowVirtualization.virtualItems.map((item, index) => {
            const card = sortedData[item.index]
            return (
              <div
                className="relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                key={index}
                onClick={() => {
                  setSelectedCard(card)
                  setLightBoxIsOpen(true)
                }}
              >
                <img
                  className="w-full h-full cursor-pointer rounded-sm"
                  src={`${pathToCards}${card.image_url}`}
                  alt={card.player_name}
                  loading="lazy"
                />
                {card.quantity > 1 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 sm:translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-full">
                    {card.quantity}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {lightBoxIsOpen && (
        <CardLightBoxModal
          cardName={selectedCard.player_name}
          cardImage={selectedCard.image_url}
          setShowModal={() => setLightBoxIsOpen(false)}
        />
      )}
    </div>
  )
}

export default CollectionGrid
