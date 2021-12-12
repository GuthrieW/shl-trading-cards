import { useMutation } from 'react-query'
import axios from 'axios'

type UsePurchasePackRequest = {
  packType: string
  uid: number
}

type UsePurchasePack = {}

function queryOpenPack({ packType, uid }: UsePurchasePackRequest) {
  return useMutation(() => {
    return axios({
      method: 'POST',
      url: `/api/v1/cards/purchase/${packType}/${uid}`,
    })
  })
}

const usePurchasePack = ({
  packType,
  uid,
}: UsePurchasePackRequest): UsePurchasePack => {
  const { data, error, isLoading } = queryOpenPack({ packType, uid })
  return {
    response: data,
    isLoading: isLoading,
    isError: error,
  }
}

export default usePurchasePack
