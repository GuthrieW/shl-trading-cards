import React, { useEffect } from 'react'
import useAuthentication from '@hooks/use-authentication'
import Loading from '@components/loading'

const Collection = (props) => {
  const { shlUsername } = props
  const [isLoading, username, userGroups] = useAuthentication() as [
    boolean,
    string,
    Array<Number>
  ]

  console.log('props', props)

  useEffect(() => {})

  const headerText = shlUsername
    ? `${shlUsername}'s Cards`
    : `${username}'s Cards`

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div>
        <h1>{headerText}</h1>
        <h1>{headerText}</h1>
      </div>
    </>
  )
}

export default Collection
