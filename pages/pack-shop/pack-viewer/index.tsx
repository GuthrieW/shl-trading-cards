import React, { useState } from 'react'
// import AnimatedPackViewer from '../animated-pack-viewer'
import StaticPackViewer from '../static-pack-viewer'
import { useGetLatestPackCards } from '@pages/api/queries/index'
import { getUidFromSession } from '@utils/index'

type ViewerType = 'animated' | 'static'

const PackViewer = () => {
  const [packViewerType, setPackViewerType] = useState<ViewerType>('animated')
  const { latestPackCards, isLoading, isError } = useGetLatestPackCards({
    uid: getUidFromSession(),
  })

  return <StaticPackViewer cards={latestPackCards} />

  // return packViewerType === 'static' ? (
  //   <AnimatedPackViewer cards={packCards} />
  // ) : (
  //   <StaticPackViewer cards={packCards} />
  // )
}

export default PackViewer
