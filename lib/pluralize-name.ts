export const pluralizeName = (username: string): string => {
  if (username?.endsWith('s')) {
    return `${username}`
  } else {
    return `${username}'s'`
  }
}
