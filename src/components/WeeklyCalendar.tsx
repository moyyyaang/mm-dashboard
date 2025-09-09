import React, { useState } from 'react';

interface WeeklyCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const today = new Date().toISOString().split('T')[0];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDay = (date: Date) => {
    return date.getDate().toString();
  };

  const formatDayName = (date: Date) => {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return dayNames[date.getDay()];
  };

  const isToday = (date: Date) => {
    return formatDate(date) === today;
  };

  const isSelected = (date: Date) => {
    return formatDate(date) === selectedDate;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            {currentWeek.getFullYear()}년 {currentWeek.getMonth() + 1}월
          </div>
          <button
            onClick={goToToday}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            오늘
          </button>
        </div>
        
        <button
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(formatDate(date))}
            className={`p-2 text-center rounded-lg transition-colors ${
              isSelected(date)
                ? 'bg-blue-500 text-white'
                : isToday(date)
                ? 'bg-green-100 text-green-700'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">{formatDayName(date)}</div>
            <div className="text-sm font-medium">{formatDay(date)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
