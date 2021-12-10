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
  defaultValue: string
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
  defaultValue,
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
    renderInput={(params) => <TextField {...params} label={label} />}
    defaultValue={defaultValue}
  />
)

export default OptionInput
