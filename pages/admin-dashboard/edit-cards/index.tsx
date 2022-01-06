import React, { useState } from 'react'
import { DataTable, EditCardModal } from '@components/index'
import { useGetAllCards } from '@pages/api/queries/index'
import { goalieColumns, skaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { useEditCard, useSubmitCardImage } from '@pages/api/mutations'

const EditCards = () => {
  const {
    allCards,
    isLoading: getAllCardsIsLoading,
    isError: getAllCardsIsError,
  } = useGetAllCards({})
  const {
    editCard,
    response: editCardResponse,
    isLoading: editCardIsLoading,
    isError: editCardIsError,
  } = useEditCard()
  const {
    submitCardImage,
    response: submitCardImageResponse,
    isLoading: submitCardImageIsLoading,
    isError: submitCardImageIsError,
  } = useSubmitCardImage()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const skaterCards = onlySkaterCards(allCards)
  const goalieCards = onlyGoalieCards(allCards)
  const skaterTableOptions = {
    onRowClick: (rowData: string[]) => {
      console.log('rowData', rowData)
      const skaterCard: Card = {
        cardID: parseInt(rowData[0]),
        teamID: parseInt(rowData[1]),
        playerID: parseInt(rowData[2]),
        author_userID: parseInt(rowData[3]),
        player_name: rowData[6],
        card_rarity: rowData[7],
        pullable: rowData[4] === 'true',
        approved: rowData[5] === 'true',
        position: rowData[9],
        overall: parseInt(rowData[10]),
        skating: parseInt(rowData[11]),
        shooting: parseInt(rowData[12]),
        hands: parseInt(rowData[13]),
        checking: parseInt(rowData[14]),
        defense: parseInt(rowData[15]),
        high_shots: null,
        low_shots: null,
        quickness: null,
        control: null,
        conditioning: null,
        image_url: rowData[16],
        season: parseInt(rowData[8]),
        author_paid: rowData[17] === 'true',
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
        player_name: rowData[6],
        card_rarity: rowData[7],
        pullable: rowData[4] === 'true',
        approved: rowData[5] === 'true',
        position: rowData[9],
        overall: parseInt(rowData[10]),
        skating: null,
        shooting: null,
        hands: null,
        checking: null,
        defense: null,
        high_shots: parseInt(rowData[11]),
        low_shots: parseInt(rowData[12]),
        quickness: parseInt(rowData[13]),
        control: parseInt(rowData[14]),
        conditioning: parseInt(rowData[15]),
        image_url: rowData[16],
        season: parseInt(rowData[8]),
        author_paid: rowData[17] === 'true',
      }
      setSelectedCard(goalieCard)
      setIsOpen(true)
    },
  }

  const handleClose = () => {
    setSelectedCard(null)
    setIsOpen(false)
  }

  console.log('selectedCard', selectedCard)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <div style={{ height: '50%', width: '100%' }}>
        <DataTable
          title={'Edit a Skater Card'}
          data={skaterCards}
          columns={skaterColumns}
          options={skaterTableOptions}
        />
      </div>
      <div style={{ height: '50%', width: '100%' }}>
        <DataTable
          title={'Edit a Goalie Card'}
          data={goalieCards}
          columns={goalieColumns}
          options={goalieTableOptions}
        />
      </div>
      {selectedCard && (
        <EditCardModal
          open={isOpen}
          handleSubmitCard={editCard}
          handleSubmitImage={submitCardImage}
          handleClose={handleClose}
          card={selectedCard}
        />
      )}
    </div>
  )
}

export default EditCards
