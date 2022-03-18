// data types
type Card = {
  cardID: number
  teamID: number
  playerID: number
  author_userID: number
  card_rarity: string
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

type CardRequest = {
  teamID?: number
  playerID?: number
  card_rarity: string
  player_name: string
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
}

type SetCard = {
  cardID: number
  setID: number
}

type Collection = {
  userID: number
  cardID: number
  quantity: number
}

type CardSet = {
  setID: number
  name: string
  description: string
}

type StartingLineup = {
  userID: number
  center: number
  rightwing: number
  leftwing: number
  rightdefense: number
  leftdefense: number
  goalie: number
}

type Trade = {
  tradeID: number
  tradeAssetID: number
  fromID: number
  toID: number
  cardID: number
  trade_status: string
  create_date: Date
  update_data: Date
}

type User = {
  uid: number
  username: string
  avatar?: string
  usergroup?: number
  additionalgroups?: string
  displaygroup?: number
}

type Rarity = {
  rarity: string
  imageUrl: string
  enabled: boolean
}

type PackKey = 'base'
type PackLabel = 'Base'

type PackType = {
  key: PackKey
  label: PackLabel
  imageUrl: string
}

// table types

type PlayerTableButtons = {
  id: PlayerTableButtonId
  text: string
  disabled: boolean
  onClick: Function
}
type PlayerTableButtonId = 'skaters' | 'goalies'

type CollectionTableButtons = {
  id: string
  text: string
  onClick: Function
}

type ColumnData = {
  id: string
  Header: string
  accessor: string
  title: string
  sortDescFirst: boolean
}

type GridColumn = {
  accessor: string
}
