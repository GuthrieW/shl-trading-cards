import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse } from '@pages/api/v3'
import { UserData } from '@pages/api/v3/user'
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'

export type AutocompleteOption = { label: string; value: string }

export default function Autocomplete({
  label,
  onSelect,
}: {
  label: string
  onSelect: (s: string) => void
}) {
  const { session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState<string>('')
  const [debouncedUsername] = useDebounce(inputText, 500)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { payload: usersWithCards } = query<ListResponse<UserData>>({
    queryKey: ['with-cards', debouncedUsername],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/user/with-cards',
        headers: { Authorization: `Bearer ${session?.token}` },
        params: {
          username: debouncedUsername?.length >= 3 ? debouncedUsername : '',
        },
      }),
  })

  const usersWithCardsOptions: AutocompleteOption[] = useMemo(
    () =>
      usersWithCards?.rows.map((user) => ({
        label: user.username,
        value: String(user.uid),
      })) || [],
    [usersWithCards]
  )

  const handleFocusInput = () => {
    setIsOpen(true)
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
    setIsOpen(true)
  }

  const handleClickButton = (newOption: AutocompleteOption) => {
    if (inputRef.current) {
      inputRef.current.value = newOption.label
    }
    setInputText(newOption.label)
    onSelect(newOption.value)
    setIsOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative">
      <FormControl className="w-1/4">
        <FormLabel>{label}</FormLabel>
        <Input
          ref={inputRef}
          onFocus={handleFocusInput}
          onChange={handleChangeInput}
          value={inputText}
        />
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute flex flex-col justify-start items-start w-full bg-primary z-20 max-h-60 overflow-y-auto"
          >
            {usersWithCardsOptions.map((option) => (
              <Button
                key={option.value}
                _focus={{
                  bg: 'blue.100',
                  boxShadow: 'outline',
                }}
                className="w-full rounded-none flex justify-start items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => handleClickButton(option)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
      </FormControl>
      {debouncedUsername?.length > 0 && debouncedUsername?.length < 3 && (
        <Alert status="info">
          <AlertIcon />
          At least three characters are required to search for a username
        </Alert>
      )}
    </div>
  )
}
