import { EventClickArg, EventInput } from '@fullcalendar/common';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

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

export const TrainCalendar = React.forwardRef<FullCalendar, TrainCalendarProps>(
  ({ trainCalendarsEvent, updateSelectInfo, disableEdit }, ref) => {
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
        <FullCalendar
          ref={ref}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          editable={disableEdit}
          weekends={false}
          events={trainCalendarsEvent}
          eventClick={handleEventClick}
        />
      </>
    );
  }
);
