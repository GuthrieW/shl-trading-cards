import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import React, { useState, useEffect } from 'react'
// import AnimatedPackViewer from '../animated-pack-viewer'
import StaticPackViewer from '../static-pack-viewer'

enum PackViewerTypesEnum {
  Animated = 'animated',
  Static = 'static',
}

const ViewToggler = () => {
  const [cards, setCards] = useState<[any]>([{ imageUrl: '' }])
  const [selectedPackViewer, setSelectedPackViewer] =
    useState<PackViewerTypesEnum>(PackViewerTypesEnum.Animated)

  useEffect(() => {
    const fetchData = async () => {
      setCards([{ imageUrl: '' }])
    }

    fetchData()
  })

  const handleOnChange = (event, newViewingMode) => {
    setSelectedPackViewer(newViewingMode)
  }

  return (
    <div>
      {/* {selectedPackViewer === PackViewerTypesEnum.Animated && (
        <AnimatedPackViewer cards={cards} />
      )} */}
      {selectedPackViewer === PackViewerTypesEnum.Static && (
        <StaticPackViewer cards={cards} />
      )}
      <ToggleButtonGroup
        value={selectedPackViewer}
        exclusive
        onChange={handleOnChange}
        aria-label={'text formatting'}
      >
        <ToggleButton
          value={PackViewerTypesEnum.Animated}
          aria-label={PackViewerTypesEnum.Animated}
        >
          Animated View
        </ToggleButton>
        <ToggleButton
          value={PackViewerTypesEnum.Static}
          aria-label={PackViewerTypesEnum.Static}
        >
          Static View
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}

export default ViewToggler
