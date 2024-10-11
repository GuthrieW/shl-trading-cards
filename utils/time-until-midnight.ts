export const TimeUntilMidnight = (): string => {
    const now = new Date()
    const nextMidnight = new Date(now)
    nextMidnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = nextMidnight.getTime() - now.getTime()
    const hours = Math.floor(msUntilMidnight / (1000 * 60 * 60))
    const minutes = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60))
  
    return `${hours}h ${minutes}m`
  }