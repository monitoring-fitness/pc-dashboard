import useAxios from 'axios-hooks';
import { ReqFetchCard, ResFetchCard } from '@/features/train-manage/model/api';

export const useFetchCards = () => {
  const [{ data, loading }, executeGet] = useAxios<ResFetchCard, ReqFetchCard>(
    {
      url: '/api/train-card',
      method: 'GET',
    },
    { manual: true }
  );

  console.log(data);

  return {
    loading,
    executeGet,
    data: data?.data || [],
  };
};
