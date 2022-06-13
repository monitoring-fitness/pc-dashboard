import React, { useEffect, useMemo, useState } from 'react';
import '@fullcalendar/react/dist/vdom';
import {
  TrainCalendar,
  TrainCalendarProps,
} from '@/features/dashboard/view/train-calendar';
import { useFetchTrainCalendars } from '@/features/dashboard/model/view-model/useFetchTrainCalendars';
import { Modal, Spin, Switch } from '@arco-design/web-react';
import { useRerankCalendars } from '@/features/dashboard/model/view-model/useRerankCalendars';
import { useDailyTrainOperator } from '@/features/dashboard/model/view-model/useDailyTrainOperator';
import { TrainDetail } from '@/features/dashboard/view/train-detail';
import {
  getAllCalendars,
  selectAllPlanCalendar,
} from '@/features/plan-calendar/plan-calendar.slice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import store from '@/store';

const Calendar = () => {
  const {
    data: trainsPlan,
    trainEvents,
    loading: fetchTrainsLoading,
  } = useFetchTrainCalendars();
  const {
    reRanking,
    setReRanking,
    loading: putReRankLoading,
    executePut: putReRank,
  } = useRerankCalendars();
  const {
    selectEventID,
    setSelectEventID,
    executePost,
    loading: updateTrainLoading,
  } = useDailyTrainOperator();

  const dispatch = useAppDispatch();
  const calendars = useAppSelector(selectAllPlanCalendar);
  useEffect(() => {
    dispatch(getAllCalendars());
  }, [dispatch]);

  const [modelShowPos, setModelShowPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 传给train-form
  const filteredDailyTrain = useMemo(() => {
    return trainsPlan.find((item) => item._id === selectEventID);
  }, [selectEventID]);

  const handleCalendarSelectEvent: TrainCalendarProps['updateSelectInfo'] = (
    cellId,
    clickPos
  ) => {
    setSelectEventID(cellId);
    setModelShowPos(clickPos);
  };

  return (
    <div id={'plan-calendar'}>
      <Switch checked={reRanking} onChange={setReRanking} />
      <Spin delay={500} loading={fetchTrainsLoading}>
        <div style={{ width: '70vw' }}>
          <TrainCalendar
            disableEdit={reRanking}
            trainCalendarsEvent={trainEvents}
            updateSelectInfo={handleCalendarSelectEvent}
          />
        </div>
      </Spin>
      <Modal
        visible={Boolean(selectEventID)}
        style={{
          top: modelShowPos.y,
          left: modelShowPos.x,
          position: 'absolute',
        }}
        onCancel={() => setSelectEventID(undefined)}
        footer={null}
      >
        {filteredDailyTrain && (
          <TrainDetail
            cardEntity={{
              ...filteredDailyTrain,
              name: filteredDailyTrain.snap_card_name,
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Calendar;
