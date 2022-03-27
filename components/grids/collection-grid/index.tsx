import pathToCards from '@constants/path-to-cards'
import React, { useMemo, useState } from 'react'

import SearchBar from '@components/inputs/search-bar'
import rarityMap from '@constants/rarity-map'
import CardLightBoxModal from '@components/modals/card-lightbox-modal'
import DropdownWithCheckboxGroup from '@components/dropdowns/dropdown-with-checkbox-group'
import { useVirtual } from 'react-virtual'

type CollectionGridProps = {
  gridData: CollectionCard[]
}

const CollectionGrid = ({ gridData }: CollectionGridProps) => {
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const parentRef = React.useRef()

  const data = useMemo(() => {
    const lowerCaseSearchString = searchString.toLowerCase()

    if (searchString !== '' && selectedRarities.length !== 0) {
      return gridData
        .filter((card) =>
          card.player_name.toLowerCase().includes(lowerCaseSearchString)
        )
        .filter((card) => selectedRarities.includes(card.card_rarity))
    } else if (searchString !== '') {
      return gridData.filter((card) =>
        card.player_name.toLowerCase().includes(lowerCaseSearchString)
      )
    } else if (selectedRarities.length !== 0) {
      return gridData.filter((card) =>
        selectedRarities.includes(card.card_rarity)
      )
    } else {
      return gridData
    }
  }, [searchString, selectedRarities, gridData])

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

  const updateSelectedButtonIds = (toggleId) =>
    selectedRarities.includes(toggleId)
      ? setSelectedRarities(
          selectedRarities.filter((rarity) => rarity != toggleId)
        )
      : setSelectedRarities(selectedRarities.concat(toggleId))

  const PlayerCardRarityCheckboxes: CollectionTableButtons[] = [
    {
      id: rarityMap.bronze.label,
      text: rarityMap.bronze.label,
      onClick: () => updateSelectedButtonIds(rarityMap.bronze.label),
    },
    {
      id: rarityMap.silver.label,
      text: rarityMap.silver.label,
      onClick: () => updateSelectedButtonIds(rarityMap.silver.label),
    },
    {
      id: rarityMap.gold.label,
      text: rarityMap.gold.label,
      onClick: () => updateSelectedButtonIds(rarityMap.gold.label),
    },
    {
      id: rarityMap.ruby.label,
      text: rarityMap.ruby.label,
      onClick: () => updateSelectedButtonIds(rarityMap.ruby.label),
    },
    {
      id: rarityMap.diamond.label,
      text: rarityMap.diamond.label,
      onClick: () => updateSelectedButtonIds(rarityMap.diamond.label),
    },
  ]

  const CardTypeButtons = [
    {
      id: rarityMap.logo.label,
      text: rarityMap.logo.label,
      onClick: () => updateSelectedButtonIds(rarityMap.logo.label),
    },
    {
      id: rarityMap.hallOfFame.label,
      text: rarityMap.hallOfFame.label,
      onClick: () => updateSelectedButtonIds(rarityMap.hallOfFame.label),
    },
  ]

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full lg:w-3/4 flex justify-between items-center">
        <div className="flex">
          <DropdownWithCheckboxGroup
            title="Type"
            checkboxes={CardTypeButtons}
            selectedCheckboxIds={selectedRarities}
          />
          <DropdownWithCheckboxGroup
            title="Rarity"
            checkboxes={PlayerCardRarityCheckboxes}
            selectedCheckboxIds={selectedRarities}
          />
        </div>
        <div className="flex flex-row items-center">
          <div className="text-lg mx-6 hidden w-1/2 sm:inline-block">
            {gridData.length} Cards
          </div>
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
