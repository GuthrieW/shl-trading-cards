import React, { useState, useEffect } from 'react'
import {
  FormGroup,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Box,
} from '@material-ui/core'
import Router from 'next/router'
import {
  Teams,
  Rarities,
  Positions,
  Attributes,
} from '../../../utils/constants'

const CardForm = () => {
  const [cardData, setCardData] = useState(null)
  const [canSubmit, setCanSubmit] = useState(false)
  const [isSkater, setIsSkater] = useState(true)

  useEffect(() => {
    setIsSkater(cardData?.position !== 'G')
    setCanSubmit(true)
  }, [cardData])

  const handleSubmit = () => {
    const formData = isSkater
      ? {
          playerName: cardData.playerName,
          team: cardData.team,
          rarity: cardData.rarity,
          position: cardData.position,
          overall: cardData.overall,
          skating: cardData.skating,
          shooting: cardData.shooting,
          hands: cardData.hands,
          checking: cardData.checking,
          defense: cardData.defense,
          imageUrl: cardData.imageUrl,
        }
      : {
          playerName: cardData.playerName,
          team: cardData.team,
          rarity: cardData.rarity,
          position: cardData.position,
          overall: cardData.overall,
          highShots: cardData.highShots,
          lowShots: cardData.lowShots,
          quickness: cardData.quickness,
          control: cardData.control,
          conditioning: cardData.conditioning,
          imageUrl: cardData.imageUrl,
        }
    console.log(formData)
    // Router.reload()
  }

  return (
    <FormGroup>
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
      <InputLabel id={'team-label'}>Team</InputLabel>
      <Select
        labelId={'team-label'}
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
      <InputLabel id={'rarity-label'}>Rarity</InputLabel>
      <Select
        labelId={'rarity-label'}
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
      <InputLabel id={'position-label'}>Position</InputLabel>
      <Select
        labelId={'position-label'}
        value={cardData?.position || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ position: event.target.value },
          })
        }}
      >
        {Object.entries(Positions).map((position) => (
          <MenuItem
            key={`${position[1].label}`}
            value={`${position[1].abbreviation}`}
          >
            {`${position[1].label}`}
          </MenuItem>
        ))}
      </Select>
      <TextField
        type={'number'}
        InputProps={{ inputProps: { min: 0, max: 99 } }}
        label={Attributes.Overall}
        value={cardData?.overall || ''}
        onChange={(event) => {
          setCardData({
            ...cardData,
            ...{ overall: event.target.value },
          })
        }}
      />
      <TextField
        type={'number'}
        InputProps={{ inputProps: { min: 0, max: 20 } }}
        label={
          isSkater ? Attributes.Skater.Skating : Attributes.Goalie.HighShots
        }
        value={(isSkater ? cardData?.skating : cardData?.highShots) || ''}
        onChange={(event) => {
          isSkater
            ? setCardData({
                ...cardData,
                ...{ skating: event.target.value },
              })
            : setCardData({
                ...cardData,
                ...{ highShots: event.target.value },
              })
        }}
      />
      <TextField
        type={'number'}
        InputProps={{ inputProps: { min: 0, max: 20 } }}
        label={
          isSkater ? Attributes.Skater.Shooting : Attributes.Goalie.LowShots
        }
        value={(isSkater ? cardData?.shooting : cardData?.lowShots) || ''}
        onChange={(event) => {
          isSkater
            ? setCardData({
                ...cardData,
                ...{ shooting: event.target.value },
              })
            : setCardData({
                ...cardData,
                ...{ lowShots: event.target.value },
              })
        }}
      />
      <TextField
        type={'number'}
        InputProps={{ inputProps: { min: 0, max: 20 } }}
        label={isSkater ? Attributes.Skater.Hands : Attributes.Goalie.Quickness}
        value={(isSkater ? cardData?.hands : cardData?.quickness) || ''}
        onChange={(event) => {
          isSkater
            ? setCardData({
                ...cardData,
                ...{ hands: event.target.value },
              })
            : setCardData({
                ...cardData,
                ...{ quickness: event.target.value },
              })
        }}
      />
      <TextField
        type={'number'}
        InputProps={{ inputProps: { min: 0, max: 20 } }}
        label={
          isSkater ? Attributes.Skater.Checking : Attributes.Goalie.Control
        }
        value={(isSkater ? cardData?.checking : cardData?.control) || ''}
        onChange={(event) => {
          isSkater
            ? setCardData({
                ...cardData,
                ...{ checking: event.target.value },
              })
            : setCardData({
                ...cardData,
                ...{ control: event.target.value },
              })
        }}
      />
      <TextField
        type={'number'}
        InputProps={{ inputProps: { min: 0, max: 20 } }}
        label={
          isSkater ? Attributes.Skater.Defense : Attributes.Goalie.Conditioning
        }
        value={(isSkater ? cardData?.defense : cardData?.conditioning) || ''}
        onChange={(event) => {
          isSkater
            ? setCardData({
                ...cardData,
                ...{ defense: event.target.value },
              })
            : setCardData({
                ...cardData,
                ...{ conditioning: event.target.value },
              })
        }}
      />
      <Box m={2}>
        <Button
          variant="contained"
          component="label"
          style={{ alignSelf: 'center', marginRight: '10px' }}
        >
          Upload Card Image
          <input type="file" hidden />
        </Button>
        <Button
          disabled={!canSubmit}
          style={{ alignSelf: 'center' }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit Card
        </Button>
      </Box>
    </FormGroup>
  )
}

export default CardForm
