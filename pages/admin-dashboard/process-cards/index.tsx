import React, { useState } from 'react'
import { DataTable } from '@components/index'
import {
  processingGoalieColumns,
  processingSkaterColumns,
} from '@constants/index'
import { onlyGoalieCards, onlySkaterCards } from '@utils/index'
import { useGetUnapprovedCards } from '@pages/api/queries/index'
import { useAcceptCard, useDenyCard } from '@pages/api/mutations'
import { ApproveDenyModal } from '@components/index'
import { Button } from '@material-ui/core'

const ProcessCards = () => {
  const [approveDenyModalVisible, setApproveDenyModalVisible] =
    useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [showSkaters, setShowSkaters] = useState<boolean>(true)
  const {
    unapprovedCards,
    isLoading: getUnapprovedCardsIsLoading,
    isError: getUnapprovedCardsIsError,
  } = useGetUnapprovedCards({})
  const {
    acceptCard,
    isLoading: acceptCardIsLoading,
    isError: acceptCardIsError,
  } = useAcceptCard()
  const {
    denyCard,
    isLoading: denyCardIsLoading,
    isError: denyCardIsError,
  } = useDenyCard()

  const skaterCards = onlySkaterCards(unapprovedCards)
  const goalieCards = onlyGoalieCards(unapprovedCards)

  const options = {
    onRowClick: (rowData) => {
      setApproveDenyModalVisible(true)
      setSelectedRow(rowData)
    },
  }

  return (
    <>
      <DataTable
        title={
          <>
            {showSkaters ? 'Process Skater Cards' : 'Process Goalie Cards'}
            <Button onClick={() => setShowSkaters(!showSkaters)}>
              Swap to {showSkaters ? 'Goalies' : 'Skaters'}
            </Button>
          </>
        }
        columns={
          showSkaters ? processingSkaterColumns : processingGoalieColumns
        }
        data={showSkaters ? skaterCards : goalieCards}
        options={options}
      />
      {selectedRow && (
        <ApproveDenyModal
          open={approveDenyModalVisible}
          card={selectedRow}
          handleAccept={() => {
            acceptCard({ cardID: selectedRow[0] })
            setSelectedRow(null)
            setApproveDenyModalVisible(false)
          }}
          handleDeny={() => {
            denyCard({ cardID: selectedRow[0] })
            setSelectedRow(null)
            setApproveDenyModalVisible(false)
          }}
          handleClose={() => {
            setSelectedRow(null)
            setApproveDenyModalVisible(false)
          }}
        />
      )}
    </>
  )
}

export default ProcessCards
