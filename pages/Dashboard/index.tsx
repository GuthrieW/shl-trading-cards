import React, { useEffect, useState } from 'react'
import { Container } from '@material-ui/core'
import InfoCard from '../../components/info-card'

const DummyPermissions = {
  isAdmin: true,
  isSubmitter: true,
  isProcessor: true,
}

const Dashboard = () => {
  return (
    <Container>
      {DummyPermissions.isAdmin && (
        <InfoCard
          title={'Edit Users'}
          body={
            'Modify user data including subscription status and permissions'
          }
          href={'/Dashboard/EditUsers'}
        />
      )}
      {(DummyPermissions.isAdmin || DummyPermissions.isProcessor) && (
        <InfoCard
          title={'Edit Cards'}
          body={
            'Modify card information including approval and current rotation'
          }
          href={'/Dashboard/EditCards'}
        />
      )}
      {(DummyPermissions.isAdmin || DummyPermissions.isProcessor) && (
        <InfoCard
          title={'Process Cards'}
          body={'Approve or delete cards in the processing queue'}
          href={'/Dashboard/ProcessCards'}
        />
      )}
      {(DummyPermissions.isAdmin || DummyPermissions.isProcessor) && (
        <InfoCard
          title={'Submit Cards'}
          body={'Submit cards for approval'}
          href={'/Dashboard/SubmitCards'}
        />
      )}
      <InfoCard
        title={'Search Cards'}
        body={'Search for cards based on their meta data'}
        href={'/Dashboard/SearchCards'}
      />
    </Container>
  )
}

export default Dashboard
