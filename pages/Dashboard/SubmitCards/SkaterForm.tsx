import React, { useState, useEffect } from 'react'
import {
  FormGroup,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@material-ui/core'
import Router from 'next/router'
import { SubmitCardProps } from './index.d'
import { Teams, Rarities } from '../../../utils/constants'

const SkaterForm = ({ setIsSkater }: SubmitCardProps) => {
  const [cardData, setCardData] = useState(null)
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    setCanSubmit(false)
  }, [cardData])

  const handleSubmit = () => {
    Router.reload()
  }

  return (
    <FormGroup>
      <Button
        style={{
          alignSelf: 'end',
          width: '20%',
        }}
        onClick={() => {
          setIsSkater(false)
        }}
      >
        Switch to Goalie Form
      </Button>
      <TextField
        label={'Player Name'}
        value={cardData?.playerName || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ playerName: event.target.value },
          })
        }}
      />
      <Select
        label={'Team'}
        value={cardData?.team || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ team: event.target.value },
          })
        }}
      >
        {Object.entries(Teams).map((team) => (
          <MenuItem
            key={`${team[1].City} ${team[1].Team}`}
            value={`${team[1].City} ${team[1].Team}`}
          >
            {`${team[1].City} ${team[1].Team}`}
          </MenuItem>
        ))}
      </Select>
      <Select
        label={'Rarity'}
        value={cardData?.rarity || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ rarity: event.target.value },
          })
        }}
      >
        {Object.entries(Rarities).map((rarity) => (
          <MenuItem key={rarity[1]} value={rarity[1]}>
            {rarity[1]}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label={'Overall'}
        value={cardData?.overall || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ overall: event.target.value },
          })
        }}
      />
      <TextField
        label={'Skating'}
        value={cardData?.skating || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ skating: event.target.value },
          })
        }}
      />
      <TextField
        label={'Shooting'}
        value={cardData?.shooting || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ shooting: event.target.value },
          })
        }}
      />
      <TextField
        label={'Hands'}
        value={cardData?.hands || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ hands: event.target.value },
          })
        }}
      />
      <TextField
        label={'Checking'}
        value={cardData?.checking || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ checking: event.target.value },
          })
        }}
      />
      <TextField
        label={'Defense'}
        value={cardData?.defense || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ defense: event.target.value },
          })
        }}
      />
      <TextField
        label={'Image URL'}
        value={cardData?.imageUrl || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ imageUrl: event.target.value },
          })
        }}
      />
      <Button
        disabled={!canSubmit}
        style={{ verticalAlign: 'center', width: '60%' }}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Submit Card
      </Button>
    </FormGroup>
  )
}

export default SkaterForm
