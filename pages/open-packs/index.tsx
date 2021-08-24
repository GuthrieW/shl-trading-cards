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
import packsMap from '@utils/constants/packs-map'
import OpenPacksIcon from '@public/icons/open-packs-icon'

const OpenPacks = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [isRedirect, setIsRedirect] = useState(false)

  useEffect(() => {
    setIsFetching(true)
    const fetchData = async () => {
      setIsFetching(false)
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
      {isRedirect && <h1>Redirecting</h1>}
      <GridList spacing={16} cellHeight={400} cols={2}>
        {packsMap.map((pack) => {
          const { key, label, imageUrl } = pack
          return (
            <GridListTile key={key}>
              <div>
                <img src={imageUrl} onClick={() => handleOnClick(key)}></img>
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
