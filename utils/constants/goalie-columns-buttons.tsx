import { Button } from '@material-ui/core'

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
          <Button>Accept</Button>
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
          <Button>Deny</Button>
        </div>
      ),
    },
  },
]

export default goalieColumns
