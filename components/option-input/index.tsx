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
  onInputChange: any
}

const StyledAutocomplete = styled(Autocomplete)`
  margin-top: 16px;
`

const OptionInput = ({
  options,
  loading,
  groupBy,
  getOptionLabel,
  label,
  onInputChange,
}: OptionInputProps) => (
  <StyledAutocomplete
    options={options}
    loading={loading}
    groupBy={groupBy}
    getOptionLabel={getOptionLabel}
    clearOnBlur={false}
    onInputChange={onInputChange}
    renderInput={(params) => (
      <TextField {...params} label={label} variant="outlined" />
    )}
  />
)

export default OptionInput