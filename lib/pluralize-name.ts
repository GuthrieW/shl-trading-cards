export const pluralizeName = (username: string): string => {
  if (username?.endsWith('s') ? "'" : "'s") {
    return `${username}'s`
  } else {
    return `${username}'`
  }
}
