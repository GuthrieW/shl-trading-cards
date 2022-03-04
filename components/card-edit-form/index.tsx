import React, { useEffect, useState } from 'react'
import { FormTextField, FormSelectField } from '@components/index'
import { attributes, positions, rarities, teams } from '@constants/index'
import { useGetAllUsers } from '@pages/api/queries'
import { Button, FormControlLabel, Switch } from '@mui/material'
import { isAdminOrCardTeam } from '@utils/index'
import { groups } from '@utils/user-groups'

type CardEditFormProps = {
  initialValues: Card
  handleSubmitCard: any
  handleSubmitImage: any
  handleClose: any
  formDisabled: boolean
}

const CardEditForm = ({
  initialValues,
  handleSubmitCard,
  handleSubmitImage,
  handleClose,
  formDisabled,
}: CardEditFormProps) => {
  const { users, isLoading, isError } = useGetAllUsers({})
  const [cardCreators, setCardCreators] = useState<User[]>([])
  const [updatedCard, setUpdatedCard] = useState<Card>(initialValues)

  useEffect(() => {
    const filteredUsers = users.filter((user) => isAdminOrCardTeam(user))

    setCardCreators(filteredUsers)
  }, [users])

  return (
    <>
      {updatedCard && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FormTextField
            label={'Player Name'}
            value={updatedCard.player_name}
            disabled={formDisabled}
            onChange={(event) => {
              setUpdatedCard({
                ...updatedCard,
                player_name: event.target.value,
              })
            }}
          />
          <FormControlLabel
            labelPlacement="start"
            label="Approved"
            control={
              <Switch
                checked={updatedCard.approved}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    approved: !updatedCard.approved,
                  })
                }}
                name="approved"
                color="primary"
              />
            }
          />
          <FormControlLabel
            labelPlacement="start"
            label="Pullable"
            control={
              <Switch
                checked={updatedCard.pullable}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    pullable: !updatedCard.pullable,
                  })
                }}
                name="pullable"
                color="primary"
              />
            }
          />
          <FormTextField
            label={'Player ID'}
            value={updatedCard.playerID}
            disabled={formDisabled}
            onChange={(event) => {
              setUpdatedCard({
                ...updatedCard,
                playerID: parseInt(event.target.value),
              })
            }}
          />
          <FormSelectField
            label={'Team ID'}
            labelId={'team-label'}
            value={updatedCard.teamID}
            options={teams.map((team) => {
              return { label: team.label, value: team.teamID }
            })}
            disabled={formDisabled}
            onChange={(event) => {
              setUpdatedCard({
                ...updatedCard,
                teamID: parseInt(event.target.value),
              })
            }}
          />
          <FormSelectField
            label={'Author User'}
            labelId={'author-label'}
            value={updatedCard.author_userID}
            options={cardCreators.map((user) => {
              return { label: user.username, value: user.uid }
            })}
            disabled={formDisabled}
            onChange={(event) => {
              setUpdatedCard({
                ...updatedCard,
                author_userID: parseInt(event.target.value),
              })
            }}
          />
          <FormSelectField
            label={'Rarity'}
            labelId={'rarity-label'}
            value={updatedCard.card_rarity}
            options={rarities.map((rarity) => {
              return { label: rarity.label, value: rarity.value }
            })}
            disabled={formDisabled}
            onChange={(event) => {
              setUpdatedCard({
                ...updatedCard,
                card_rarity: event.target.value,
              })
            }}
          />
          <FormSelectField
            label={'Position'}
            labelId={'position-label'}
            value={updatedCard.position}
            options={positions.map((position) => {
              return { label: position.label, value: position.value }
            })}
            disabled={formDisabled}
            onChange={(event) => {
              setUpdatedCard({
                ...updatedCard,
                position: event.target.value,
              })
            }}
          />
          <FormTextField
            type={'number'}
            label={'Season'}
            value={updatedCard.season}
            disabled={formDisabled}
            onChange={(event) => {
              setUpdatedCard({
                ...updatedCard,
                season: parseInt(event.target.value),
              })
            }}
          />
          <FormTextField
            type={'number'}
            inputProps={{ min: 0, max: 99 }}
            label={'Overall'}
            value={updatedCard.overall}
            disabled={formDisabled}
            onChange={(event) => {
              setUpdatedCard({
                ...updatedCard,
                overall: parseInt(event.target.value),
              })
            }}
          />
          {updatedCard.position !== 'G' ? (
            <>
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Skater.Skating}
                value={updatedCard.skating}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    skating: parseInt(event.target.value),
                  })
                }}
              />
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Skater.Shooting}
                value={updatedCard.shooting}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    shooting: parseInt(event.target.value),
                  })
                }}
              />
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Skater.Hands}
                value={updatedCard.hands}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    hands: parseInt(event.target.value),
                  })
                }}
              />
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Skater.Checking}
                value={updatedCard.checking}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    checking: parseInt(event.target.value),
                  })
                }}
              />
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Skater.Defense}
                value={updatedCard.defense}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    defense: parseInt(event.target.value),
                  })
                }}
              />
            </>
          ) : (
            <>
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Goalie.HighShots}
                value={updatedCard.high_shots}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    high_shots: parseInt(event.target.value),
                  })
                }}
              />
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Goalie.LowShots}
                value={updatedCard.low_shots}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    low_shots: parseInt(event.target.value),
                  })
                }}
              />
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Goalie.Quickness}
                value={updatedCard.quickness}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    quickness: parseInt(event.target.value),
                  })
                }}
              />
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Goalie.Control}
                value={updatedCard.control}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    control: parseInt(event.target.value),
                  })
                }}
              />
              <FormTextField
                type={'number'}
                inputProps={{ min: 0, max: 20 }}
                label={attributes.Goalie.Conditioning}
                value={updatedCard.conditioning}
                disabled={formDisabled}
                onChange={(event) => {
                  setUpdatedCard({
                    ...updatedCard,
                    conditioning: parseInt(event.target.value),
                  })
                }}
              />
            </>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              margin: '5px',
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmitImage}
            >
              Upload Image
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'end',
              margin: '5px',
            }}
          >
            <Button
              style={{ marginRight: '5px' }}
              color="primary"
              variant="contained"
              onClick={handleSubmitCard}
            >
              Submit Card
            </Button>
            <Button color="secondary" variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default CardEditForm
