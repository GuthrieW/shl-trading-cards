import { POST } from '@constants/http-methods'
import { useCookie } from '@hooks/useCookie'
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import config from 'lib/config'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type Session = {
  token: string
  userId: string
}

export const SessionContext = createContext<{
  session: Session | null
  loggedIn: boolean
  isLoading: boolean
  setSession: (session: Session | null) => void
  handleLogin: (username: string, password: string) => Promise<void>
  handleRefresh: () => Promise<void>
  handleLogout: () => void
}>({
  session: null,
  loggedIn: false,
  isLoading: true,
  setSession: () => {},
  handleLogin: () => Promise.resolve(),
  handleRefresh: () => Promise.resolve(),
  handleLogout: () => {},
})

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [, setUserID, deleteUserID] = useCookie(config.userIDCookieName)
  const [, setRefreshToken, deleteRefreshToken, getRefreshToken] = useCookie(
    config.refreshTokenCookieName
  )

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      const response = await axios({
        method: POST,
        url: '/api/v3/auth/login',
        data: { username, password },
      })

      if (response.status !== StatusCodes.OK || response.data.error) {
        throw new Error(response.data)
      }

      setSession({
        token: response.data.payload.accessToken,
        userId: response.data.payload.userid,
      })

      setRefreshToken(response.data.payload.refreshToken)
      setUserID(response.data.payload.userid)
      setIsLoading(false)

      return
    },
    [setUserID]
  )

  const handleLogout = useCallback(() => {
    setSession(null)
    deleteRefreshToken(config.refreshTokenCookieName)
    deleteUserID()
  }, [deleteRefreshToken, deleteUserID])

  const isRefreshingRef = useRef(false)

  const handleRefresh = useCallback(async () => {
    if (isRefreshingRef.current === true) {
      setTimeout(() => (isRefreshingRef.current = false), 1000)
      return
    }

    isRefreshingRef.current = true

    const response = await axios({
      method: POST,
      url: '/api/v3/auth/token',
      data: {
        refreshToken: getRefreshToken(),
      },
    })

    if (response.status !== StatusCodes.OK) {
      handleLogout()
      setIsLoading(false)
      isRefreshingRef.current = false
      return
    }

    if (response.data.status === 'logout') {
      handleLogout()
      setIsLoading(false)
      isRefreshingRef.current = false
      return
    }

    setSession({
      token: response.data.payload.accessToken,
      userId: response.data.payload.userid,
    })
    setIsLoading(false)
    isRefreshingRef.current = false

    setRefreshToken(response.data.payload.refreshToken)
    setUserID(response.data.payload.userid)
  }, [handleLogout])

  useEffect(() => {
    if (!session) {
      if (getRefreshToken()) {
        handleRefresh()
        return
      }
      setIsLoading(false)
    }
  }, [])

  const loggedIn = useMemo(() => !!session, [session])

  return (
    <SessionContext.Provider
      value={{
        session,
        loggedIn,
        isLoading,
        setSession,
        handleLogin,
        handleRefresh,
        handleLogout,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
