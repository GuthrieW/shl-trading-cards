import { useGetAllUsers, useGetUserCards } from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useEffect, useState } from 'react'
import SearchBar from '@components/inputs/search-bar'
import MultiSelectButtonGroup from '@components/buttons/multi-select-button-group'
import rarityMap from '@constants/rarity-map'
import pathToCards from '@constants/path-to-cards'
import AutoCompleteSearchBar from '@components/inputs/autocomplete-search-bar'

const Collections = () => {
  const [collectionUid, setCollectionUid] = useState(getUidFromSession())

  const {
    userCards,
    isLoading: getUserCardsIsLoading,
    isError: getUserCardsIsError,
  } = useGetUserCards({
    uid: collectionUid,
  })
  const {
    users,
    isLoading: getAllUsersIsLoading,
    isError: getAllUsersIsError,
  } = useGetAllUsers({})

  const [cardsToDisplay, setCardsToDisplay] = useState<Card[]>(userCards)
  const [searchString, setSearchString] = useState<string>('')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])

  useEffect(() => {
    const lowerCaseSearchString = searchString.toLowerCase()
    if (searchString !== '' && selectedRarities.length !== 0) {
      setCardsToDisplay(
        userCards
          .filter((card) =>
            card.player_name.toLowerCase().includes(lowerCaseSearchString)
          )
          .filter((card) => selectedRarities.includes(card.card_rarity))
      )
    } else if (searchString !== '') {
      setCardsToDisplay(
        userCards.filter((card) =>
          card.player_name.toLowerCase().includes(lowerCaseSearchString)
        )
      )
    } else if (selectedRarities.length !== 0) {
      setCardsToDisplay(
        userCards.filter((card) => selectedRarities.includes(card.card_rarity))
      )
    } else {
      setCardsToDisplay(userCards)
    }
  }, [userCards, searchString, selectedRarities])

  const handleUpdateSearchString = (event) =>
    setSearchString(event.target.value || '')

  const handleUpdateCollectionUid = (event) =>
    setCollectionUid(event.target.value || getUidFromSession())

  const updateSelectedButtonIds = (toggleId) =>
    selectedRarities.includes(toggleId)
      ? setSelectedRarities(
          selectedRarities.filter((rarity) => rarity != toggleId)
        )
      : setSelectedRarities(selectedRarities.concat(toggleId))

  const tableButtons: CollectionTableButtons[] = [
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

  if (getUserCardsIsLoading || getUserCardsIsError) return null

  console.log('users', users)

  return (
    <div className="m-2">
      <h1>Collections Placeholder</h1>
      <div className="flex justify-start items-center">
        <AutoCompleteSearchBar
          availableInputs={users}
          onChange={handleUpdateCollectionUid}
        />
      </div>
      <div className="flex justify-between items-center">
        <MultiSelectButtonGroup
          buttons={tableButtons}
          selectedButtonIds={selectedRarities}
        />
        <SearchBar onChange={handleUpdateSearchString} />
      </div>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-4 gap-4">
          {cardsToDisplay.slice(0, 12).map((card) => (
            <img src={`${pathToCards}${card.image_url}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collections
