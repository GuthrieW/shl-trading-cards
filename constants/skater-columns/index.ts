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
    label: 'Author ID',
    name: 'author_userID',
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
    label: 'Name',
    name: 'player_name',
  },
  {
    label: 'Rarity',
    name: 'card_rarity',
  },
  {
    label: 'Season',
    name: 'season',
  },
  {
    label: 'Position',
    name: 'position',
  },
  {
    label: 'OVR',
    name: 'overall',
  },
  {
    label: 'SKA',
    name: 'skating',
  },
  {
    label: 'SHT',
    name: 'shooting',
  },
  {
    label: 'HND',
    name: 'hands',
  },
  {
    label: 'CHK',
    name: 'checking',
  },
  {
    label: 'DEF',
    name: 'defense',
  },
  {
    label: 'Image',
    name: 'image_url',
    options: {
      filter: false,
      sort: false,
    },
  },
]

export default skaterColumns
