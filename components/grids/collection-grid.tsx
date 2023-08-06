import React, { useState, useEffect } from 'react'
import SearchBar from '@components/inputs/search-bar'
import rarityMap from '@constants/rarity-map'
import CardLightBoxModal from '@components/modals/card-lightbox-modal'
import DropdownWithCheckboxGroup from '@components/dropdowns/dropdown-with-checkbox-group'
import teamsMap from '@constants/teams-map'
import useGetUserCards from '@pages/api/queries/use-get-user-cards'
import { useResponsive } from '@hooks/useResponsive'
import GridPagination from './grid-pagination'
import TradingCard from '@components/images/trading-card'
import { PropagateLoader } from 'react-spinners'
import { generateRarityCheckboxes } from '@components/dropdowns/generate-rarity-checkboxes'
import { generateTeamCheckboxes } from '@components/dropdowns/generate-team-checkboxes'

type CollectionGridProps = {
  userId: number
}

const CollectionGrid = ({ userId }: CollectionGridProps) => {
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const { isMobile, isTablet } = useResponsive()

  const { userCards, maxPages, isLoading, isError, refetch } = useGetUserCards({
    uid: userId,
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

  const playerCardRarityCheckboxes: CollectionTableButtons[] =
    generateRarityCheckboxes(updateSelectedRarityButtonIds)

  const teamCheckboxes: CollectionTableButtons[] = generateTeamCheckboxes(
    updateSelectedTeamButtonIds
  )

  const updateCurrentPage = (pageNumber: number) => setCurrentPage(pageNumber)

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
        {isLoading ? (
          <div className="flex justify-center">
            <PropagateLoader />
          </div>
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
                <TradingCard
                  className="w-full h-full cursor-pointer rounded-sm"
                  source={card.image_url}
                  rarity={card.card_rarity}
                  playerName={card.player_name}
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
