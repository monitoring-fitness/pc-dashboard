import { useState } from 'react';
import useAxios from 'axios-hooks';
import { CalendarURL } from '@/pages/dashboard/model/api';

export const useDailyTrainOperator = () => {
  const [selectEventID, setSelectEventID] = useState<string>();

  const [{ loading }, executePost] = useAxios<unknown, unknown>(
    {
      url: CalendarURL.dailyTrainUpdate,
      method: 'POST',
    },
    { manual: true }
  );

  return { selectEventID, setSelectEventID, loading, executePost };
};
