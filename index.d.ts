// data types
type Card = {
  cardID: number
  teamID: number
  playerID: number
  author_userID: number
  card_rarity: string
  sub_type: string
  player_name: string
  render_name?: string
  pullable: 0 | 1
  approved: 0 | 1
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
  author_paid: 0 | 1
  packID?: number
  quantity?: number
  totalCardQuantity?: number
  date_approved: string | null
  author_username: string | null
  total?: number
  leagueID?: number
}

type CardRequest = {
  teamID?: number
  playerID?: number
  card_rarity: string
  sub_type: string
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
  renderName?: string
}

type CollectionCard = {
  cardID: number
  quantity: number
  image_url: string
  card_rarity: string
  player_name: string
  overall: number
  teamID: number
  playerID: number
}

type NewCard = {
  quantity: number
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

type TradeStatus = 'COMPLETE' | 'PENDING' | 'DECLINED' | 'AUTO_DECLINED'

type Trade = {
  tradeID: number
  initiatorID: number
  initiatorUsername: string
  recipientID: number
  recipientUsername: string
  declineUserID: number
  trade_status: TradeStatus
  update_date: Date
  create_date: string
}

type TradeDetails = {
  tradeID: number
  initiatorID: number
  recipientID: number
  trade_status: TradeStatus
  ownedcardid: number
  cardID: number
  image_url: string
  toID: number
  fromID: numer
  create_date: string
  update_date: Date
  initiator_quantity: number
  recipient_quantity: number
}

type User = {
  uid: number
  username: string
  avatar?: string
  usergroup?: number
  additionalgroups?: string
  displaygroup?: number
  subscription?: number
}

type TradeUser = {
  username: string
  userID: number
}

type PackKey = 'base' | 'ruby'
type PackLabel = 'Base' | 'Ruby'

type PackType = {
  key: PackKey
  label: PackLabel
  imageUrl: string
}

type UserPack = {
  packID: number
  userID: number
  packType: string
  purchaseDate: Date
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

type PackData = {
  packID: number
  userID: number
  packType: string
  opened: number
  purchaseDate: Date
  openDate: Date
  source: string
}

type MostCardsOwner = {
  userID: number
  sum: number
  uniqueCards: number
  username: string
  avatar?: string
}

type Donator = {
  uid: number
  subscription: number
}

type InternalUserUniqueCollection = {
  userID: number
  username: string
  card_rarity: string
  owned_count: number
  rarity_rank: number
}

type InternalSiteUniqueCards = {
  card_rarity: string
  total_count: number
}

type Photoshopcsv = {
  firstName: string
  lastName: string
  render: null
  position: string
  skater: boolean
  goalie: boolean
  ATL: boolean
  BAP: boolean
  BUF: boolean
  CGY: boolean
  CHI: boolean
  EDM: boolean
  HAM: boolean
  LAP: boolean
  MAN: boolean
  MIN: boolean
  MTL: boolean
  NEW: boolean
  NOL: boolean
  PHI: boolean
  SFP: boolean
  SEA: boolean
  TBB: boolean
  TEX: boolean
  TOR: boolean
  WPG: boolean
  CIN: boolean
  DEN: boolean
  NSH: boolean
  MAD: boolean
  OA: number
  season: number
  bronze: boolean
  silver: boolean
  gold: boolean
  ruby: boolean
  diamond: boolean
  SKTHGH: number
  SHTLOW: number
  HNDQCK: number
  CHKCTL: number
  DEFCND: number
}
