import { serialize } from 'cookie'
import { useCallback, useMemo, useState } from 'react'

const MILLISECONDS_IN_DAY: number = 60 * 60 * 24 * 1000

export const useCookie = <T extends string>(
  key: string,
  defaultValue?: T
): [
  T | null,
  (value: T, expDays?: number) => void,
  (path?: string, domain?: string) => void,
] => {
  const getCookie = useCallback((key: string) => {
    if (typeof window === 'undefined') return null
    const cookie = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${key}=`))

    if (!cookie) {
      return null
    }

    const [, value] = cookie?.split('=')
    return decodeURIComponent(value)
  }, [])

  const initialCookie = useMemo(
    () => getCookie(key) || defaultValue,
    [defaultValue, getCookie, key]
  )

  const [cookie, setCookie] = useState<T | null>(initialCookie as T)

  const updateCookie = useCallback(
    (value: T, expDays: number = 1) => {
      document.cookie = serialize(key, value, {
        expires: new Date(Date.now() + expDays * MILLISECONDS_IN_DAY),
        path: '/',
        sameSite: 'lax',
        domain: '.simulationhockey.com',
      })

      setCookie(value)
    },
    [key]
  )

  const removeCookie = useCallback(
    (path?: string, domain?: string) => {
      if (cookie !== null) {
        document.cookie = serialize(key, '', {
          maxAge: -1,
          path: path ?? '/',
          domain,
        })

        setCookie(null)
      }
    },
    [cookie, key]
  )

  return [cookie, updateCookie, removeCookie]
}
