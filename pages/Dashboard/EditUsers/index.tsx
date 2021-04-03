import React, { useEffect, useState } from 'react'
import {
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import testUsers from '../../../utils/testData/user.json'
import Router from 'next/router'

const EditUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  const handleSubmit = () => {
    Router.reload()
  }

  return (
    <div
      style={{
        margin: '10px',
        alignItems: 'center',
        position: 'static',
        width: '50%',
      }}
    >
      <Autocomplete
        style={{ width: 300 }}
        options={testUsers.data}
        onChange={(event, value) => {
          setSelectedUser(value)
        }}
        getOptionLabel={(option) => option.username}
        getOptionSelected={(option, value) =>
          option.username === value.username
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={'Search for user'}
            variant={'outlined'}
          />
        )}
      />
      <FormGroup>
        <TextField
          disabled={!selectedUser}
          label={'Username'}
          value={selectedUser?.username || ''}
          onChange={(event) => {
            setSelectedUser({
              ...selectedUser,
              ...{ username: event.target.value },
            })
          }}
        />
        <FormControlLabel
          disabled={!selectedUser}
          labelPlacement={'start'}
          label={'Admin'}
          control={
            <Switch
              checked={selectedUser?.isAdmin ?? false}
              onChange={() => {
                setSelectedUser({
                  ...selectedUser,
                  ...{ isAdmin: !selectedUser.isAdmin },
                })
              }}
            />
          }
        />
        <FormControlLabel
          disabled={!selectedUser}
          labelPlacement={'start'}
          label={'Processor'}
          control={
            <Switch
              checked={selectedUser?.isProcessor ?? false}
              onChange={() => {
                setSelectedUser({
                  ...selectedUser,
                  ...{ isProcessor: !selectedUser.isProcessor },
                })
              }}
            />
          }
        />
        <FormControlLabel
          disabled={!selectedUser}
          labelPlacement={'start'}
          label={'Submitter'}
          control={
            <Switch
              checked={selectedUser?.isSubmitter ?? false}
              onChange={() => {
                setSelectedUser({
                  ...selectedUser,
                  ...{ isSubmitter: !selectedUser.isSubmitter },
                })
              }}
            />
          }
        />
        <TextField
          disabled={!selectedUser}
          type={'number'}
          label={'Owned Regular Packs'}
          value={selectedUser?.ownedRegularPacks || 0}
          onChange={(event) => {
            setSelectedUser({
              ...selectedUser,
              ...{ ownedRegularPacks: Number(event.target.value) },
            })
          }}
        />
        <TextField
          disabled={!selectedUser}
          type={'number'}
          label={'Owned Regular Packs'}
          value={selectedUser?.ownedChallengeCupPacks || 0}
          onChange={(event) => {
            setSelectedUser({
              ...selectedUser,
              ...{ ownedChallengeCupPacks: Number(event.target.value) },
            })
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            disabled={!selectedUser}
            type={'submit'}
            style={{
              width: '60%',
            }}
            variant={'contained'}
            color={'primary'}
            onClick={handleSubmit}
          >
            Save User
          </Button>
        </div>
      </FormGroup>
    </div>
  )
}

export default EditUsers
