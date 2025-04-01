import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
} from '@chakra-ui/react'

export default function Select({
  value,
  disabled,
  name,
  label,
  options,
  placeholder,
  isInvalid,
  onChange,
  onBlur,
}: {
  value: string
  disabled: boolean
  name: string
  label: string
  options: { id: string; name: string }[]
  placeholder: string
  isInvalid: boolean
  onChange?
  onBlur?
}) {
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <ChakraSelect
        id={name}
        disabled={disabled}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      >
        {options.map(({ id, name }) => (
          <option className="!bg-primary !text-secondary" key={id} value={id}>
            {name}
          </option>
        ))}
      </ChakraSelect>
    </FormControl>
  )
}
