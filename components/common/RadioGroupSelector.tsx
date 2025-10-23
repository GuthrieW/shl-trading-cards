import React, { useMemo } from 'react'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupSelectorProps {
  value: string | string[]
  defaultValue?: string | string[]
  options: readonly RadioOption[]
  onChange: (value: string | string[]) => void
  direction?: 'row' | 'column'
  className?: string
  allValues?: string[]
}

const RadioGroupSelector: React.FC<RadioGroupSelectorProps> = ({
  value,
  defaultValue,
  options,
  onChange,
  direction = 'row',
  className = 'w-full sm:w-auto',
  allValues,
}) => {
  const isArray = Array.isArray(value)
  const currentValues = isArray ? value : [value]

  const allLeagueSelected = useMemo(
    () =>
      isArray &&
      allValues &&
      currentValues.length === allValues.length &&
      allValues.every((v) => currentValues.includes(v)),
    [isArray, allValues, currentValues]
  )

  const handleOptionClick = (optionValue: string) => {
    if (optionValue === 'all' && allValues) {
      onChange(allValues)
    } else {
      onChange(isArray ? [optionValue] : optionValue)
    }
  }

  const displayOptions = useMemo(
    () => (allValues ? [{ value: 'all', label: 'All' }, ...options] : options),
    [allValues, options]
  )

  const displayValue = allLeagueSelected ? 'all' : currentValues[0]

  return (
    <FormControl className={className}>
      <FormLabel className="text-sm md:text-lg mb-2">League</FormLabel>

      <RadioGroup
        value={displayValue}
        defaultValue={
          Array.isArray(defaultValue) ? defaultValue[0] : defaultValue
        }
        onChange={handleOptionClick}
      >
        <Stack direction={direction} spacing={5}>
          {displayOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}

export default RadioGroupSelector
