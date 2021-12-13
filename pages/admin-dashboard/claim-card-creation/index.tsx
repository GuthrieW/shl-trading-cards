import React, { useState } from 'react'
import { claimingGoalieColumns, claimingSkaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { ConfirmClaimModal, DataTable } from '@components/index'
import { useGetRequestedCards } from '@pages/api/queries/index'
import { useClaimCard } from '@pages/api/mutations'
import { getUidFromSession } from '@utils/index'

const ClaimCardCreation = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const {
    requestedCards,
    isLoading: requestCardsIsLoading,
    isError: requestCardsIsError,
  } = useGetRequestedCards({})
  const {
    claimCard,
    response,
    isLoading: claimCardIsLoading,
    isError: claimCardIsError,
  } = useClaimCard()

  const skaterCards = onlySkaterCards(requestedCards)
  const goalieCards = onlyGoalieCards(requestedCards)

  const options = {
    onRowClick: (rowData) => {
      setConfirmModalVisible(true)
      setSelectedRow(rowData)
    },
  }

  return (
    <>
      <DataTable
        title={'Claim a Skater Card'}
        data={skaterCards}
        columns={claimingSkaterColumns}
        options={options}
      />
      <DataTable
        title={'Claim a Goalie Card'}
        data={goalieCards}
        columns={claimingGoalieColumns}
        options={options}
      />
      {selectedRow && (
        <ConfirmClaimModal
          open={confirmModalVisible}
          playerName={selectedRow[1]}
          cardRarity={selectedRow[3]}
          handleConfirm={() => {
            claimCard({ cardID: selectedRow[0], uid: getUidFromSession() })
            setSelectedRow(null)
            setConfirmModalVisible(false)
          }}
          handleClose={() => {
            setSelectedRow(null)
            setConfirmModalVisible(false)
          }}
        />
      )}
    </>
  )
}

export default ClaimCardCreation
