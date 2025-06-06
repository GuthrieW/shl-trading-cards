import JsCookie from 'js-cookie'
import { useCallback, useMemo, useState } from 'react'

export const useCookie = <T extends string>(
  key: string,
  defaultValue?: T
): [
  T | null,
  (value: T, expDays?: number) => void,
  (path?: string, domain?: string) => void,
  () => string | null,
] => {
  const getCookie = useCallback(() => {
    const cookie = JsCookie.get(key)

    if (!cookie) {
      return null
    }

    return cookie
  }, [])

  const initialCookie = useMemo(
    () => getCookie() || defaultValue,
    [defaultValue, getCookie]
  )

  const [cookie, setCookie] = useState<T | null>(initialCookie as T)

  const updateCookie = useCallback(
    (value: T, expDays: number = 1) => {
      JsCookie.set(key, value, {
        expires: expDays,
        path: '/',
        sameSite: 'lax',
        ...(window.location.origin.includes('simulationhockey')
          ? { domain: '.simulationhockey.com' }
          : {}),
      })

      setCookie(value)
    },
    [key]
  )

  const removeCookie = useCallback(() => {
    if (cookie !== null) {
      JsCookie.remove(key, {
        ...(window.location.origin.includes('simulationhockey')
          ? { domain: '.simulationhockey.com' }
          : {}),
      })
      setCookie(null)
    }
  }, [cookie, key])

  return [cookie, updateCookie, removeCookie, getCookie]
}
