const onlyGoalieCards = (cards): Card[] => {
  const goalieCards = cards.filter((card) => {
    return card.position === 'G'
  })

  return goalieCards
}

export default onlyGoalieCards
