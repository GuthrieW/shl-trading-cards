import { Card } from 'index.d'

const onlySkaterCards = (cards): Card[] => {
  const skaterCards = cards.filter((card) => {
    return card.position !== 'G'
  })

  return skaterCards
}

export default onlySkaterCards
