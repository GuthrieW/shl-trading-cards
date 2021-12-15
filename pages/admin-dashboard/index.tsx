import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Box } from '@material-ui/core'
import { AdminSidebar, PageHeader } from '@components/index'
import { hasRequiredPermisson } from '@utils/index'
import { groups } from '@utils/user-groups'
import { getUidFromSession } from '@utils/index'
import { useGetUser } from '@pages/api/queries/index'
import { adminPages } from '@constants/index'
import EditCards from './edit-cards'
import ProcessCards from './process-cards'
import SubmitCards from './submit-cards'
import ClaimCardCreation from './claim-card-creation'
import RequestCardCreation from './request-card-creation'

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

const AdminDashboard = () => {
  const router = useRouter()
  const { user, isLoading, isError } = useGetUser({
    uid: getUidFromSession(),
  })
  const [selectedAdminPage, setSelectedAdminPage] =
    useState<SelectedAdminPage>('none')

  if (typeof window !== 'undefined') {
    if (
      !hasRequiredPermisson(
        [groups.TradingCardAdmin.id, groups.TradingCardTeam.id],
        user
      )
    ) {
      router.push({
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
        </VerticalContentBox>
      </HorizontalBox>
    </>
  )
}

export default AdminDashboard
