import React, { useEffect, useState } from 'react'
import { Container } from '@material-ui/core'
import InfoCard from '../../components/InfoCard'

const Dashboard = () => {
  return (
    <Container>
      <InfoCard
        title={'Edit Cards'}
        body={'Modify card information including approval and current rotation'}
        href={'/Dashboard/EditCards'}
      />
      <InfoCard
        title={'Edit Users'}
        body={'Modify user data including subscription status and permissions'}
        href={'/Dashboard/EditUsers'}
      />
      <InfoCard
        title={'Process Cards'}
        body={'Approve or delete cards in the processing queue'}
        href={'/Dashboard/ProcessCards'}
      />
      <InfoCard
        title={'Search Cards'}
        body={'Search for cards based on their meta data'}
        href={'/Dashboard/SearchCards'}
      />
      <InfoCard
        title={'Submit Cards'}
        body={'Submit cards for approval'}
        href={'/Dashboard/SubmitCards'}
      />
    </Container>
  )
}

export default Dashboard
