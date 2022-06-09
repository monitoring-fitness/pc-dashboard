import React, { useMemo, useState } from 'react';
import '@fullcalendar/react/dist/vdom';
import FullCalendar from '@fullcalendar/react';
import {
  TrainCalendar,
  TrainCalendarProps,
} from '@/pages/dashboard/view/train-calendar';
import { useFetchTrainCalendars } from '@/pages/dashboard/model/view-model/useFetchTrainCalendars';
import { Modal, Spin, Switch } from '@arco-design/web-react';
import { useRerankCalendars } from '@/pages/dashboard/model/view-model/useRerankCalendars';
import { useDailyTrainOperator } from '@/pages/dashboard/model/view-model/useDailyTrainOperator';
import TrainDetail from '@/pages/dashboard/view/train-detail';

const Calendar = (props) => {
  const {
    data: trainsPlan,
    trainEvents,
    loading: fetchTrainsLoading,
  } = useFetchTrainCalendars();
  const {
    reRanking,
    setReRanking,
    loading: updateReRankLoading,
  } = useRerankCalendars();
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
  const calendarComp = React.createRef<FullCalendar>();

  // 传给train-form
  const filteredDailyTrain = useMemo(() => {
    return trainsPlan.find((item) => item.id === selectEventID).train_program;
  }, [selectEventID]);

  const handleSaveRanking = () => {
    const data = calendarComp.current.getApi().getEvents();
    console.log(data);
  };

  const handleCalendarSelectEvent: TrainCalendarProps['updateSelectInfo'] = (
    cellId,
    clickPos
  ) => {
    setSelectEventID(cellId);
    setModelShowPos(clickPos);
  };
  return (
    <div id={'train-calendar'}>
      <Switch checked={reRanking} onChange={setReRanking} />
      <Spin loading={fetchTrainsLoading}>
        <TrainCalendar
          disableEdit={reRanking}
          ref={calendarComp}
          trainCalendarsEvent={trainEvents}
          updateSelectInfo={handleCalendarSelectEvent}
        />
      </Spin>
      <Modal
        visible={Boolean(selectEventID)}
        style={{
          top: modelShowPos.y,
          left: modelShowPos.x,
          position: 'absolute',
        }}
        onCancel={() => setSelectEventID(undefined)}
      >
        <TrainDetail />
      </Modal>
    </div>
  );
};

export default Calendar;
