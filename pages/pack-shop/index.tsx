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
import {
  ImageItem,
  OpenPacksScreen,
  StyledBarContainer,
  StyledImage,
} from './styled'
import users from '@utils/test-data/user.json'
import Router from 'next/router'
import makeApiCall from '@pages/api/base'

const OpenPacks = () => {
  const [currentUser, setCurrentUser] = useState(users.data[0])
  const [userLoading, setUserLoading] = useState(false)
  const [isRedirect, setIsRedirect] = useState(false)

  useEffect(() => {
    setUserLoading(true)
    const fetchData = async () => {
      setUserLoading(false)
    }

    fetchData()
  }, [])

  const getNumberOfPacks = (packType) => {
    if (packType === 'regular') {
      return currentUser.ownedRegularPacks
    } else if (packType === 'challengeCup') {
      return currentUser.ownedChallengeCupPacks
    }
  }

  const handleOpenPack = async (packType) => {
    const response = makeApiCall({
      url: '',
      method: '',
    })

    // call api the and send it the pack type
    // if the user can open a pack redirect them to the selected pack type
    // if the user can't open a pack then don't do anything
    makeApiCall({
      url: '',
      method: '',
    })
    Router.push('/pack-shop/pack-viewer')
  }

  return (
    <OpenPacksScreen>
      <ImageList gap={16} rowHeight={400} cols={3}>
        {packsMap.map((pack) => {
          const { key, label, imageUrl } = pack
          return (
            <ImageListItem key={key}>
              <ImageItem>
                <StyledImage
                  height={'400px'}
                  src={imageUrl}
                  onClick={() => handleOpenPack(key)}
                />
              </ImageItem>
              <StyledBarContainer onClick={() => handleOpenPack(key)}>
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
              </StyledBarContainer>
            </ImageListItem>
          )
        })}
      </ImageList>
    </OpenPacksScreen>
  )
}

export default OpenPacks
