import React from 'react'
import { useQuery } from 'react-query'
import getExample from '@requests/example'

const example = () => {
  const {
    isLoading: exampleIsLoading,
    error: exampleError,
    data: exampleData,
  } = useQuery('getExample', async () => {
    const response = await getExample()
    return response
  })

  return (
    <>
      <h1>Example</h1>
      <p>{exampleIsLoading}</p>
      <p>{exampleError}</p>
      <p>{exampleData}</p>
    </>
  )
}

export default example
