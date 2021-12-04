import React, { useState } from 'react'
// import AnimatedPackViewer from '../animated-pack-viewer'
import StaticPackViewer from '../static-pack-viewer'
import useLatestPackCards from '@hooks/use-latest-pack-cards'

type ViewerType = 'animated' | 'static'

const PackViewer = () => {
  const [packViewerType, setPackViewerType] = useState<ViewerType>('animated')
  const { latestPackCards, isLoading, isError } = useLatestPackCards()

  return <StaticPackViewer cards={latestPackCards} />

  // return packViewerType === 'static' ? (
  //   <AnimatedPackViewer cards={packCards} />
  // ) : (
  //   <StaticPackViewer cards={packCards} />
  // )
}

export default PackViewer
