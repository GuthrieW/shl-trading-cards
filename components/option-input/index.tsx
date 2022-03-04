import React from 'react'
import styled from 'styled-components'
import { Autocomplete, TextField } from '@mui/material'

type OptionInputProps = {
  options: any[]
  loading: boolean
  groupBy?: any
  getOptionLabel: any
  label: string
  onChange: any
  onInputChange: any
  defaultValue: string | string[]
  renderOption?: any
  multiple?: boolean
  disabled?: boolean
  value?: any | any[]
}

const StyledAutocomplete = styled(Autocomplete)`
  margin-top: 16px;
  width: 100%;
`

const OptionInput = ({
  options,
  loading,
  groupBy = null,
  getOptionLabel,
  label,
  onChange,
  onInputChange,
  defaultValue,
  renderOption = null,
  multiple = false,
  disabled = false,
  value = null,
}: OptionInputProps) => (
  <StyledAutocomplete
    value={value}
    multiple={multiple}
    renderOption={renderOption}
    options={options}
    loading={loading}
    groupBy={groupBy}
    getOptionLabel={getOptionLabel}
    clearOnBlur={false}
    onChange={onChange}
    onInputChange={onInputChange}
    renderInput={(params) => <TextField {...params} label={label} />}
    defaultValue={defaultValue}
    disabled={disabled}
  />
)

export default OptionInput
