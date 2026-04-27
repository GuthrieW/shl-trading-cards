import { toZonedTime } from 'date-fns-tz'

export const timeUntilMarketplaceReset = (): string => {
  const now = new Date()
  const estTimeZone = 'America/New_York'
  const estNow = toZonedTime(now, estTimeZone)

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

  const fullDuration = {
    days: days,
    hours: hours,
    minutes: minutes,
  }
  const formatter = (style) => new Intl.DurationFormat('en-US', { style })

  return formatter('short').format(fullDuration)
}
