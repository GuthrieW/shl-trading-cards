import React from 'react'
import styled from 'styled-components'
import { Autocomplete } from '@material-ui/lab'
import { TextField } from '@material-ui/core'

type OptionInputProps = {
  options: any[]
  loading: boolean
  groupBy: any
  getOptionLabel: any
  label: string
  onChange: any
  onInputChange: any
}

const StyledAutocomplete = styled(Autocomplete)`
  margin-top: 16px;
  width: 100%;
`

const OptionInput = ({
  options,
  loading,
  groupBy,
  getOptionLabel,
  label,
  onChange,
  onInputChange,
}: OptionInputProps) => (
  <StyledAutocomplete
    disableClearable={true}
    options={options}
    loading={loading}
    groupBy={groupBy}
    getOptionLabel={getOptionLabel}
    clearOnBlur={false}
    onChange={onChange}
    onInputChange={onInputChange}
    renderInput={(params) => (
      <TextField {...params} label={label} variant="outlined" />
    )}
  />
)

export default OptionInput
