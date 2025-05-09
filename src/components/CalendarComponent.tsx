import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import localforage from 'localforage';
import { Todo } from '../types/todo';
import jaLocale from '@fullcalendar/core/locales/ja';

export default function CalendarComponent(): JSX.Element {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number | null>(null);
  const [events, setEvents] = useState<{ title: string; date: string }[]>([]);
  const navigate = useNavigate();

  // 日付セルをダブルクリックで詳細ページに遷移
  const handleDateClick = (info: DateClickArg) => {
    const now = Date.now();
    if (lastClickTime && now - lastClickTime < 400) {
      navigate(`/detail/${info.dateStr}`);
    }
    setLastClickTime(now);
  };

  // イベント（タイトル）クリックで詳細ページに遷移
  const handleEventClick = (clickInfo: EventClickArg) => {
    const dateStr = clickInfo.event.startStr;
    navigate(`/detail/${dateStr}`);
  };

  // localforageからタスク取得し、イベント表示用データに変換
  useEffect(() => {
    localforage.getItem('todo-20240622').then((items) => {
      const all = (items as Todo[] | null) ?? [];
      const visibleEvents = all
        .filter(todo => !todo.delete_flg)
        .map(todo => ({
          title: todo.title,
          date: todo.start_date,
        }));
      setEvents(visibleEvents);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'today prev,next',

        }}
        ref={calendarRef}
        dateClick={handleDateClick}
        eventClick={handleEventClick} // ← 追加！
        events={events}
        locale={jaLocale}
      />
    </div>
  );
}
