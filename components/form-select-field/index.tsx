import React from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'

type FormSelectFieldProps = {
  label: string
  labelId: string
  value: any
  onChange?: any
  options?: any
  disabled: boolean
}

const FormSelectField = ({
  labelId,
  label,
  value,
  onChange,
  options = {},
  disabled,
}: FormSelectFieldProps) => {
  return (
    <>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        defaultValue={'' || 0}
      >
        {Object.values(options).map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

export default FormSelectField
