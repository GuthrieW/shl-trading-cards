import React from 'react'
import {
  FormControl,
  RadioGroup,
  Stack,
  Box,
  VisuallyHidden,
} from '@chakra-ui/react'

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
      <div className="text-sm md:text-lg mb-2">League</div>
      <RadioGroup value={value} defaultValue={defaultValue} onChange={onChange}>
        <Stack direction={direction} spacing={5}>
          {options.map((option) => (
            <Box
              key={option.value}
              as="label"
              flex="1"
              minW="75px"
              cursor="pointer"
            >
              <VisuallyHidden>
                <input
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                />
              </VisuallyHidden>

              <Box
                tabIndex={0}
                role="radio"
                aria-checked={value === option.value}
                className={`
                  px-5 py-3 text-center font-medium text-[15px] 
                  border-2 rounded-lg transition-all duration-200 outline-none
                  ${
                    value === option.value
                      ? 'bg-highlighted border-blue-600 text-white'
                      : 'bg-secondary border-gray-700 text-gray-100'
                  }
                  hover:-translate-y-px hover:shadow-lg hover:bg-highlighted/40
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChange(option.value)
                  }
                }}
              >
                {option.label}
              </Box>
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}

export default RadioGroupSelector
