import react, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useCookie } from './useCookie'
import config from 'lib/config'
import axios, { AxiosResponse } from 'axios'
import { POST } from '@constants/http-methods'
import { StatusCodes } from 'http-status-codes'
import { LoginData } from '@pages/api/v3/auth/login'
import { TokenData } from '@pages/api/v3/auth/token'

type Session = {
  token: string
}

type SessionContextType = {
  session: Session | null
  setSession: (session: Session | null) => void
  isLoggedIn: boolean
  isLoading: boolean
  handleLogin: (username: string, password: string) => Promise<void>
  handleRefresh: () => Promise<void>
  handleLogout: () => void
}

export const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoggedIn: false,
  isLoading: true,
  setSession: () => {},
  handleLogin: () => Promise.resolve(),
  handleRefresh: () => Promise.resolve(),
  handleLogout: () => {},
})

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [, setUserID, deleteUserID] = useCookie(config.userIDCookieName)

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      const response: AxiosResponse<LoginData, any> = await axios({
        method: POST,
        url: '/api/v3/auth/login',
        data: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status !== StatusCodes.OK) {
        throw new Error(response.data.status)
      }

      if (response.data.status === 'error') {
        throw new Error(response.data.errorMessage)
      }

      setSession({ token: response.data.payload.accessToken })

      if (window) {
        window.localStorage.setItem(
          'refreshToken',
          response.data.payload.refreshToken
        )
      }

      setUserID(response.data.payload.userid.toString())
    },
    [setUserID]
  )

  const isRefreshingRef = useRef(false)

  const handleLogout = useCallback(() => {
    if (!window) return
    setSession(null)
    window.localStorage.removeItem('refreshToken')
    deleteUserID()
  }, [deleteUserID])

  const handleRefresh = useCallback(async () => {
    if (isRefreshingRef.current === true) {
      setTimeout(() => (isRefreshingRef.current = false), 1000)
      return
    }

    isRefreshingRef.current = true

    const response: AxiosResponse<TokenData, any> = await axios({
      method: POST,
      url: '/api/v1/auth/token',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        refreshToken: window.localStorage.getItem('refreshToken'),
      }),
    })

    if (response.status !== StatusCodes.OK) {
      handleLogout()
      setIsLoading(false)
      isRefreshingRef.current = false
      return
    }

    setSession({ token: response.data.payload.accessToken })
    setIsLoading(false)
    isRefreshingRef.current = false

    window.localStorage.setItem(
      'refreshToken',
      response.data.payload.refreshToken
    )
    setUserID(response.data.payload.userid.toString())
  }, [handleLogout])

  useEffect(() => {
    if (!session) {
      if (window && window.localStorage.getItem('refreshToken')) {
        handleRefresh()
        return
      }
      setIsLoading(false)
    }
  }, [])

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoggedIn: !!session,
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
