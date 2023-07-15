import Button from '@components/buttons/button'
import CardOwnerCard from '@components/cards/card-owner-card'
import DropdownWithCheckboxGroup from '@components/dropdowns/dropdown-with-checkbox-group'
import GridPagination from '@components/grids/grid-pagination'
import SearchBar from '@components/inputs/search-bar'
import rarityMap from '@constants/rarity-map'
import teamsMap from '@constants/teams-map'
import useGetCardOwners from '@pages/api/queries/use-get-card-owners'
import { useEffect, useState } from 'react'

const CardSearchForm = () => {
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)

  const { cardOwners, total, isLoading, isError, refetch } = useGetCardOwners({
    name: searchString,
    teams: selectedTeams.map((team) => teamsMap[team].teamID),
    rarities: selectedRarities,
    page: currentPage,
  })

  useEffect(() => refetch(), [currentPage])
  useEffect(
    () => updateCurrentPage(0),
    [searchString, selectedRarities, selectedTeams]
  )

  const updateCurrentPage = (pageNumber: number) => setCurrentPage(pageNumber)

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

  return (
    <div className="m-1">
      <p>Card Search</p>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full flex justify-start items-center">
          <div className="flex flex-wrap">
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
            <div className="flex items-center m-1">
              <SearchBar
                onChange={handleUpdateSearchString}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center m-1">
              <Button
                disabled={
                  isLoading ||
                  (searchString.length === 0 &&
                    selectedRarities.length === 0 &&
                    selectedTeams.length === 0)
                }
                onClick={() => refetch()}
              >
                Submit
              </Button>
            </div>
            <GridPagination
              updateCurrentPage={updateCurrentPage}
              currentPage={currentPage}
              maxPages={total}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {cardOwners.length !== 0 ? (
          <div className="h-full w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-scroll">
            {cardOwners.map((cardOwner, index) => (
              <CardOwnerCard
                key={`${cardOwner.cardID}-${index}`}
                cardOwner={cardOwner}
              />
            ))}
          </div>
        ) : (
          <p>No results</p>
        )}
      </div>
    </div>
  )
}

export default CardSearchForm
