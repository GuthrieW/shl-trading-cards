import React, { useEffect } from 'react'

const Collection = (props) => {
  const { shlUsername } = props

  useEffect(() => {})

  const headerText = shlUsername ? `${shlUsername}'s Cards` : 'My Cards'

  return (
    <div>
      <h1>{headerText}</h1>
    </div>
  )
}

export default Collection
