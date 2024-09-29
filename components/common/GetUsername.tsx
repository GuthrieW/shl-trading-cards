import { Spinner, Text } from '@chakra-ui/react'
import axios from 'axios'
import { query } from '@pages/api/database/query'
import { GET } from '@constants/http-methods'
import { UserData } from '@pages/api/v3/user'


export default function GetUsername({ userID }: { userID: number }) {
  const { payload: user, isLoading: userIsLoading } = query<UserData>({
    queryKey: ['collectionUser', String(userID)],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/user/${userID}`,
      }),
    enabled: !!userID,
  })

  if (userIsLoading) {
    return 
  }

  return user?.username 
}
