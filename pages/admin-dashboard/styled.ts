import styled from 'styled-components'
import { Box } from '@material-ui/core'

export const HorizontalBox = styled(Box)`
  display: flex;
  flex-direction: row;
`

export const VerticalSelectionBox = styled(Box)`
  width: 15%;
  display: flex;
  flex-direction: column;
`

export const VerticalContentBox = styled(Box)`
  width: 85%;
  display: flex;
  flex-direction: column;
`
