export type Game = {
  gameLog: GameLog
  gameState: GameState
  clockState: ClockState
  homeTeamOwner: User
  homeLineup: Lineup
  awayTeamOwner: User
  awayLineup: Lineup
}

export type Skater = {
  playerID: number
  player_name: string
  position: string
  card_rarity: string
  overall: number
  skating: number
  shooting: number
  hands: number
  checking: number
  defense: number
}

export type Goalie = {
  playerID: number
  player_name: string
  position: string
  card_rarity: string
  overall: number
  high_shots: number
  low_shots: number
  quickness: number
  control: number
  conditioning: number
}

export type Lineup = {
  center_1: Skater
  center_2: Skater
  center_3: Skater
  center_4: Skater
  leftWing_1: Skater
  leftWing_2: Skater
  leftWing_3: Skater
  leftWing_4: Skater
  rightWing_1: Skater
  rightWing_2: Skater
  rightWing_3: Skater
  rightWing_4: Skater
  leftDefense_1: Skater
  leftDefense_2: Skater
  leftDefense_3: Skater
  rightDefense_1: Skater
  rightDefense_2: Skater
  rightDefense_3: Skater
  goalie_1: Goalie
  goalie_2: Goaile
}

export type ClockState = 'running' | 'stopped'

export type GameState = 'unplayed' | 'in-progress' | 'finished'

export type GameLog = {
  textLog: string[]
  statistics: any
}

export type NewEvent = {
  game: Game
  eventType: GameEvent | PrimaryEvent | SecondaryEvent | LineChangeEvent
  eventData: EventData
}

export type EventData = {
  description: string
}

// Game Events - Events that happen which start or end play or disrupt the normal flow of the game ()
export type GameEvent =
  | 'start-of-period'
  | 'end-of-game'
  | 'penalty'
  | 'penalty-shot'
  | 'shootout-attempt'

// Primary Events - Events which lead to a more specific secondary event. These are always committed by a single player but may involved a second player
export type PrimaryEvent =
  | 'faceoff'
  | 'shot'
  | 'pass'
  | 'skate'
  | 'dangle'
  | 'dump-puck'
  | 'hit'
  | 'stickcheck'

// Secondary Events - Events which have a specific effect on the game and the result of either a previous primary or secondary action
export type SecondaryEvent =
  | SecondaryFaceoffEvent
  | SecondaryShotEvent
  | SecondaryPassEvent
  | SecondarySkatingEvent
  | SecondaryDangleEvent
  | SecondaryPuckDumpEvent
  | SecondaryHitEvent
  | SecondaryStickcheckEvent

export type SecondaryFaceoffEvent = 'clean-win' | 'tie-up'

export type SecondaryShotEvent = 'goal' | 'save' | 'shot-block'

export type SecondaryPassEvent =
  | 'missed-pass'
  | 'successful-pass'
  | 'interception'

export type SecondarySkatingEvent = ''

export type SecondaryDangleEvent = ''

export type SecondaryPuckDumpEvent = ''

export type SecondaryHitEvent = ''

export type SecondaryStickcheckEvent = ''

// Line Change Event - Events which occur when a player currently on the ice is removed and replaced by another
export type LineChangeEvent =
  | 'pull-goalie'
  | 'replace-goalie'
  | 'full-line-change'
  | 'individual-line-change'

export type PeriodType = 'regulation' | 'overtime' | 'shootout'
