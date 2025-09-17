import React from 'react'
import { FormControl, RadioGroup, Stack, Radio } from '@chakra-ui/react'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupSelectorProps {
  value: string
  defaultValue?: string
  options: readonly RadioOption[]
  onChange: (value: string) => void
  direction?: 'row' | 'column'
  className?: string
}

const RadioGroupSelector: React.FC<RadioGroupSelectorProps> = ({
  value,
  defaultValue,
  options,
  onChange,
  direction = 'row',
  className = 'w-full sm:w-auto',
}) => {
  return (
    <FormControl className={className}>
      <RadioGroup value={value} defaultValue={defaultValue} onChange={onChange}>
        <Stack direction={direction}>
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              tabIndex={0}
              _focusVisible={{ boxShadow: '0 0 0 2px #3182ce' }}
            >
              {option.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}

export default RadioGroupSelector
