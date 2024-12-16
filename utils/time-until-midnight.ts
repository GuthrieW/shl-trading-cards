import { toZonedTime, format } from 'date-fns-tz'

export const TimeUntilMidnight = (): string => {
  const now = new Date()
  const estTimeZone = 'America/New_York'
  // Convert current time to EST
  const estNow = toZonedTime(now, estTimeZone)
  // Create next midnight in EST
  const nextMidnight = new Date(estNow)
  nextMidnight.setHours(24, 0, 0, 0)

  const msUntilMidnight = nextMidnight.getTime() - estNow.getTime()

  const hours = Math.floor(msUntilMidnight / (1000 * 60 * 60))
  const minutes = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m`
}
