import {toZonedTime } from 'date-fns-tz';

export const TimeUntilMidnight = (): string => {
    const now = new Date();
    const estTimeZone = 'America/New_York';
    
    // Convert to Eastern Standard Time (EST)
    const estNow = toZonedTime(now, estTimeZone);
    const nextMidnight = new Date(estNow);
    nextMidnight.setHours(24, 0, 0, 0);

    // Convert next midnight back to UTC for calculation
    const utcNextMidnight = toZonedTime(nextMidnight, estTimeZone);
    const msUntilMidnight = utcNextMidnight.getTime() - now.getTime();

    const hours = Math.floor(msUntilMidnight / (1000 * 60 * 60));
    const minutes = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
};
