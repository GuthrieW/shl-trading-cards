import { toZonedTime } from 'date-fns-tz'

export const timeUntilMarketplaceReset = (): string => {
  const now = new Date()
  const estTimeZone = 'America/New_York'
  const estNow = toZonedTime(now, estTimeZone)

  // Find next Sunday at midnight EST
  const nextSunday = new Date(estNow)
  const daysUntilSunday = (8 - estNow.getDay()) % 7 || 7
  nextSunday.setDate(estNow.getDate() + daysUntilSunday)
  nextSunday.setHours(0, 0, 0, 0)

  const msUntilReset = nextSunday.getTime() - estNow.getTime()

  const days = Math.floor(msUntilReset / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (msUntilReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
