export interface LineupPosition {
  id: string
  name: string
  position: string
  positionGroup: string
  card: Card | null
}

export interface LineupCard {
  playerName: string
  teamID: number
  playerID: number
  cardID: number
  overall: number
  position: string
  image_url?: string
  card_rarity?: string
  sub_type?: string
  render_name?: string
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
  leagueID?: number
}

export interface Lineup {
  id: number
  name: string
  center: LineupCard
  leftWing: LineupCard
  rightWing: LineupCard
  leftDefense: LineupCard
  rightDefense: LineupCard
  goalie: LineupCard
}

// Constants for component dimensions
export const POSITION_CONSTANTS = {
  MIN_HEIGHT: '180px',
  MIN_WIDTH: '200px',
  CARD_MAX_HEIGHT: '240px',
  BADGE_MIN_WIDTH: '28px',
} as const
