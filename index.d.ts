// data types
export type Card = {
  cardID: number
  teamID: number
  playerID: number
  author_userID: number
  card_rarity: string
  sub_type: string
  player_name: string
  pullable: boolean
  approved: boolean
  image_url?: string
  position: string
  overall: number
  skating?: number | null
  shooting?: number | null
  hands?: number | null
  checking?: number | null
  defense?: number | null
  high_shots?: number | null
  low_shots?: number | null
  quickness?: number | null
  control?: number | null
  conditioning?: number | null
  season: number
  author_paid: boolean
}

export type CardRequest = {
  teamID?: number
  playerID?: number
  player_name?: string
  season?: number
  card_rarity?: string
  sub_type?: string
  position?: string
  overall?: number
  skating?: number
  shooting?: number
  hands?: number
  checking?: number
  defense?: number
  high_shots?: number
  low_shots?: number
  quickness?: number
  control?: number
  conditioning?: number
}

export type CollectionCard = {
  cardID: number
  quantity: number
  image_url: string
  card_rarity: string
  player_name: string
  overall: number
  teamID: number
}

export type SetCard = {
  cardID: number
  setID: number
}

export type Collection = {
  userID: number
  cardID: number
  quantity: number
}

export type CardSet = {
  setID: number
  name: string
  description: string
}

export type StartingLineup = {
  userID: number
  center: number
  rightwing: number
  leftwing: number
  rightdefense: number
  leftdefense: number
  goalie: number
}

export type Trade = {
  tradeID: number
  tradeAssetID: number
  fromID: number
  toID: number
  cardID: number
  trade_status: string
  create_date: Date
  update_data: Date
}

export type User = {
  uid: number
  username: string
  avatar?: string
  usergroup?: number
  additionalgroups?: string
  displaygroup?: number
  subscription?: number
}

export type PackKey = 'base'
export type PackLabel = 'Base'

export type PackType = {
  key: PackKey
  label: PackLabel
  imageUrl: string
}

export type UserPack = {
  packID: number
  userID: number
  packType: string
  purchaseDate: Date
}

// table types
export type PlayerTableButtons = {
  id: PlayerTableButtonId
  text: string
  disabled: boolean
  onClick: Function
}
export type PlayerTableButtonId = 'skaters' | 'goalies'

export type CollectionTableButtons = {
  id: string
  text: string
  onClick: Function
}

export type ColumnData = {
  id: string
  Header: string
  accessor: string
  title: string
  sortDescFirst: boolean
}

export type GridColumn = {
  accessor: string
}

export type PackData = {
  packID: number
  userID: number
  packType: string
  opened: number
  purchaseDate: Date
  openDate: Date
  source: string
}
