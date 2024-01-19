import { SessionContext } from 'contexts/SessionContext'
import { useContext } from 'react'

export const useSession = () => useContext(SessionContext)
