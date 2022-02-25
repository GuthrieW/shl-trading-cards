import React, { useState } from 'react'
import { claimingGoalieColumns, claimingSkaterColumns } from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { ConfirmClaimModal, DataTable } from '@components/index'
import { useGetRequestedCards } from '@pages/api/queries/index'
import { useClaimCard } from '@pages/api/mutations'
import { getUidFromSession } from '@utils/index'
import { Button } from '@material-ui/core'

const ClaimCardCreation = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [showSkaters, setShowSkaters] = useState(true)

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
        title={
          <>
            {showSkaters ? 'Claim a Skater Card' : 'Claim a Goalie Card'}
            <Button
              style={{ marginLeft: '5px' }}
              onClick={() => setShowSkaters(!showSkaters)}
            >
              Swap to {showSkaters ? 'Goalies' : 'Skaters'}
            </Button>
          </>
        }
        columns={showSkaters ? claimingSkaterColumns : claimingGoalieColumns}
        data={showSkaters ? skaterCards : goalieCards}
        options={options}
      />
      {selectedRow && (
        <ConfirmClaimModal
          open={confirmModalVisible}
          playerName={selectedRow[1]}
          cardID={selectedRow[0]}
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
