import { useRerankCalendars } from '@/features/dashboard/model/view-model/useRerankCalendars';
import { useDailyTrainOperator } from '@/features/dashboard/model/view-model/useDailyTrainOperator';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  getAllCalendars,
  selectAllPlanCalendar,
} from '@/features/work-calendar/train-calendar.slice';
import React, { useMemo, useState } from 'react';
import {
  TrainCalendar,
  TrainCalendarProps,
} from '@/features/work-calendar/components/train-calendar';
import { Modal, Spin, Switch } from '@arco-design/web-react';
import { TrainDetail } from '@/features/dashboard/view/train-detail';
import { useMount } from 'ahooks';

const WorkCalendar = () => {
  const dispatch = useAppDispatch();
  const {
    selectEventID,
    setSelectEventID,
    executePost,
    loading: updateTrainLoading,
  } = useDailyTrainOperator();
  const [modelShowPos, setModelShowPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const calendars = useAppSelector(selectAllPlanCalendar);
  const loading = useAppSelector((state) => state.planCalendar.status);

  useMount(() => {
    dispatch(getAllCalendars());
  });

  // 传递给日历组件
  const mappedCalendarEvents = useMemo(
    () =>
      calendars.map((dailyTrain) => ({
        id: dailyTrain._id,
        title: dailyTrain.snap_card_name,
        date: dailyTrain.date,
      })),
    [calendars]
  );

  // 传给train-form
  const filteredDailyTrain = useMemo(() => {
    return calendars.find((item) => item._id === selectEventID);
  }, [selectEventID]);

  const handleCalendarSelectEvent: TrainCalendarProps['updateSelectInfo'] = (
    cellId,
    clickPos
  ) => {
    setSelectEventID(cellId);
    setModelShowPos(clickPos);
  };

  return (
    <div id={'plan-work-calendar'}>
      {/*<Switch checked={reRanking} onChange={setReRanking} />*/}
      <Spin delay={500} loading={loading === 'loading'}>
        <div style={{ width: '70vw' }}>
          <TrainCalendar
            // disableEdit={reRanking}
            disableEdit={false}
            trainCalendarsEvent={mappedCalendarEvents}
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
        {/*{filteredDailyTrain && (*/}
        {/*  <TrainDetail*/}
        {/*    cardEntity={{*/}
        {/*      ...filteredDailyTrain,*/}
        {/*      name: filteredDailyTrain.snap_card_name,*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}
      </Modal>
    </div>
  );
};

export default WorkCalendar;
