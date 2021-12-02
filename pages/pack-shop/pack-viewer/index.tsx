import React, { useEffect, useState } from 'react'
import cards from '@utils/test-data/cards.json'
// import AnimatedPackViewer from '../animated-pack-viewer'
import StaticPackViewer from '../static-pack-viewer'
import makeApiCall from '@pages/api/base'

type ViewerType = 'animated' | 'static'

const PackViewer = () => {
  const [packCards, setPackCards] = useState([])
  const [cardsLoading, setCardsLoading] = useState(false)
  const [packViewerType, setPackViewerType] = useState<ViewerType>('animated')

  useEffect(() => {
    // need to get the cards from the most recently opened pack for the current user
    makeApiCall({
      url: '',
      method: '',
    })

    setCardsLoading(true)
    setPackCards(cards.data.slice(0, 6))
    setCardsLoading(false)
  }, [])

  console.log(packCards)

  return <StaticPackViewer cards={packCards} />

  // return packViewerType === 'static' ? (
  //   <AnimatedPackViewer cards={packCards} />
  // ) : (
  //   <StaticPackViewer cards={packCards} />
  // )
}

export default PackViewer
