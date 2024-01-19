import { DefaultLayout } from '@components/v3/layout/DefaultLayout'
import { useSession } from '@hooks/useSession'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const index = () => {
  const router = useRouter()

  useEffect(() => {}, [])

  return (
    <DefaultLayout title="Home">
      <div />
    </DefaultLayout>
  )
}

export default index
