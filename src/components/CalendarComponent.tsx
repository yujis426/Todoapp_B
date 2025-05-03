import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function CalendarComponent(): JSX.Element {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleDateClick = (info: DateClickArg) => {
    const now = Date.now();
    if (lastClickTime && now - lastClickTime < 400) {
      navigate(`/detail/${info.dateStr}`);
    }
    setLastClickTime(now);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        ref={calendarRef}
        dateClick={handleDateClick}
      />
    </div>
  );
}