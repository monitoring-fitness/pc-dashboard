import {
  CalendarApi,
  DatesSetArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/common';
import React, { useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, ButtonProps, Space, Tooltip } from '@arco-design/web-react';
import {
  IconCalendarClock,
  IconLeft,
  IconRight,
} from '@arco-design/web-react/icon';

export interface TrainCalendarProps {
  trainCalendarsEvent: EventInput[];
  /**
   * 控制当前组件是否可以拖动
   */
  disableEdit: boolean;
  updateSelectInfo: (
    cellId: string,
    clickPos: { x: number; y: number }
  ) => void;
}

const TrainCalendarHeader: React.FC<{
  dateText?: string;
  api: CalendarApi;
}> = ({ dateText, api }) => {
  const buttonCommon: ButtonProps = {
    shape: 'circle',
    type: 'text',
    size: 'large',
  };
  const handleTravelMonth = (direction: 'next' | 'prev' | 'today') => {
    switch (direction) {
      case 'next':
        api.next();
        break;
      case 'prev':
        api.prev();
        break;
      case 'today':
        api.today();
        break;
    }
  };
  return (
    <Space>
      {dateText}
      <Button {...buttonCommon} onClick={() => handleTravelMonth('prev')}>
        <IconLeft />
      </Button>
      <Button {...buttonCommon} onClick={() => handleTravelMonth('next')}>
        <IconRight />
      </Button>
      <Button {...buttonCommon} onClick={() => handleTravelMonth('today')}>
        <Tooltip content="jump to today">
          <IconCalendarClock />
        </Tooltip>
      </Button>
    </Space>
  );
};

export const TrainCalendar: React.FC<TrainCalendarProps> = ({
  trainCalendarsEvent,
  updateSelectInfo,
  disableEdit,
}) => {
  const [currentDate, setCurrentDate] = useState<DatesSetArg>();

  const ref = useRef<FullCalendar>();

  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };

  /**
   * 处理日历的内容点击事件，主要行为：
   *
   * - 获取当前要展示的训练日程id
   *
   * - 获取当前点击坐标，为训练日程展示指引位置
   */
  const handleEventClick = ({ jsEvent, event }: EventClickArg) => {
    const { clientX, clientY } = jsEvent;
    const { id } = event;
    updateSelectInfo(id, { x: clientX, y: clientY });
  };

  return (
    <>
      <TrainCalendarHeader
        api={ref?.current?.getApi()}
        dateText={currentDate?.view?.title}
      />
      <FullCalendar
        ref={ref}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        editable={disableEdit}
        weekends={false}
        events={trainCalendarsEvent}
        eventClick={handleEventClick}
        datesSet={handleDates}
      />
    </>
  );
};
