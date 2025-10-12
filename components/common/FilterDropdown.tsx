import React, { useMemo } from 'react'
import {
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Spinner,
  Tooltip,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'

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
  const buttonIsDisabled = useMemo(
    () => isLoading || options.length === 0,
    [isLoading, options]
  )

  return (
    <FormControl>
      <Menu
        closeOnSelect={false}
        strategy="fixed"
        autoSelect={false}
        placement="bottom-start"
      >
        <Tooltip
          isDisabled={!buttonIsDisabled}
          label={'No options available for current selection'}
        >
          <MenuButton
            as={Button}
            isDisabled={buttonIsDisabled}
            className="!w-full sm:w-auto border-grey800 border-1 rounded p-2 cursor-pointer bg-secondary hover:!bg-highlighted/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {label}&nbsp;{`(${selectedValues.length})`}
          </MenuButton>
        </Tooltip>
        <MenuList className="max-h-96 overflow-y-auto" zIndex={9999}>
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
