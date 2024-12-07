import { useSession } from 'contexts/AuthContext'

export const AuthGuard = ({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactElement
}) => {
  const { loggedIn } = useSession()
  if (loggedIn) {
    return <>{children}</>
  }

  return fallback ? <>{fallback}</> : null
}
