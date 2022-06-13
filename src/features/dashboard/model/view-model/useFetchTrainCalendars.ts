import useAxios from 'axios-hooks';
import { CalendarSchedule } from '@/features/dashboard/model/entity';
import { useMemo } from 'react';
import { EventInput } from '@fullcalendar/common';

export enum PlanCalendarURL {
  getAll = '/api/plan',
  reRank = '',
  dailyTrainUpdate = '',
}

export const useFetchTrainCalendars = () => {
  const [{ data = [], loading }] = useAxios<CalendarSchedule[]>({
    url: PlanCalendarURL.getAll,
    method: 'GET',
  });

  const trainEvents = useMemo<EventInput[]>(() => data, [data]);

  return {
    loading,
    data: data,
    trainEvents,
  };
};
