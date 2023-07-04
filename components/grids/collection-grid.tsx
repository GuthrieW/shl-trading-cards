import pathToCards from '@constants/path-to-cards'
import React, { useState, useRef, useEffect } from 'react'
import SearchBar from '@components/inputs/search-bar'
import rarityMap from '@constants/rarity-map'
import CardLightBoxModal from '@components/modals/card-lightbox-modal'
import DropdownWithCheckboxGroup from '@components/dropdowns/dropdown-with-checkbox-group'
import teamsMap from '@constants/teams-map'
import useGetUserCards from '@pages/api/queries/use-get-user-cards'
import getUidFromSession from '@utils/get-uid-from-session'
import { useResponsive } from '@hooks/useResponsive'
import GridPagination from './grid-pagination'

type CollectionGridProps = {}

const CollectionGrid = ({}: CollectionGridProps) => {
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const { isMobile, isTablet } = useResponsive()

  const { userCards, maxPages, isLoading, isError, refetch } = useGetUserCards({
    uid: getUidFromSession(),
    name: searchString,
    teams: selectedTeams,
    rarities: selectedRarities,
    page: currentPage,
  })

  useEffect(
    () => refetch(),
    [searchString, selectedRarities, selectedTeams, currentPage]
  )

  useEffect(
    () => updateCurrentPage(0),
    [searchString, selectedRarities, selectedTeams]
  )

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
  ).map((rarity) => ({
    id: rarity.label,
    text: rarity.label === 'Hall of Fame' ? 'HOF' : rarity.label,
    onClick: () => updateSelectedRarityButtonIds(rarity.label),
  }))

  const teamCheckboxes: CollectionTableButtons[] = Object.keys(teamsMap).map(
    (key) => ({
      id: key,
      text: teamsMap[key].abbreviation,
      onClick: () => updateSelectedTeamButtonIds(key),
    })
  )

  const updateCurrentPage = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex justify-between items-center">
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
        {!isMobile && (
          <GridPagination
            updateCurrentPage={updateCurrentPage}
            currentPage={currentPage}
            maxPages={maxPages}
          />
        )}

        <div className="flex flex-row items-center">
          <SearchBar onChange={handleUpdateSearchString} />
        </div>
      </div>
      {isMobile && (
        <GridPagination
          updateCurrentPage={updateCurrentPage}
          currentPage={currentPage}
          maxPages={maxPages}
        />
      )}
      <div
        className={`grid gap-3 ${
          isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-5'
        }`}
      >
        {isLoading && userCards.length !== 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            {userCards?.map((card, index) => (
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
            ))}
          </>
        )}
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
