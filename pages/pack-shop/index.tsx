import React from 'react'
import {
  Badge,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from '@material-ui/core'
import styled from 'styled-components'
import Router from 'next/router'
import { packsMap } from '@constants/index'
import { useGetCurrentUser } from '@pages/api/queries/index'
import { PageHeader } from '@components/index'
import OpenPacksIcon from '@public/icons/open-packs-icon'

const OpenPacksScreen = styled.div`
  @media only screen and (max-width: 768px) {
    margin: 10px;
  }

  @media only screen and (min-width: 768px) {
    margin: 10px;
  }
`
const ImageItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledImage = styled.img`
  cursor: pointer;
`

const StyledBarContainer = styled.div`
  cursor: pointer;
`

const OpenPacks = () => {
  const { currentUser, isLoading, isError } = useGetCurrentUser()

  const handleOpenPack = async (packType) => {
    // this probably needs to be re-done, using a hook to make an API call like this feels weird
    // const { result, isLoading, isError } = useBuyPack(currentUser)

    // if (result.packPurchased) {
    Router.push('/pack-shop/pack-viewer')
    // } else {
    // tell the user that the pack purchase was unsuccessful
    // }
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
