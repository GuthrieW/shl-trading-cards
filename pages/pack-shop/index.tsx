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
import Router from 'next/router'
import useBuyPack from '@hooks/use-buy-pack'
import useCurrentUser from '@hooks/use-current-user'
import PageHeader from '@components/page-header'

const OpenPacks = () => {
  const { currentUser, isLoading, isError } = useCurrentUser()

  const handleOpenPack = async (packType) => {
    // this probably needs to be re-done, using a hook to make an API call like this feels weird
    const { result, isLoading, isError } = useBuyPack(currentUser)

    if (result.packPurchased) {
      Router.push('/pack-shop/pack-viewer')
    } else {
      // tell the user that the pack purchase was unsuccessful
    }
  }

  return (
    <OpenPacksScreen>
      <PageHeader>Pack Shop</PageHeader>
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
                      <Badge max={999} color={'secondary'} showZero={true}>
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
