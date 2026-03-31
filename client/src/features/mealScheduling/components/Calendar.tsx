import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  setSelectedDate,
  goToPreviousMonth,
  goToNextMonth,
  goToToday
} from '../slices/mealSchedulingSlice';
import { useGetMealSchedulesForMonthQuery } from '../api/mealSchedulingApi';

interface CalendarProps {
  onDateSelect?: () => void;
}

const Calendar: FC<CalendarProps> = ({ onDateSelect }) => {
  const dispatch = useDispatch();
  const selectedDateString = useSelector(
    (state: RootState) => state.mealScheduling.selectedDate
  );
  
  // Helper function để format local date string
  const formatLocalDateString = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };
  
  // Parse local date string to Date (YYYY-MM-DD format)
  const parseLocalDateString = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const selectedDate = parseLocalDateString(selectedDateString);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const { data: schedules = [] } = useGetMealSchedulesForMonthQuery({
    year,
    month: month + 1
  });

  // Get calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [year, month]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  const handleDateClick = (dayString: string | null) => {
    if (dayString) {
      dispatch(setSelectedDate(dayString));
      onDateSelect?.();
    }
  };

  return (
    <div className="bg-white p-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {monthName} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(goToPreviousMonth())}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition"
          >
            ← Trước
          </button>
          <button
            onClick={() => dispatch(goToToday())}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition"
          >
            Hôm nay
          </button>
          <button
            onClick={() => dispatch(goToNextMonth())}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition"
          >
            Sau →
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayString = day ? formatLocalDateString(day) : null;
          const hasSchedule = schedules.some(s => s.date === dayString);
          return (
            <button
              key={index}
              onClick={() => handleDateClick(dayString)}
              className={`
                h-24 p-2 rounded cursor-pointer transition border-2 relative
                ${dayString === selectedDateString ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                ${day ? 'bg-white' : 'bg-gray-50 opacity-50'}
              `}
              disabled={!day}
            >
              {day && (
                <>
                  <span className="font-semibold text-gray-800">{day.getDate()}</span>
                  {hasSchedule && (
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
