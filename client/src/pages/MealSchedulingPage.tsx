import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Calendar from '../features/mealScheduling/components/Calendar';
import MealScheduleForm from '../features/mealScheduling/components/MealScheduleForm';
import { useGetMealScheduleByDateQuery } from '../features/mealScheduling/api/mealSchedulingApi';

const MealSchedulingPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedDateString = useSelector(
    (state: RootState) => state.mealScheduling.selectedDate
  );

  const { data: schedule, isLoading } = useGetMealScheduleByDateQuery(selectedDateString);

  const handleDateSelect = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const parseLocalDateString = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const selectedDate = parseLocalDateString(selectedDateString);

  return (
    <div className="flex-1 p-2 bg-gray-50">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-white p-6 h-full rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {selectedDate.toLocaleDateString('vi-VN')}
              </h2>
              {isLoading ? (
                <p className="text-gray-500">Đang tải...</p>
              ) : schedule ? (
                <div className="space-y-4">
                  {schedule.meals?.breakfast && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Bữa sáng</h3>
                      <p className="text-gray-600 text-sm">{schedule.meals.breakfast}</p>
                    </div>
                  )}
                  {schedule.meals?.lunch && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Bữa trưa</h3>
                      <p className="text-gray-600 text-sm">{schedule.meals.lunch}</p>
                    </div>
                  )}
                  {schedule.meals?.dinner && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Bữa tối</h3>
                      <p className="text-gray-600 text-sm">{schedule.meals.dinner}</p>
                    </div>
                  )}
                  {schedule.meals?.snacks && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Ăn nhẹ</h3>
                      <p className="text-gray-600 text-sm">{schedule.meals.snacks}</p>
                    </div>
                  )}
                  {schedule.notes && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">Ghi chú</h3>
                      <p className="text-gray-600 text-sm">{schedule.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Nhấn vào ngày để tạo lịch ăn.</p>
              )}
            </div>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-3">
            <Calendar onDateSelect={handleDateSelect} />
          </div>
        </div>
      </div>

      {/* Meal Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full mx-4 max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Quản Lý Lịch Ăn</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <MealScheduleForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSchedulingPage;
