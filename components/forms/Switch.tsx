import {
  FormControl,
  FormLabel,
  Switch as ChakraSwitch,
} from '@chakra-ui/react'

export default function Switch({
  name,
  disabled,
  value,
  label,
  onChange,
  onBlur,
}: {
  name: string
  disabled: boolean
  value: number
  label: string
  onChange?
  onBlur?
}) {
  return (
    <FormControl className="flex items-center m-2">
      <FormLabel className="mb-0">{label}</FormLabel>
      <ChakraSwitch
        id={name}
        value={value}
        disabled={disabled}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FormControl>
  )
}
