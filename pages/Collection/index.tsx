import React, { useEffect } from 'react'
import Loading from '@components/loading'

export const Collection = (props) => {
  const { shlUsername } = props

  console.log('props', props)

  return (
    <>
      <div>{shlUsername}</div>
    </>
  )
}

export default Collection
