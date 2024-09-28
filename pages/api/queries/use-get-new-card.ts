import { GET } from '@constants/http-methods';
import axios from 'axios';
import { useQuery } from 'react-query';

export const UseGetNewCardsKey = 'use-get-new-card';

const useGetNewCard = (uid: number, cardID: number): { isNew: boolean; isLoading: boolean } => {
  const { data, isLoading } = useQuery(
    [UseGetNewCardsKey, uid, cardID],
    async () => {
      const response = await axios({
        method: GET,
        url: `/api/v3/collection/uid/new-card?userID=${uid}&cardID=${cardID}`, 
      });
      return response.data;
    },
    {
      enabled: !!uid && !!cardID,
    }
  );

  return {
    isNew: data?.quantity === 1,
    isLoading
  };
};

export default useGetNewCard;