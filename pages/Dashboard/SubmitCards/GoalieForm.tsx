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

const GoalieForm = ({ setIsSkater }: SubmitCardProps) => {
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
          setIsSkater(true)
        }}
      >
        Switch to Skater Form
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
        label={'High Shots'}
        value={cardData?.highShots || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ highShots: event.target.value },
          })
        }}
      />
      <TextField
        label={'Low Shots'}
        value={cardData?.lowShots || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ lowShots: event.target.value },
          })
        }}
      />
      <TextField
        label={'Quickness'}
        value={cardData?.quickness || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ quickness: event.target.value },
          })
        }}
      />
      <TextField
        label={'Control'}
        value={cardData?.control || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ control: event.target.value },
          })
        }}
      />
      <TextField
        label={'Conditioning'}
        value={cardData?.conditioning || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ conditioning: event.target.value },
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

export default GoalieForm
