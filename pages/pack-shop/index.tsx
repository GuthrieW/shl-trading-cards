import React from 'react'
import packs from '@utils/test-data/packs.json'
import { Box, Container, Grid, Tooltip, Typography } from '@material-ui/core'
import styled from 'styled-components'

export const PackShop = (props) => {
  return (
    <>
      <h1 style={{ color: 'red' }}>placeholder</h1>
      <Container>
        <RowBox>
          {packs.data.map((packType) => (
            <CardBox>
              <StyledImage src={packType.packImage} />
              <PackName>{packType.packName}</PackName>
            </CardBox>
          ))}
        </RowBox>
      </Container>
    </>
  )
}

const StyledImage = styled.img`
  cursor: pointer;
  transition: all ease 200ms;
  &:hover {
    transform: scale(1.1);
  }
  width: 50%;
`

const RowBox = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const CardBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 30%;
  align-items: center;
`

const PackName = styled(Typography)`
  justify-content: center;
  padding-top: 15px;
`

export default PackShop
