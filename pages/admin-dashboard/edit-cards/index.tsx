import React, { useState } from 'react'
import { DataTable, EditCardModal } from '@components/index'
import { useGetAllCards } from '@pages/api/queries/index'
import { goalieColumns, skaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'

const EditCards = () => {
  const { allCards, isLoading, isError } = useGetAllCards({})
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const skaterCards = onlySkaterCards(allCards)
  const goalieCards = onlyGoalieCards(allCards)
  const skaterTableOptions = {
    onRowClick: (rowData: string[]) => {
      const skaterCard: Card = {
        cardID: parseInt(rowData[0]),
        teamID: parseInt(rowData[1]),
        playerID: parseInt(rowData[2]),
        author_userID: parseInt(rowData[3]),
        player_name: rowData[4],
        card_rarity: rowData[5],
        pullable: rowData[6] === 'true',
        approved: rowData[7] === 'true',
        position: rowData[8],
        overall: parseInt(rowData[9]),
        skating: parseInt(rowData[10]),
        shooting: parseInt(rowData[11]),
        hands: parseInt(rowData[12]),
        checking: parseInt(rowData[13]),
        defense: parseInt(rowData[14]),
        high_shots: null,
        low_shots: null,
        quickness: null,
        control: null,
        conditioning: null,
        image_url: rowData[15],
        season: parseInt(rowData[16]),
      }
      setSelectedCard(skaterCard)
      setIsOpen(true)
    },
  }

  const goalieTableOptions = {
    onRowClick: (rowData: string[]) => {
      const goalieCard: Card = {
        cardID: parseInt(rowData[0]),
        teamID: parseInt(rowData[1]),
        playerID: parseInt(rowData[2]),
        author_userID: parseInt(rowData[3]),
        player_name: rowData[4],
        card_rarity: rowData[5],
        pullable: rowData[6] === 'true',
        approved: rowData[7] === 'true',
        position: rowData[8],
        overall: parseInt(rowData[9]),
        skating: null,
        shooting: null,
        hands: null,
        checking: null,
        defense: null,
        high_shots: parseInt(rowData[10]),
        low_shots: parseInt(rowData[11]),
        quickness: parseInt(rowData[12]),
        control: parseInt(rowData[13]),
        conditioning: parseInt(rowData[14]),
        image_url: rowData[15],
        season: parseInt(rowData[16]),
      }
      setSelectedCard(goalieCard)
      setIsOpen(true)
    },
  }

  const handleCloseCard = () => {
    setSelectedCard(null)
    setIsOpen(false)
  }

  return (
    <>
      <DataTable
        title={'Edit a Skater Card'}
        data={skaterCards}
        columns={skaterColumns}
        options={skaterTableOptions}
      />
      <DataTable
        title={'Edit a Goalie Card'}
        data={goalieCards}
        columns={goalieColumns}
        options={goalieTableOptions}
      />
      {selectedCard && (
        <EditCardModal
          open={isOpen}
          handleCardClose={handleCloseCard}
          card={selectedCard}
        />
      )}
    </>
  )
}

export default EditCards
