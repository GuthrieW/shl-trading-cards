export const isValidID = (id: number | undefined | null) =>
  Boolean(id || id === 0)
