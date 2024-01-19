export const getRefreshTokenExpirationDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

export const convertRefreshTokenExpirationDate = (datetime: string) => {
  try {
    return Date.parse(datetime)
  } catch {
    return 0
  }
}
