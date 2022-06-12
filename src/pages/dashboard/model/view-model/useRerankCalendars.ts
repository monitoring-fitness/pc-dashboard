import useAxios from 'axios-hooks';
import { PlanCalendarURL } from '@/pages/dashboard/model/api';
import { useState } from 'react';

interface RerankCalendarResponse {
  _id: string; // plan id
  changed_daily_list: Array<{
    _id: string; // daily id
    new_date: string; // 新的日期
  }>;
}

export const useRerankCalendars = () => {
  const [{ data, loading }, executePut] = useAxios<
    unknown,
    RerankCalendarResponse
  >(
    {
      url: PlanCalendarURL.reRank,
      method: 'PUT',
    },
    { manual: true }
  );

  const [reRanking, setReRanking] = useState(false);

  return {
    loading,
    executePut,
    reRanking,
    setReRanking,
  };
};
