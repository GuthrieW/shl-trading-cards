import { TextField } from '@material-ui/core'
import React from 'react'

type FormTextFieldProps = {
  type?: any
  inputProps?: any
  label: string
  value: any
  onChange?: any
  disabled: boolean
}

const FormTextField = ({
  type = null,
  inputProps = {},
  label,
  value,
  onChange,
  disabled,
}: FormTextFieldProps) => {
  return (
    <TextField
      type={type}
      InputProps={{ inputProps: inputProps }}
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

export default FormTextField
