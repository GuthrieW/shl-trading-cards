import React from 'react'
import { useAuthentication } from '@hooks/index'
import { Container } from '@material-ui/core'
import InfoCard from '@components/info-card'
import { groupNumberToLabel, groups } from '@utils/user-groups'

const DummyPermissions = {
  isAdmin: true,
  isSubmitter: true,
  isProcessor: true,
}

const Dashboard = () => {
  const [isLoading, username, userGroups] = useAuthentication() as [
    boolean,
    string,
    Array<Number>
  ]

  const getUserGroups = (groupNumbers) => {
    let groupsDisplay = ''
    let firstGroup = true
    groupNumbers.map((groupNumber) => {
      const label = groupNumberToLabel[groupNumber]
      if (label) {
        if (firstGroup) {
          firstGroup = false
        } else {
          groupsDisplay += `, `
        }
        groupsDisplay += `${label}`
      }
    })
    return groupsDisplay
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Container>
      <h1>{`Username: ${username}`}</h1>
      <h2>{`Groups: ${getUserGroups(userGroups)}`}</h2>
      {userGroups.includes(groups['Trading Card Management'].id) && (
        <InfoCard
          title={'Edit Users'}
          body={
            'Modify user data including subscription status and permissions'
          }
          href={'/Dashboard/edit-users'}
        />
      )}
      {(userGroups.includes(groups['Trading Card Management'].id) ||
        userGroups.includes(groups.Approver.id)) && (
        <InfoCard
          title={'Edit Cards'}
          body={
            'Modify card information including approval and current rotation'
          }
          href={'/dashboard/edit-cards'}
        />
      )}
      {(userGroups.includes(groups['Trading Card Management'].id) ||
        userGroups.includes(groups.Approver.id)) && (
        <InfoCard
          title={'Process Cards'}
          body={'Approve or delete cards in the processing queue'}
          href={'/dashboard/process-cards'}
        />
      )}
      {(userGroups.includes(groups['Trading Card Management'].id) ||
        userGroups.includes(groups.Submitter.id)) && (
        <InfoCard
          title={'Submit Cards'}
          body={'Submit cards for approval'}
          href={'/dashboard/submit-cards'}
        />
      )}
      <InfoCard
        title={'Search Cards'}
        body={'Search for cards based on their meta data'}
        href={'/dashboard/search-cards'}
      />
    </Container>
  )
}

export default Dashboard
