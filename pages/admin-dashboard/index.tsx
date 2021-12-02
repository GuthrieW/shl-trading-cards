import React, { useState } from 'react'
import InfoCard from '@components/info-card'
import PageHeader from '@components/page-header'
import useCurrentUser from '@hooks/use-current-user'
import EditCards from './edit-cards'
import EditUsers from './edit-users'
import ProcessCards from './process-cards'
import SubmitCards from './submit-cards'
import {
  HorizontalBox,
  VerticalContentBox,
  VerticalSelectionBox,
} from './styled'

type SelectedAdminPage =
  | 'none'
  | 'edit-users'
  | 'edit-cards'
  | 'process-cards'
  | 'submit-cards'

const Dashboard = () => {
  const { currentUser, isLoading, isError } = useCurrentUser()
  const [selectedAdminPage, setSelectedAdminPage] =
    useState<SelectedAdminPage>('none')

  return (
    <>
      <PageHeader>Admin Dashboard</PageHeader>
      <HorizontalBox>
        <VerticalSelectionBox>
          {(currentUser.isAdmin || currentUser.isProcessor) && (
            <InfoCard
              title={'Edit Cards'}
              body={'Modify card information including '}
              onClick={() => {
                setSelectedAdminPage('edit-cards')
              }}
            />
          )}
          {currentUser.isAdmin && (
            <InfoCard
              title={'Edit Users'}
              body={
                'Modify user data including subscription status and permissions'
              }
              onClick={() => {
                setSelectedAdminPage('edit-users')
              }}
            />
          )}
          {(currentUser.isAdmin || currentUser.isProcessor) && (
            <InfoCard
              title={'Process Cards'}
              body={'Approve or delete cards in the processing queue'}
              onClick={() => {
                setSelectedAdminPage('process-cards')
              }}
            />
          )}
          {(currentUser.isAdmin || currentUser.isSubmitter) && (
            <InfoCard
              title={'Submit Cards'}
              body={'Submit cards for approval'}
              onClick={() => {
                setSelectedAdminPage('submit-cards')
              }}
            />
          )}
        </VerticalSelectionBox>
        <VerticalContentBox>
          {selectedAdminPage === 'edit-users' && <EditUsers />}
          {selectedAdminPage === 'edit-cards' && <EditCards />}
          {selectedAdminPage === 'process-cards' && <ProcessCards />}
          {selectedAdminPage === 'submit-cards' && <SubmitCards />}
        </VerticalContentBox>
      </HorizontalBox>
    </>
  )
}

export default Dashboard
