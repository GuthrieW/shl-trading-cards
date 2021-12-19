import { Game, GameEvent, NewEvent, EventData, PeriodType } from './index.d'
import { getLineup, getNewPeriodTime } from './utils/index'
import handleEvent from './event-handler'

const runSimulation = (
  homeTeamUser: User,
  homeTeamCards: Card[],
  awayTeamUser: User,
  awayTeamCards: Card[]
): Game => {
  const homeTeamLines = getLineup(homeTeamCards)
  const awayTeamLines = getLineup(awayTeamCards)

  let game: Game = {
    gameState: 'unplayed',
    clockState: 'stopped',
    gameLog: { textLog: [], statistics: {} },
    homeTeamOwner: homeTeamUser,
    homeLineup: homeTeamLines,
    awayTeamOwner: awayTeamUser,
    awayLineup: awayTeamLines,
  }

  game = simulatePeriod('regulation', game)
  game = simulatePeriod('regulation', game)
  game = simulatePeriod('regulation', game)

  if (game.gameState !== 'finished') {
    game = simulatePeriod('overtime', game)
  }

  if (game.gameState !== 'in-progress') {
    game = simulatePeriod('shootout', game)
  }

  return game
}

const simulatePeriod = (periodType: PeriodType, game: Game): Game => {
  const periodClock: number = getNewPeriodTime(periodType)

  while (periodClock > 0) {
    if (game.clockState === 'stopped') {
      game = handleEvent({
        game: game,
        eventType: 'faceoff',
        eventData: {
          description: 'Beginning of period faceoff',
        },
      })

      game.clockState = 'running'
    } else {
    }
  }

  return game
}

export default runSimulation
