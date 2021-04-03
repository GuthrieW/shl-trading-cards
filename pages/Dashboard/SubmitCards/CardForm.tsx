import React, { useState, useEffect } from 'react'
import {
  FormGroup,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@material-ui/core'
import Router from 'next/router'
import { Teams, Rarities, Positions } from '../../../utils/constants'

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
      <Select
        placeholder={'Team'}
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
        placeholder={'Rarity'}
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
      <Select
        placeholder={'Position'}
        label={'Position'}
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
        label={isSkater ? 'Skating' : 'High Shots'}
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
        label={isSkater ? 'Shooting' : 'Low Shots'}
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
        label={isSkater ? 'Hands' : 'Quickness'}
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
        label={isSkater ? 'Checking' : 'Control'}
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
        label={isSkater ? 'Defense' : 'Conditioning'}
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
      <Button variant="contained" component="label">
        Upload Card Image
        <input type="file" hidden />
      </Button>
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

export default CardForm
