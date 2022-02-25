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
import { getUidFromSession } from '@utils/index'
import useBuyPack from '@pages/api/mutations/use-buy-pack'

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
  transition: all ease 200ms;
  &:hover {
    transform: scale(1.05);
  }
`

const StyledBarContainer = styled.div`
  cursor: pointer;
`

const OpenPacks = () => {
  const { buyPack, response, isLoading, isError } = useBuyPack()
  const handleOpenPack = async (packType: PackType) => {
    if (!isLoading && !isError) {
      const value = await buyPack({ userId: 2856, packType: packType.key })
      console.log('value', value)
    }
  }

  console.log('response', response)
  if (response?.data?.purchaseSuccessful) {
    Router.push('/pack-shop/pack-viewer')
  }

  return (
    <OpenPacksScreen>
      <PageHeader>Pack Shop</PageHeader>
      <ImageList gap={16} rowHeight={400} cols={3}>
        {packsMap.map((pack: PackType) => {
          const { key, label, imageUrl } = pack
          return (
            <ImageListItem key={key}>
              <ImageItem>
                <StyledImage
                  height={'400px'}
                  src={imageUrl}
                  onClick={() => handleOpenPack(pack)}
                />
              </ImageItem>
              <StyledBarContainer onClick={() => handleOpenPack(pack)}>
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
