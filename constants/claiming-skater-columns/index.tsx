import { Button } from '@material-ui/core'
import React from 'react'

const claimingSkaterColumns = [
  {
    label: 'Name',
    name: 'player_name',
  },
  {
    label: 'Team',
    name: 'teamID',
  },
  {
    label: 'Rarity',
    name: 'card_rarity',
  },
  {
    label: 'Overall',
    name: 'overall',
  },
  {
    label: 'Skating',
    name: 'skating',
  },
  {
    label: 'Shooting',
    name: 'shooting',
  },
  {
    label: 'Hands',
    name: 'hands',
  },
  {
    label: 'Checking',
    name: 'checking',
  },
  {
    label: 'Defense',
    name: 'defense',
  },
  {
    label: 'Image URL',
    name: 'image_url',
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'Claim Card',
    options: {
      filter: false,
      sort: false,
      empty: true,
      customBodyRenderLite: (dataIndex) => (
        <div style={{ textAlign: 'center' }}>
          <Button color={'default'} variant={'outlined'}>
            Claim
          </Button>
        </div>
      ),
    },
  },
]

export default claimingSkaterColumns
