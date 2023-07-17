export type Position = 'F' | 'D' | 'G'

export type IndexSkaterAttributes = {
  screening?: number
  gettingOpen?: number
  passing?: number
  puckhandling?: number
  shootingAccuracy?: number
  shootingRange?: number
  offensiveRead?: number
  checking?: number
  hitting?: number
  positioning?: number
  stickchecking?: number
  shotBlocking?: number
  faceoffs?: number
  defensiveRead?: number
  acceleration?: number
  agility?: number
  balance?: number
  speed?: number
  stamina?: number
  strength?: number
  fighting?: number
}

export type IndexGoalieAttributes = {
  blocker?: number
  glove?: number
  passing?: number
  pokeCheck?: number
  positioning?: number
  rebound?: number
  recovery?: number
  puckhandling?: number
  lowShots?: number
  reflexes?: number
  skating?: number
  mentalToughness?: number
  goalieStamina?: number
}

export type IndexPlayer = IndexSkaterAttributes &
  IndexGoalieAttributes & {
    id: string
    league: number
    season: number
    name: string
    team: string
    aggression: number
    bravery: number
    determination: number
    teamPlayer: number
    leadership: number
    temperament: number
    professionalism: number
    position: string
    appliedTPE: number
  }

export type DeleteRequest = {
  cardId: string
}
