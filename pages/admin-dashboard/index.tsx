import React, { useState } from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import { Box } from '@material-ui/core'
import { AdminSidebar, PageHeader } from '@components/index'
import { getUidFromSession, isAdminOrCardTeam } from '@utils/index'
import { useGetUser } from '@pages/api/queries/index'
import { adminPages } from '@constants/index'
import EditCards from './edit-cards'
import ProcessCards from './process-cards'
import SubmitCards from './submit-cards'
import ClaimCardCreation from './claim-card-creation'
import RequestCardCreation from './request-card-creation'
import EditSets from './edit-sets'

const HorizontalBox = styled(Box)`
  display: flex;
  flex-direction: row;
`

const VerticalSelectionBox = styled(Box)`
  display: flex;
  flex-direction: column;
`

const VerticalContentBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export type SelectedAdminPage =
  | 'none'
  | 'edit-cards'
  | 'process-cards'
  | 'submit-cards'
  | 'claim-card-creation'
  | 'request-card-creation'
  | 'edit-sets'

const AdminDashboard = () => {
  const { user, isLoading, isError } = useGetUser({
    uid: getUidFromSession(),
  })
  const [selectedAdminPage, setSelectedAdminPage] =
    useState<SelectedAdminPage>('none')

  if (typeof window !== 'undefined') {
    const hasPerm = isAdminOrCardTeam(user)

    if (!hasPerm && !isLoading) {
      Router.push({
        pathname: '/home',
      })
    }
  } else {
    return null
  }

  return (
    <>
      <PageHeader>Admin Dashboard</PageHeader>
      <HorizontalBox>
        <VerticalSelectionBox>
          <AdminSidebar
            pages={adminPages}
            onItemClick={setSelectedAdminPage}
            selectedItem={selectedAdminPage}
          />
        </VerticalSelectionBox>
        <VerticalContentBox>
          {selectedAdminPage === 'edit-cards' && <EditCards />}
          {selectedAdminPage === 'process-cards' && <ProcessCards />}
          {selectedAdminPage === 'submit-cards' && <SubmitCards />}
          {selectedAdminPage === 'claim-card-creation' && <ClaimCardCreation />}
          {selectedAdminPage === 'request-card-creation' && (
            <RequestCardCreation />
          )}
          {selectedAdminPage === 'edit-sets' && <EditSets />}
        </VerticalContentBox>
      </HorizontalBox>
    </>
  )
}

export default AdminDashboard
