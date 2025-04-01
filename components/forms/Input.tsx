import { FormControl, FormLabel, Input as ChakraInput } from '@chakra-ui/react'

export default function Input({
  value,
  label,
  type,
  name,
  isRequired,
  disabled,
  isInvalid,
  onChange,
  onBlur,
}: {
  value: number | string
  label: string
  type: 'number' | 'string'
  name: string
  isRequired?: boolean
  disabled: boolean
  isInvalid: boolean
  onChange?
  onBlur?
}) {
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <ChakraInput
        id={name}
        isRequired={isRequired}
        value={value}
        type={type}
        name={name}
        className="font-mont !bg-primary !text-secondary"
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FormControl>
  )
}
