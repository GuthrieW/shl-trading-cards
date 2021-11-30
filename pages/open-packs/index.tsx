import React, { useEffect, useState } from 'react'
import {
  Badge,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from '@material-ui/core'
import packsMap from 'constants/packs-map'
import OpenPacksIcon from '@public/icons/open-packs-icon'
import { ImageItem, OpenPacksScreen } from './styled'

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
    <OpenPacksScreen>
      {isRedirect && <h1>Redirecting</h1>}
      <ImageList gap={16} rowHeight={400} cols={3}>
        {packsMap.map((pack) => {
          const { key, label, imageUrl } = pack
          return (
            <ImageListItem key={key}>
              <ImageItem>
                <img
                  height={'400px'}
                  src={imageUrl}
                  onClick={() => handleOnClick(key)}
                />
              </ImageItem>
              <div onClick={() => handleOnClick(key)}>
                <ImageListItemBar
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
            </ImageListItem>
          )
        })}
      </ImageList>
    </OpenPacksScreen>
  )
}

export default OpenPacks
