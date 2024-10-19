import JsCookie from 'js-cookie'
import { useCallback, useMemo, useState } from 'react'

export const useCookie = <T extends string>(
  key: string,
  defaultValue?: T
): [
  T | null,
  (value: T, expDays?: number) => void,
  (path?: string, domain?: string) => void,
  (key: string) => void,
] => {
  const getCookie = useCallback((key: string) => {
    const cookie = JsCookie.get(key)

    if (!cookie) {
      return null
    }

    return cookie
  }, [])

  const initialCookie = useMemo(
    () => getCookie(key) || defaultValue,
    [defaultValue, getCookie, key]
  )

  const [cookie, setCookie] = useState<T | null>(initialCookie as T)

  const updateCookie = useCallback(
    (value: T, expDays: number = 1) => {
      JsCookie.set(key, value, { expires: expDays, path: '/', sameSite: 'lax' })

      setCookie(value)
    },
    [key]
  )

  const removeCookie = useCallback(() => {
    if (cookie !== null) {
      JsCookie.remove(key)
      setCookie(null)
    }
  }, [cookie, key])

  return [cookie, updateCookie, removeCookie, getCookie]
}
