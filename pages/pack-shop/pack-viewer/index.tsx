import React, { useEffect, useState } from 'react'
import cards from '@utils/test-data/cards.json'
// import AnimatedPackViewer from '../animated-pack-viewer'
import StaticPackViewer from '../static-pack-viewer'

type ViewerType = 'animated' | 'static'

const PackViewer = () => {
  const [packCards, setPackCards] = useState<Card[]>([])
  const [cardsLoading, setCardsLoading] = useState(false)
  const [packViewerType, setPackViewerType] = useState<ViewerType>('animated')

  useEffect(() => {
    // need to get the cards from the most recently opened pack for the current user

    setCardsLoading(true)
    setPackCards(cards.data.slice(0, 6))
    setCardsLoading(false)
  }, [])

  return <StaticPackViewer cards={packCards} />

  // return packViewerType === 'static' ? (
  //   <AnimatedPackViewer cards={packCards} />
  // ) : (
  //   <StaticPackViewer cards={packCards} />
  // )
}

export default PackViewer
