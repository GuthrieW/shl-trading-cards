import React, { useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, FormGroup, Paper } from '@material-ui/core'
import { FormTextField, FormSelectField } from '@components/index'
import { attributes, positions, rarities, teams } from '@constants/index'
import CSVReader from 'react-csv-reader'
import Router from 'next/router'

type SelectedRequestUi = 'single-card' | 'csv-import'

const RequestCardCreation = () => {
  const [selectedRequestUi, setSelectedRequestUi] =
    useState<SelectedRequestUi>('single-card')
  const [csvToUpload, setCsvToUpload] = useState(null)
  const [canSubmit, setCanSubmit] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Single Card State
  const [singlePlayerName, setSinglePlayerName] = useState<string>('')
  const [singleTeamName, setSingleTeamName] = useState<string>('')
  const [singleRarity, setSingleRarity] = useState<string>('')
  const [singlePosition, setSinglePosition] = useState<string>('')
  const [singleOverall, setSingleOverall] = useState<number>(0)
  const [singleSkaterSkating, setSingleSkaterSkating] = useState<number>(0)
  const [singleSkaterShooting, setSingleSkaterShooting] = useState<number>(0)
  const [singleSkaterHands, setSingleSkaterHands] = useState<number>(0)
  const [singleSkaterChecking, setSingleSkaterChecking] = useState<number>(0)
  const [singleSkaterDefense, setSingleSkaterDefense] = useState<number>(0)
  const [singleGoalieHighShots, setSingleGoalieHighShots] = useState<number>(0)
  const [singleGoalieLowShots, setSingleGoalieLowShots] = useState<number>(0)
  const [singleGoalieQuickness, setSingleGoalieQuickness] = useState<number>(0)
  const [singleGoalieControl, setSingleGoalieControl] = useState<number>(0)
  const [singleGoalieConditioning, setSingleGoalieConditioning] =
    useState<number>(0)

  useEffect(() => {
    if (selectedRequestUi === 'single-card') {
      setSinglePlayerName('')
      setSingleTeamName('')
      setSingleRarity('')
      setSinglePosition('')
      setSingleOverall(0)
      setSingleSkaterSkating(0)
      setSingleSkaterShooting(0)
      setSingleSkaterHands(0)
      setSingleSkaterChecking(0)
      setSingleSkaterDefense(0)
      setSingleGoalieHighShots(0)
      setSingleGoalieLowShots(0)
      setSingleGoalieQuickness(0)
      setSingleGoalieControl(0)
      setSingleGoalieConditioning(0)
    } else {
      setCsvToUpload(null)
    }
  }, [selectedRequestUi])

  const handleSelectCsv = (data, fileInfo) => {
    setCsvToUpload(data)
  }

  const handleSingleCardSubmit = async () => {
    if (canSubmit) {
      setIsSubmitting(true)
      const basePlayerData = {
        player_name: singlePlayerName,
        teamID: singleTeamName,
        card_rarity: singleRarity,
        position: singlePosition,
        overall: singleOverall,
      }

      const fullPlayerData =
        singlePosition !== 'G'
          ? {
              ...basePlayerData,
              skating: singleSkaterSkating,
              shooting: singleSkaterShooting,
              hands: singleSkaterHands,
              checking: singleSkaterChecking,
              defense: singleSkaterDefense,
              highShots: null,
              lowShots: null,
              quickness: null,
              control: null,
              conditioning: null,
            }
          : {
              ...basePlayerData,
              skating: null,
              shooting: null,
              hands: null,
              checking: null,
              defense: null,
              highShots: singleGoalieHighShots,
              lowShots: singleGoalieLowShots,
              quickness: singleGoalieQuickness,
              control: singleGoalieControl,
              conditioning: singleGoalieConditioning,
            }

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      await delay(5000)
      // Router.reload()
    }

    setSinglePlayerName('')
    setSingleTeamName('')
    setSingleRarity('')
    setSinglePosition('')
    setSingleOverall(0)
    setSingleSkaterSkating(0)
    setSingleSkaterShooting(0)
    setSingleSkaterHands(0)
    setSingleSkaterChecking(0)
    setSingleSkaterDefense(0)
    setSingleGoalieHighShots(0)
    setSingleGoalieLowShots(0)
    setSingleGoalieQuickness(0)
    setSingleGoalieControl(0)
    setSingleGoalieConditioning(0)
    setIsSubmitting(false)
    setCsvToUpload(null)
  }

  const handleCsvUploadSubmit = () => {
    Router.reload()
  }

  return (
    <Paper
      elevation={4}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'static',
        justifyContent: 'center',
      }}
    >
      <ButtonGroup variant={'contained'}>
        <Button
          onClick={() => {
            setSelectedRequestUi('single-card')
          }}
        >
          Single Card
        </Button>
        <Button
          onClick={() => {
            setSelectedRequestUi('csv-import')
          }}
        >
          CSV Import
        </Button>
      </ButtonGroup>
      <FormGroup>
        {selectedRequestUi === 'single-card' && (
          <>
            <FormTextField
              label={'Player Name'}
              value={singlePlayerName}
              onChange={(event) => {
                setSinglePlayerName(event.target.value)
              }}
              disabled={isSubmitting}
            />
            <FormSelectField
              label={'Team'}
              labelId={'team-label'}
              value={singleTeamName}
              onChange={(event) => {
                setSingleTeamName(event.target.value)
              }}
              options={teams}
              disabled={isSubmitting}
            />
            <FormSelectField
              label={'Rarity'}
              labelId={'rarity-label'}
              value={singleRarity}
              onChange={(event) => {
                setSingleRarity(event.target.value)
              }}
              options={rarities}
              disabled={isSubmitting}
            />
            <FormSelectField
              label={'Position'}
              labelId={'position-label'}
              value={singlePosition}
              onChange={(event) => {
                setSinglePosition(event.target.value)
              }}
              options={positions}
              disabled={isSubmitting}
            />
            <FormTextField
              type={'number'}
              inputProps={{ min: 0, max: 99 }}
              label={'Overall'}
              value={singleOverall}
              onChange={(event) => {
                setSingleOverall(event.target.value)
              }}
              disabled={isSubmitting}
            />
            {singlePosition !== 'G' ? (
              <>
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Skater.Skating}
                  value={singleSkaterSkating}
                  onChange={(event) => {
                    setSingleSkaterSkating(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Skater.Shooting}
                  value={singleSkaterShooting}
                  onChange={(event) => {
                    setSingleSkaterShooting(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Skater.Hands}
                  value={singleSkaterHands}
                  onChange={(event) => {
                    setSingleSkaterHands(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Skater.Checking}
                  value={singleSkaterChecking}
                  onChange={(event) => {
                    setSingleSkaterChecking(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Skater.Defense}
                  value={singleSkaterDefense}
                  onChange={(event) => {
                    setSingleSkaterDefense(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
              </>
            ) : (
              <>
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Goalie.HighShots}
                  value={singleGoalieHighShots}
                  onChange={(event) => {
                    setSingleGoalieHighShots(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Goalie.LowShots}
                  value={singleGoalieLowShots}
                  onChange={(event) => {
                    setSingleGoalieLowShots(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Goalie.Quickness}
                  value={singleGoalieQuickness}
                  onChange={(event) => {
                    setSingleGoalieQuickness(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Goalie.Control}
                  value={singleGoalieControl}
                  onChange={(event) => {
                    setSingleGoalieControl(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
                <FormTextField
                  type={'number'}
                  inputProps={{ min: 0, max: 20 }}
                  label={attributes.Goalie.Conditioning}
                  value={singleGoalieConditioning}
                  onChange={(event) => {
                    setSingleGoalieConditioning(event.target.value)
                  }}
                  disabled={isSubmitting}
                />
              </>
            )}
            <Box m={2}>
              <Button
                disabled={!canSubmit && isSubmitting}
                style={{ alignSelf: 'end' }}
                variant="contained"
                color="primary"
                onClick={handleSingleCardSubmit}
              >
                Submit Card
              </Button>
            </Box>
          </>
        )}
        {selectedRequestUi === 'csv-import' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ margin: '10px' }}>
              <CSVReader
                cssClass={'react-csv-input'}
                label={'CSV Upload'}
                onFileLoaded={handleSelectCsv}
                // parserOptions={}
              />
            </div>
            <Button
              disabled={!canSubmit && isSubmitting}
              style={{ alignSelf: 'end' }}
              variant="contained"
              color="primary"
              onClick={handleCsvUploadSubmit}
            >
              Submit Card
            </Button>
          </div>
        )}
      </FormGroup>
    </Paper>
  )
}

export default RequestCardCreation
