import { Button } from '@material-ui/core'
import React from 'react'

const skaterColumns = [
  {
    label: 'Name',
    name: 'playerName',
  },
  {
    label: 'Team',
    name: 'team',
  },
  {
    label: 'Rarity',
    name: 'rarity',
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
    name: 'imageUrl',
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'Accept Card',
    options: {
      filter: false,
      sort: false,
      empty: true,
      customBodyRenderLite: (dataIndex) => (
        <div style={{ textAlign: 'center' }}>
          <Button color={'default'} variant={'outlined'}>
            Accept
          </Button>
        </div>
      ),
    },
  },
  {
    name: 'Deny Card',
    options: {
      filter: false,
      sort: false,
      empty: true,
      customBodyRenderLite: (dataIndex) => (
        <div style={{ textAlign: 'center' }}>
          <Button color={'secondary'} variant={'outlined'}>
            Deny
          </Button>
        </div>
      ),
    },
  },
]

export default skaterColumns
