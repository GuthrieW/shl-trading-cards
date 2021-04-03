import React, { useState } from 'react'
import SkaterForm from './SkaterForm'
import GoalieForm from './GoalieForm'

const SubmitCards = () => {
  const [isSkater, setIsSkater] = useState(true)

  return (
    <div
      style={{
        margin: '10px',
        alignItems: 'center',
        position: 'static',
        width: '50%',
      }}
    >
      {isSkater ? (
        <SkaterForm setIsSkater={setIsSkater} />
      ) : (
        <GoalieForm setIsSkater={setIsSkater} />
      )}
    </div>
  )
}

export default SubmitCards
