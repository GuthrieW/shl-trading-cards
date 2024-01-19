import { useRouter } from 'next/router'
import { useEffect } from 'react'
const index = () => {
  const router = useRouter()

  useEffect(() => {}, [])

  if (typeof window !== 'undefined') {
    router.push('/home')
  }

  return <div />
}

export default index
