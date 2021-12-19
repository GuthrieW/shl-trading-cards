import { PeriodType } from '../../index.d'

const getNewPeriodTime = (periodType: PeriodType): number => {
  if (periodType === 'regulation') {
    return 1200
  }

  if (periodType === 'overtime') {
    return 300
  }

  if (periodType === 'shootout') {
    return 1
  }
}

export default getNewPeriodTime
