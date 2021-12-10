import { Button } from '@material-ui/core'

const claimingGoalieColumns = [
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

export default claimingGoalieColumns
