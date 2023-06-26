import Button from '@components/buttons/button'
import CardOwnerCard from '@components/card/card-owner-card'
import DropdownWithCheckboxGroup from '@components/dropdowns/dropdown-with-checkbox-group'
import SearchBar from '@components/inputs/search-bar'
import rarityMap from '@constants/rarity-map'
import teamsMap from '@constants/teams-map'
import useGetCardOwners from '@pages/api/queries/use-get-card-owners'
import { useState } from 'react'

const CardSearchForm = () => {
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])

  const { cardOwners, isLoading, isError, refetch } = useGetCardOwners({
    name: searchString,
    teams: selectedTeams.map((team) => teamsMap[team].teamID),
    rarities: selectedRarities.map(
      (rarity) => rarityMap[rarity.toLowerCase()].label
    ),
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
    <div className="m-1">
      <p>Card Search</p>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full flex justify-between items-center">
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
            <SearchBar
              onChange={handleUpdateSearchString}
              disabled={isLoading || isError}
            />
          </div>
          <div className="flex flex-row items-center">
            <Button disabled={isLoading || isError} onClick={() => refetch()}>
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {cardOwners.length !== 0 &&
            cardOwners.map((cardWithUsers) =>
              cardWithUsers.users.map((user) => (
                <CardOwnerCard card={cardWithUsers.card} user={user} />
              ))
            )}
        </div>
      </div>
    </div>
  )
}

export default CardSearchForm
