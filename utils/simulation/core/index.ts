type PeriodType = 'first' | 'second' | 'third' | 'overtime' | 'shootout'

const simulation = (homeTeam: Card[], awayTeam: Card[]) => {
  const gameLog = {
    fullLog: [],
  }
  const homeTeamLines = getLines()
  const awayTeamLines = getLines()

  simulatePeriod('first')
  simulatePeriod('second')
  simulatePeriod('third')
}

const simulatePeriod = (periodType: PeriodType) => {
  return
}

const getLines = () => {
  return {
    line1: {
      center: {},
      leftWing: {},
      rightWing: {},
      leftDefense: {},
      rightDefense: {},
      goalie: {},
    },
    line2: {
      center: {},
      leftWing: {},
      rightWing: {},
      leftDefense: {},
      rightDefense: {},
      goalie: {},
    },
    line3: {
      center: {},
      leftWing: {},
      rightWing: {},
      leftDefense: {},
      rightDefense: {},
    },
    line4: {
      center: {},
      leftWing: {},
      rightWing: {},
      leftDefense: {},
      rightDefense: {},
    },
  }
}

export default simulation
