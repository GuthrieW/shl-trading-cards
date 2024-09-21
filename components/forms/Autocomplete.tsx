import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse } from '@pages/api/v3'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'use-debounce'

export type AutocomleteOption = { label: string; value: string }

export default function Autocomplete({
  label,
  onSelect,
}: {
  label: string
  onSelect: (s: string) => void
}) {
  const [selectedOption, setSelectedOption] = useState<AutocomleteOption>(null)
  const [inputIsFocused, setInputIsFocused] = useState<boolean>(false)
  const [inputText, setInputText] = useState<string>('')
  const [debouncedUsername] = useDebounce(inputText, 1000)

  const inputRef = useRef()

  const { payload: usersWithCards, refetch } = query<ListResponse<UserData>>({
    queryKey: ['with-cards', debouncedUsername],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/user/with-cards',
        params: {
          username: debouncedUsername?.length >= 3 ? debouncedUsername : '',
        },
      }),
  })

  useEffect(() => {
    refetch()
  }, [inputText])

  const usersWithCardsOptions: AutocomleteOption[] = useMemo(
    () =>
      usersWithCards?.rows.map((user) => ({
        label: user.username,
        value: String(user.uid),
      })),

    [usersWithCards]
  )

  const handleSelect = (newOption: AutocomleteOption) => {
    console.log('newOption', newOption)
    // @ts-ignore
    inputRef.current = newOption.label
    setSelectedOption(newOption)
    onSelect(newOption.value)
  }

  return (
    <div className="flex flex-row">
      <FormControl className="w-1/4">
        <FormLabel>{label}</FormLabel>
        <Input
          ref={inputRef}
          onFocus={() => setInputIsFocused(true)}
          onBlur={() => setInputIsFocused(false)}
          onChange={(event) => setInputText(event.target.value)}
        />
        <div className="flex flex-col justify-start items-start w-full">
          {inputIsFocused &&
            usersWithCardsOptions?.map((option) => (
              <Button
                key={option.value}
                className="w-full rounded-none flex justify-start items-center"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </Button>
            ))}
        </div>
      </FormControl>
      {debouncedUsername?.length > 0 && debouncedUsername?.length < 3 && (
        <Alert status="info">
          <AlertIcon />
          At least three charaters required to search for a username
        </Alert>
      )}
    </div>
  )
}
