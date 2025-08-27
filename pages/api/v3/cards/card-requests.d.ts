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
    renderName?: string
  }

export type PortalSkaterAttributes = {
  screening: number
  gettingOpen: number
  passing: number
  puckhandling: number
  shootingAccuracy: number
  shootingRange: number
  offensiveRead: number
  checking: number
  hitting: number
  positioning: number
  stickchecking: number
  shotBlocking: number
  faceoffs: number
  defensiveRead: number
  acceleration: number
  agility: number
  balance: number
  speed: number
  stamina: number
  strength: number
  fighting: number
  aggression: number
  bravery: number
  determination: number
  teamPlayer: number
  leadership: number
  temperament: number
  professionalism: number
}

export type PortalGoalieAttributes = {
  blocker: number
  glove: number
  passing: number
  pokeCheck: number
  positioning: number
  rebound: number
  recovery: number
  puckhandling: number
  lowShots: number
  reflexes: number
  skating: number
  aggression: number
  mentalToughness: number
  determination: number
  teamPlayer: number
  leadership: number
  goaltenderStamina: number
  professionalism: number
}

export type PortalAttributes = PortalSkaterAttributes | PortalGoalieAttributes

export type PortalIndexRecord = {
  leagueID: number
  indexID: number
  startSeason: number
}

export type PortalPlayer = {
  uid: number
  username: string
  pid: number
  creationDate: Date
  retirementData: Date
  status: string
  name: string
  position: string
  handedness: 'Left' | 'Right'
  recruiter: string
  render: string
  jerseyNumber: number
  height: string
  weight: number
  birthplace: string
  totalTPE: number
  appliedTPE: number
  bankedTPE: number
  draftSeason: number
  currentLeague: string
  currentTeamID: number
  shlRightsTeamID: number
  smjhlRightsTeamID: number
  iihfNation: string
  usedRedistribution: 0 | 1
  positionChanged: 0 | 1
  coachingPurchased: number
  trainingPurchased: number
  activityCheckComplete: boolean
  trainingCampeComplete: boolean
  bankBalance: number
  taskStatus: string
  attributes: PortalAttributes
  isSuspended: 0 | 1
  indexRecords: PortalIndexRecord[]
  inactive: boolean
}

export type PlayerHistory = {
  playerUpdateID: number
  playerName: string
  userID: number
  fhmID: number
  leagueID: number
  seasonID: number
  teamID: number
  achievement: number
  achievementName: string
  achievementDescription: string
  isAward: boolean
  won: boolean
}
type ImportError = {
  error: string
  player: IndexPlayer
}
