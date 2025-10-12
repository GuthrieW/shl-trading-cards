export function parseQueryArray(
  param: string | string[] | undefined
): string[] {
  if (!param) return []
  if (Array.isArray(param)) return param
  try {
    const parsed = JSON.parse(param)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return [param]
  }
}
