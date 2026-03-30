import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useGetMealScheduleByDateQuery, useCreateMealScheduleMutation, useUpdateMealScheduleMutation } from '../api/mealSchedulingApi';
import Button from '../../../shared/components/Button';

const MealScheduleForm: FC = () => {
  const selectedDateString = useSelector(
    (state: RootState) => state.mealScheduling.selectedDate
  );
  
  // Parse local date string to Date (YYYY-MM-DD format)
  const parseLocalDateString = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const selectedDate = parseLocalDateString(selectedDateString);
  const dateString = selectedDateString;
  const { data: schedule } = useGetMealScheduleByDateQuery(dateString);
  const [createSchedule] = useCreateMealScheduleMutation();
  const [updateSchedule] = useUpdateMealScheduleMutation();

  const [formData, setFormData] = useState({
    breakfast: schedule?.meals.breakfast || '',
    lunch: schedule?.meals.lunch || '',
    dinner: schedule?.meals.dinner || '',
    snacks: schedule?.meals.snacks || '',
    notes: schedule?.notes || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      date: dateString,
      meals: {
        breakfast: formData.breakfast || undefined,
        lunch: formData.lunch || undefined,
        dinner: formData.dinner || undefined,
        snacks: formData.snacks || undefined
      },
      notes: formData.notes || undefined
    };

    if (schedule?._id) {
      await updateSchedule({
        id: schedule._id,
        payload
      });
    } else {
      await createSchedule(payload as any);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Lịch ăn - {selectedDate.toLocaleDateString('vi-VN')}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bữa sáng
          </label>
          <input
            type="text"
            name="breakfast"
            value={formData.breakfast}
            onChange={handleChange}
            placeholder="Nhập bữa sáng..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bữa trưa
          </label>
          <input
            type="text"
            name="lunch"
            value={formData.lunch}
            onChange={handleChange}
            placeholder="Nhập bữa trưa..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bữa tối
          </label>
          <input
            type="text"
            name="dinner"
            value={formData.dinner}
            onChange={handleChange}
            placeholder="Nhập bữa tối..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ăn nhẹ
          </label>
          <input
            type="text"
            name="snacks"
            value={formData.snacks}
            onChange={handleChange}
            placeholder="Nhập ăn nhẹ..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Nhập ghi chú..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button variant="primary" className="w-full">
          {schedule ? 'Cập nhật' : 'Lưu'} lịch ăn
        </Button>
      </form>
    </div>
  );
};

export default MealScheduleForm;
