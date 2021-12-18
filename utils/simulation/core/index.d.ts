export type GameLog = {
  textLog: string[]
  statistics: any
}

export type NewEvent = {
  name: string
  eventType: GameEvent | PrimaryEvent | SecondaryEvent | LineChangeEvent
  eventData: any
}

// Game Events - Events that happen which start or end play or disrupt the normal flow of the game ()
export type GameEvent =
  | 'starting-faceoff'
  | 'faceoff'
  | 'end-of-period'
  | 'end-of-game'
  | 'penalty-shot'
  | 'shootout-attempt'

// Primary Events - Events which lead to a more specific secondary event. These are always committed by a single player but may involved a second player
export type PrimaryEvent =
  | 'shot'
  | 'hit'
  | 'stickcheck'
  | 'pass'
  | 'zone-entry'
  | 'puck-dump'

// Secondary Events - Events which have a specific effect on the game and the result of either a previous primary or secondary action
export type SecondaryEvent = 'goal' | 'save'

// Line Change Event - Events which occur when a player currently on the ice is removed and replaced by another
export type LineChangeEvent =
  | 'pull-goalie'
  | 'replace-goalie'
  | 'full-line-change'
  | 'individual-line-change'
