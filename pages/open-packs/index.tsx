import React, { useEffect, useState } from 'react'
import {
  Badge,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import useStyles from './index.styles'
import Loading from '@components/loading'
import packs from '@utils/constants/packs'
import OpenPacksIcon from '@public/icons/open-packs-icon'

const OpenPacks = () => {
  const theme = useTheme()
  const classes = useStyles()

  const [isLoading, setIsLoading] = useState(true)
  const [isRedirect, setIsRedirect] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const getNumberOfPacks = (packType) => {
    return 0
  }

  const handleOnClick = async (packType) => {
    console.log(`The type is ${packType}`)
  }

  return (
    <>
      {isLoading && <Loading />}
      {isRedirect && <h1>Redirecting</h1>}
      <GridList
        className={classes.packsGrid}
        spacing={16}
        cellHeight={400}
        cols={2}
      >
        {packs.map((pack) => {
          const { key, label, imageUrl } = pack
          return (
            <GridListTile className={classes.cardContainer} key={key}>
              <div className={classes.linkContainer}>
                <img
                  className={classes.packImage}
                  src={imageUrl}
                  onClick={() => handleOnClick(key)}
                ></img>
              </div>
              <div onClick={() => handleOnClick(key)}>
                <GridListTileBar
                  title={`Open ${label} Pack`}
                  actionIcon={
                    <IconButton aria-label={`Info about ${label}`}>
                      <Badge
                        max={999}
                        color={'secondary'}
                        badgeContent={getNumberOfPacks(key)}
                        showZero={true}
                      >
                        <OpenPacksIcon />
                      </Badge>
                    </IconButton>
                  }
                />
              </div>
            </GridListTile>
          )
        })}
      </GridList>
    </>
  )
}

export default OpenPacks
