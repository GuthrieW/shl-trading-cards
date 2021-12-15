const skaterColumns = [
  {
    label: 'Card ID',
    name: 'cardID',
  },
  {
    label: 'Team ID',
    name: 'teamID',
  },
  {
    label: 'Player ID',
    name: 'playerID',
  },
  {
    label: 'Card Creator ID',
    name: 'author_userID',
  },
  {
    label: 'Name',
    name: 'player_name',
  },
  {
    label: 'Rarity',
    name: 'card_rarity',
  },
  {
    label: 'Pullable',
    name: 'pullable',
    options: {
      customBodyRender: (value) => {
        return value === 1 ? 'true' : 'false'
      },
    },
  },
  {
    label: 'Approved',
    name: 'approved',
    options: {
      customBodyRender: (value) => {
        return value === 1 ? 'true' : 'false'
      },
    },
  },
  {
    label: 'Position',
    name: 'position',
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
    label: 'Season',
    name: 'season',
  },
]

export default skaterColumns
