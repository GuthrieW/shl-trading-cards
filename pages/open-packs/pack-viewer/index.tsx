import React, { useEffect, useState } from 'react'
import cards from '@utils/test-data/cards.json'
import AnimatedPackViewer from '../animated-pack-viewer'
import StaticPackViewer from '../static-pack-viewer'

type ViewerType = 'animated' | 'static'

const PackViewer = () => {
  const [packCards, setPackCards] = useState(cards.data.slice(0, 6))
  const [cardsLoading, setCardsLoading] = useState(false)
  const [packViewerType, setPackViewerType] = useState<ViewerType>('animated')

  // useEffect(() => {
  //   setCardsLoading(true)
  //   console.log(packCards)
  //   setPackCards()
  //   setCardsLoading(false)
  // }, [packCards])

  console.log(packCards)

  return packViewerType === 'animated' ? (
    <AnimatedPackViewer cards={packCards} />
  ) : (
    <StaticPackViewer cards={packCards} />
  )
}

export default PackViewer
