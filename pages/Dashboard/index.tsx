import React from 'react'
import { Box, Container, Button } from '@material-ui/core'
import InfoCard from '@components/info-card'
import { groupNumberToLabel, groups } from '@utils/user-groups'
import styled from 'styled-components'

const Dashboard = () => {
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

  return (
    <>
      <HorizontalBox>
        <VerticalBox style={{ width: '50%' }}>
          <h1 style={{ color: 'red' }}>My Header</h1>
        </VerticalBox>
        <VerticalBox style={{ width: '50%' }}>
          {/* <h2>{`Username: ${username}`}</h2> */}
          {/* <h2>{`Groups: ${getUserGroups(userGroups)}`}</h2> */}
          {/* {userGroups.includes(groups['Trading Card Management'].id) && ( */}
          <InfoCard
            title={'Edit Users'}
            body={
              'Modify user data including subscription status and permissions'
            }
            href={'/Dashboard/edit-users'}
          />
          {/* )} */}
          {/* {(userGroups.includes(groups['Trading Card Management'].id) ||
          userGroups.includes(groups.Approver.id)) && ( */}
          <InfoCard
            title={'Edit Cards'}
            body={
              'Modify card information including approval and current rotation'
            }
            href={'/dashboard/edit-cards'}
          />
          {/* )} */}
          {/* {(userGroups.includes(groups['Trading Card Management'].id) ||
          userGroups.includes(groups.Approver.id)) && ( */}
          <InfoCard
            title={'Process Cards'}
            body={'Approve or delete cards in the processing queue'}
            href={'/dashboard/process-cards'}
          />
          {/* )} */}
          {/* {(userGroups.includes(groups['Trading Card Management'].id) ||
          userGroups.includes(groups.Submitter.id)) && ( */}
          <InfoCard
            title={'Submit Cards'}
            body={'Submit cards for approval'}
            href={'/dashboard/submit-cards'}
          />
          {/* )} */}
          <InfoCard
            title={'Search Cards'}
            body={'Search for cards based on their meta data'}
            href={'/dashboard/search-cards'}
          />
        </VerticalBox>
      </HorizontalBox>
    </>
  )
}

const HorizontalBox = styled(Box)`
  display: flex;
  flex-direction: row;
`

const VerticalBox = styled(Box)`
  display: flex;
  flex-direction: column;
`

export default Dashboard
