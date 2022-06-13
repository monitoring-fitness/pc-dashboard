import { useState } from 'react';
import useAxios from 'axios-hooks';
import { PlanCalendarURL } from '@/features/dashboard/model/view-model/useFetchTrainCalendars';

export const useDailyTrainOperator = () => {
  const [selectEventID, setSelectEventID] = useState<string>();

  const [{ loading }, executePost] = useAxios<unknown, unknown>(
    {
      url: PlanCalendarURL.dailyTrainUpdate,
      method: 'POST',
    },
    { manual: true }
  );

  return { selectEventID, setSelectEventID, loading, executePost };
};
