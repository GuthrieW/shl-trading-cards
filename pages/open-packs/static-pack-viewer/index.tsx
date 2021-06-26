import {
  GridList,
  GridListTile,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import React from 'react'
import useStyles from './index.styles'

const StaticPackViewer = ({ cards }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <GridList>
      {cards.map((card, index) => {
        return (
          <GridListTile key={index} className={null}>
            <img className={null} src={card.imageUrl} />
          </GridListTile>
        )
      })}
    </GridList>
  )
}

export default StaticPackViewer
