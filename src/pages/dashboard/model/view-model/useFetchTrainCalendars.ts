import useAxios from 'axios-hooks';
import { CalendarURL } from '@/pages/dashboard/model/api';
import { Schedule } from '@/pages/dashboard/model/entity';
import { useMemo } from 'react';
import { EventInput } from '@fullcalendar/common';

export const useFetchTrainCalendars = () => {
  const [{ data = [], loading }] = useAxios<Schedule[]>({
    url: CalendarURL.getAll,
    method: 'GET',
  });

  const trainEvents = useMemo<EventInput[]>(
    () =>
      data.map((dailyTrain) => ({
        id: dailyTrain.id,
        title: dailyTrain.snap_card_name,
        date: dailyTrain.date,
      })),
    [data]
  );

  return {
    loading,
    data: data,
    trainEvents,
  };
};
