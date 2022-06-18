import { useRerankCalendars } from '@/features/dashboard/model/view-model/useRerankCalendars';
import { useDailyTrainOperator } from '@/features/dashboard/model/view-model/useDailyTrainOperator';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  closeEventDialog,
  getAllCalendars,
  openEventDialog,
  reRankTrainsDay,
  selectAllPlanCalendar,
  selectEventDialog,
} from '@/features/work-calendar/train-calendar.slice';
import React, { useMemo, useState } from 'react';
import {
  Calendar,
  TrainCalendarProps,
} from '@/features/work-calendar/components/calendar';
import { Message, Modal, Spin, Switch } from '@arco-design/web-react';
import { Detail } from '@/features/work-calendar/components/detail';
import { useMount } from 'ahooks';

const WorkCalendar = () => {
  const dispatch = useAppDispatch();
  const calendars = useAppSelector(selectAllPlanCalendar);
  const dialogInfo = useAppSelector(selectEventDialog);
  const loading = useAppSelector((state) => state.planCalendar.status);

  const [selectEventId, setSelectEventId] = useState<string>();

  useMount(() => {
    dispatch(getAllCalendars());
  });

  // 传递给日历组件
  const mappedCalendarEvents = useMemo(
    () =>
      calendars.map((dailyTrain) => ({
        id: dailyTrain.id,
        title: dailyTrain.snap_card_name,
        allDay: true,
        start: dailyTrain.date,
      })),
    [calendars]
  );

  const handleCalendarSelectEvent: TrainCalendarProps['updateSelectInfo'] = (
    cellId,
    clickPos
  ) => {
    setSelectEventId(cellId);
    dispatch(
      openEventDialog({ anchorPosition: { top: clickPos.y, left: clickPos.x } })
    );
    //  dispatch openEditModal
  };

  return (
    <div id={'plan-work-calendar'}>
      <Spin delay={500} loading={loading === 'loading'}>
        <div style={{ width: '70vw' }}>
          <Calendar
            // disableEdit={reRanking}
            disableEdit={false}
            trainCalendarsEvent={mappedCalendarEvents}
            updateSelectInfo={handleCalendarSelectEvent}
            updateEventNewDate={(id, newDate) =>
              dispatch(
                reRankTrainsDay({ daily_train_id: id, new_date: newDate })
              ).then(() => Message.success('更新成功'))
            }
          />
        </div>
      </Spin>
      <Modal
        visible={dialogInfo.open}
        style={{
          top: dialogInfo.anchorPosition.top,
          left: dialogInfo.anchorPosition.left,
          position: 'absolute',
        }}
        onCancel={() => dispatch(closeEventDialog({}))}
        footer={null}
      >
        {dialogInfo.open && <Detail currentID={selectEventId} />}
      </Modal>
    </div>
  );
};

export default WorkCalendar;
