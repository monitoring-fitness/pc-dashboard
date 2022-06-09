import useAxios from 'axios-hooks';
import { CalendarURL } from '@/pages/dashboard/model/api';
import { useState } from 'react';

export const useRerankCalendars = () => {
  const [{ data, loading }, executePost] = useAxios<unknown, unknown>(
    {
      url: CalendarURL.reRank,
      method: 'POST',
    },
    { manual: true }
  );

  const [reRanking, setReRanking] = useState(false);

  return {
    loading,
    executePost,
    data: data || [],
    reRanking,
    setReRanking,
  };
};
