import React, { useState } from 'react'
import InfoCard from '@components/info-card'
import PageHeader from '@components/page-header'
import useCurrentUser from '@hooks/use-current-user'
import { Box } from '@material-ui/core'
import EditCards from './edit-cards'
import EditUsers from './edit-users'
import ProcessCards from './process-cards'
import SubmitCards from './submit-cards'
import styled from 'styled-components'
import { adminPages, hasRequiredPermisson } from '@utils/index'
import ClaimCardCreation from './claim-card-creation'
import RequestCardCreation from './request-card-creation'

const HorizontalBox = styled(Box)`
  display: flex;
  flex-direction: row;
`

const VerticalSelectionBox = styled(Box)`
  width: 15%;
  display: flex;
  flex-direction: column;
`

const VerticalContentBox = styled(Box)`
  width: 85%;
  display: flex;
  flex-direction: column;
`

export type SelectedAdminPage =
  | 'none'
  | 'edit-users'
  | 'edit-cards'
  | 'process-cards'
  | 'submit-cards'
  | 'claim-card-creation'
  | 'request-card-creation'

const Dashboard = () => {
  const { currentUser, isLoading, isError } = useCurrentUser()
  const [selectedAdminPage, setSelectedAdminPage] =
    useState<SelectedAdminPage>('none')

  console.log(currentUser)

  return (
    <>
      <PageHeader>Admin Dashboard</PageHeader>
      <HorizontalBox>
        <VerticalSelectionBox>
          {adminPages.map((page) => {
            return hasRequiredPermisson(
              page.requiredPermissions,
              currentUser
            ) ? (
              <InfoCard
                title={page.title}
                body={page.body}
                onClick={() => {
                  setSelectedAdminPage(page.href)
                }}
              />
            ) : null
          })}
        </VerticalSelectionBox>
        <VerticalContentBox>
          {selectedAdminPage === 'edit-users' && <EditUsers />}
          {selectedAdminPage === 'edit-cards' && <EditCards />}
          {selectedAdminPage === 'process-cards' && <ProcessCards />}
          {selectedAdminPage === 'submit-cards' && <SubmitCards />}
          {selectedAdminPage === 'claim-card-creation' && <ClaimCardCreation />}
          {selectedAdminPage === 'request-card-creation' && (
            <RequestCardCreation />
          )}
        </VerticalContentBox>
      </HorizontalBox>
    </>
  )
}

export default Dashboard
