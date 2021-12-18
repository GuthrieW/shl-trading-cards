import { GameLog, NewEvent } from '../index.d'

const logEvent = (gameLog: GameLog, newEvent: NewEvent): GameLog => {
  gameLog.textLog.push(newEvent.eventData.description)
  return gameLog
}

export default logEvent
