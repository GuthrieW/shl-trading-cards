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
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
      >
        {Object.values(options).map((option: any) => (
          <MenuItem key={option.label} value={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

export default FormSelectField
