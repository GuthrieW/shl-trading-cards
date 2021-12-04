import React, { useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import Router from 'next/router'
import useAllUsers from '@hooks/use-all-users'
import styled from 'styled-components'

const EditUsersContainer = styled.div`
  align-self: center;
  width: 50%;
`

const SaveButton = styled(Button)`
  width: 60%;
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const EditUsers = () => {
  const { users, isLoading, isError } = useAllUsers()
  const [selectedUser, setSelectedUser] = useState<User>(null)

  const handleSubmit = () => {
    Router.reload()
  }

  return (
    <EditUsersContainer>
      <Autocomplete
        options={users}
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
          label={'Owned Challenge Cup Packs'}
          value={selectedUser?.ownedChallengeCupPacks || 0}
          onChange={(event) => {
            setSelectedUser({
              ...selectedUser,
              ...{ ownedChallengeCupPacks: Number(event.target.value) },
            })
          }}
        />
        <ButtonContainer>
          <SaveButton
            disabled={!selectedUser}
            type={'submit'}
            variant={'contained'}
            color={'primary'}
            onClick={handleSubmit}
          >
            Save User
          </SaveButton>
        </ButtonContainer>
      </FormGroup>
    </EditUsersContainer>
  )
}

export default EditUsers
