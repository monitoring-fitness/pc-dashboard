import {
  CalendarApi,
  DatesSetArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from '@fullcalendar/common';
import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/react/dist/vdom'; // 防止报错 ： https://github.com/fullcalendar/fullcalendar/issues/6371
import {
  Button,
  ButtonProps,
  Space,
  Switch,
  Tooltip,
} from '@arco-design/web-react';
import {
  IconCalendarClock,
  IconLeft,
  IconRight,
} from '@arco-design/web-react/icon';
import { useToggle } from 'ahooks';

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
  updateEventNewDate: (id: string, newDate: string) => void;
}

const TrainCalendarHeader: React.FC<{
  dateText?: string;
  api: CalendarApi;
  editWidgetState: boolean;
  handleEditWidgetChange: () => void;
}> = ({ dateText, api, editWidgetState, handleEditWidgetChange }) => {
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
      <Switch
        checked={editWidgetState}
        onChange={handleEditWidgetChange}
        title={'排序日历'}
      />
    </Space>
  );
};

export const Calendar: React.FC<TrainCalendarProps> = ({
  trainCalendarsEvent,
  updateSelectInfo,
  updateEventNewDate,
}) => {
  const [currentDate, setCurrentDate] = useState<DatesSetArg>();
  const [disabledEdit, { toggle: toggleDisableState }] = useToggle(true);

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

  const handleEventDrop = (arg: EventDropArg) => {
    const { startStr: afterDate, id } = arg.event;
    const { startStr: beforeDate } = arg.oldEvent;

    if (beforeDate === afterDate) {
      return;
    }
    updateEventNewDate(id, afterDate);
  };

  return (
    <>
      <TrainCalendarHeader
        api={ref?.current?.getApi()}
        dateText={currentDate?.view?.title}
        editWidgetState={disabledEdit}
        handleEditWidgetChange={toggleDisableState}
      />
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={false}
        initialView="dayGridMonth"
        // selectable
        weekends
        editable={disabledEdit}
        events={trainCalendarsEvent}
        eventClick={handleEventClick}
        datesSet={handleDates}
        eventDrop={handleEventDrop}
      />
    </>
  );
};
