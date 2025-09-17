import React from 'react'
import {
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Spinner,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

interface FilterDropdownProps<T = any> {
  label: string
  selectedValues: string[]
  options: T[]
  isLoading: boolean
  onToggle: (value: string) => void
  onDeselectAll: () => void
  getOptionId: (option: T) => string
  getOptionValue: (option: T) => string
  getOptionLabel: (option: T) => string
}

const FilterDropdown = <T,>({
  label,
  selectedValues,
  options,
  isLoading,
  onToggle,
  onDeselectAll,
  getOptionId,
  getOptionValue,
  getOptionLabel,
}: FilterDropdownProps<T>) => {
  return (
    <FormControl>
      <Menu closeOnSelect={false}>
        <MenuButton className="!w-full sm:w-auto border-grey800 border-1 rounded p-2 cursor-pointer bg-secondary hover:!bg-highlighted/40">
          {label}&nbsp;{`(${selectedValues.length})`}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup type="checkbox">
            <MenuItemOption
              className="hover:!bg-highlighted/40"
              icon={null}
              isChecked={false}
              aria-checked={false}
              closeOnSelect
              onClick={onDeselectAll}
            >
              Deselect All
            </MenuItemOption>
            {isLoading ? (
              <Spinner />
            ) : (
              options?.map((option) => {
                const optionId = getOptionId(option)
                const optionValue = getOptionValue(option)
                const optionLabel = getOptionLabel(option)
                const isChecked = selectedValues.includes(optionValue)

                return (
                  <MenuItemOption
                    className="hover:bg-highlighted/40"
                    icon={null}
                    isChecked={isChecked}
                    aria-checked={isChecked}
                    key={optionId}
                    value={optionValue}
                    onClick={() => onToggle(optionValue)}
                  >
                    {optionLabel}
                    {isChecked && <CheckIcon className="mx-2" />}
                  </MenuItemOption>
                )
              })
            )}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </FormControl>
  )
}

export default FilterDropdown
