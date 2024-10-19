import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse } from '@pages/api/v3'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useMemo, useRef, useState } from 'react'
import { useDebounce } from 'use-debounce'

export type AutocomleteOption = { label: string; value: string }

export default function Autocomplete({
  label,
  onSelect,
}: {
  label: string
  onSelect: (s: string) => void
}) {
  const { session } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [inputText, setInputText] = useState<string>('')
  const [debouncedUsername] = useDebounce(inputText, 500)
  const inputRef = useRef()

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

  const usersWithCardsOptions: AutocomleteOption[] = useMemo(
    () =>
      usersWithCards?.rows.map((user) => ({
        label: user.username,
        value: String(user.uid),
      })),
    [usersWithCards]
  )

  const handleFocusInput = () => {
    // @ts-ignore
    inputRef.current.value = ''
    setInputText('')
    onSelect(null)
    onOpen()
  }

  const handleChangeInput = (event) => {
    setInputText(event.target.value)
  }

  const handleClickButton = (newOption: AutocomleteOption) => {
    // @ts-ignore
    inputRef.current.value = newOption.label
    setInputText(newOption.label)
    onSelect(newOption.value)
    onClose()
  }

  return (
    <div className="relative">
      <FormControl className="w-1/4">
        <FormLabel>{label}</FormLabel>
        <Input
          ref={inputRef}
          onFocus={handleFocusInput}
          onChange={handleChangeInput}
        />
        <div className="absolute flex flex-col justify-start items-start w-full bg-primaryDark z-20">
          {isOpen &&
            usersWithCardsOptions?.map((option) => (
              <Button
                key={option.value}
                className={`w-full rounded-none flex justify-start items-center`}
                onClick={() => handleClickButton(option)}
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
