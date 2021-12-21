const goalieColumns = [
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
    label: 'HSHT',
    name: 'high_shots',
  },
  {
    label: 'LSHT',
    name: 'low_shots',
  },
  {
    label: 'QUI',
    name: 'quickness',
  },
  {
    label: 'CTL',
    name: 'control',
  },
  {
    label: 'CND',
    name: 'conditioning',
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

export default goalieColumns
