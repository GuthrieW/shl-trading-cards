import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import React, { useState, useEffect } from 'react'
import useStyles from './index.styles'
import AnimatedPackViewer from '../animated-pack-viewer'
import StaticPackViewer from '../static-pack-viewer'

const packViewerTypes = {
  animated: 'animated',
  static: 'static',
}

const ViewToggler = () => {
  const classes = useStyles()

  const [cards, setCards] = useState([])
  const [selectedPackViewer, setSelectedPackViewer] = useState(
    packViewerTypes.animated
  )

  useEffect(() => {
    const fetchData = async () => {
      setCards([])
    }

    fetchData()
  })

  const handleOnChange = (event, newViewingMode) => {
    setSelectedPackViewer(newViewingMode)
  }

  return (
    <div className={classes.packViewerContainer}>
      {selectedPackViewer === packViewerTypes.animated && (
        <AnimatedPackViewer cards={cards} />
      )}
      {selectedPackViewer === packViewerTypes.static && (
        <StaticPackViewer cards={cards} />
      )}
      <ToggleButtonGroup
        className={classes.buttonGroup}
        value={selectedPackViewer}
        exclusive
        onChange={handleOnChange}
        aria-label={'text formatting'}
      >
        <ToggleButton
          value={packViewerTypes.animated}
          aria-label={packViewerTypes.animated}
        >
          Animated View
        </ToggleButton>
        <ToggleButton
          value={packViewerTypes.static}
          aria-label={packViewerTypes.static}
        >
          Static View
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}

export default ViewToggler
