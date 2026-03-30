import React, { FC, useState } from 'react';
import Calendar from '../features/mealScheduling/components/Calendar';
import MealScheduleForm from '../features/mealScheduling/components/MealScheduleForm';

const MealSchedulingPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateSelect = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 p-2 bg-gray-50">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-white p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch Ăn</h2>
              <p className="text-gray-600">
                Chọn ngày để xem và quản lý lịch ăn của bạn.
              </p>
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
