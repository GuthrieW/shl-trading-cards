import { Button, Typography } from '@material-ui/core'
import styled from 'styled-components'

const goalieColumns = [
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
    label: 'High Shots',
    name: 'highShots',
  },
  {
    label: 'Low Shots',
    name: 'lowShots',
  },
  {
    label: 'Quickness',
    name: 'quickness',
  },
  {
    label: 'Control',
    name: 'control',
  },
  {
    label: 'Conditioning',
    name: 'conditioning',
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

export default goalieColumns
