export interface PlayerCard {
  id: string
  playerName: string
  team: string
  overall: number
  position: string
  imageUrl?: string
  cardID: number
  quantity: number
  rarity: string
}

export interface LineupPosition {
  id: string
  name: string
  position: string
  positionGroup: string
  card: PlayerCard | null
}

export interface LineupCard {
  playerName: string
  team: string
  overall: number
  position: string
  image_url?: string
  card_rarity?: string
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
