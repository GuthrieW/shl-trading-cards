import { Game, NewEvent } from '../index.d'
import simDangle from './sim-dangle'
import simDumpPuck from './sim-dump-puck'
import simfaceoff from './sim-faceoff'
import simHit from './sim-hit'
import simPass from './sim-pass'
import simShot from './sim-shot'
import simSkate from './sim-skate'
import simStickcheck from './sim-stickcheck'

const handleEvent = ({ game, eventType, eventData }: NewEvent): Game => {
  switch (eventType) {
    case 'faceoff': {
      game = simfaceoff(game)
      break
    }

    case 'shot': {
      game = simShot(game)
      break
    }

    case 'pass': {
      game = simPass(game)
      break
    }

    case 'skate': {
      game = simSkate(game)
      break
    }

    case 'dangle': {
      game = simDangle(game)
      break
    }

    case 'dump-puck': {
      game = simDumpPuck(game)
      break
    }

    case 'hit': {
      game = simHit(game)
      break
    }

    case 'stickcheck': {
      game = simStickcheck(game)
      break
    }
  }

  return game
}

export default handleEvent
