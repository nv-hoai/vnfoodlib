import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useGetMealScheduleByDateQuery, useCreateMealScheduleMutation, useUpdateMealScheduleMutation } from '../api/mealSchedulingApi';
import { useGetAllFoodsQuery } from '../../foods/api/foodApi';
import Button from '../../../shared/components/Button';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface FoodSearchState {
  query: string;
  selectedMeal: MealType | null;
}

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
  const { data: schedule, isLoading: isLoadingSchedule } = useGetMealScheduleByDateQuery(dateString);
  const [createSchedule, { isLoading: isCreating }] = useCreateMealScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating }] = useUpdateMealScheduleMutation();
  const { data: foodsData } = useGetAllFoodsQuery({ page: 1, limit: 100 });
  
  const [formData, setFormData] = useState({
    breakfast: schedule?.meals?.breakfast || '',
    lunch: schedule?.meals?.lunch || '',
    dinner: schedule?.meals?.dinner || '',
    snacks: schedule?.meals?.snacks || '',
    notes: schedule?.notes || ''
  });

  const [foodSearch, setFoodSearch] = useState<FoodSearchState>({
    query: '',
    selectedMeal: null
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync form data when schedule data changes
  useEffect(() => {
    if (schedule) {
      setFormData({
        breakfast: schedule.meals?.breakfast || '',
        lunch: schedule.meals?.lunch || '',
        dinner: schedule.meals?.dinner || '',
        snacks: schedule.meals?.snacks || '',
        notes: schedule.notes || ''
      });
    } else {
      setFormData({
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: '',
        notes: ''
      });
    }
  }, [schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const foods = foodsData?.data?.foods || [];
  
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(foodSearch.query.toLowerCase())
  );

  const handleFoodSelect = (mealType: MealType) => {
    setFoodSearch({ query: '', selectedMeal: mealType });
  };

  const handleAddFood = (foodName: string, mealType: MealType) => {
    const currentValue = formData[mealType];
    const newValue = currentValue ? `${currentValue}, ${foodName}` : foodName;
    setFormData(prev => ({
      ...prev,
      [mealType]: newValue
    }));
    setFoodSearch({ query: '', selectedMeal: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
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
        }).unwrap();
        setSuccessMessage('Cập nhật lịch ăn thành công!');
      } else {
        await createSchedule(payload as any).unwrap();
        setSuccessMessage('Lưu lịch ăn thành công!');
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại';
      setErrorMessage(message);
      console.error('Meal schedule error:', error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Lịch ăn - {selectedDate.toLocaleDateString('vi-VN')}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Breakfast */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bữa sáng
          </label>
          <div className="relative">
            <input
              type="text"
              name="breakfast"
              value={formData.breakfast}
              onChange={handleChange}
              onClick={() => handleFoodSelect('breakfast')}
              placeholder="Nhập hoặc chọn bữa sáng..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {foodSearch.selectedMeal === 'breakfast' && foodSearch.query.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-1">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map(food => (
                    <button
                      key={food._id}
                      type="button"
                      onClick={() => handleAddFood(food.name, 'breakfast')}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition border-b last:border-b-0"
                    >
                      {food.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Khong tim thay mon an</div>
                )}
              </div>
            )}
          </div>
          {foodSearch.selectedMeal === 'breakfast' && (
            <input
              type="text"
              placeholder="Tim kiem mon an..."
              value={foodSearch.query}
              onChange={(e) => setFoodSearch({ ...foodSearch, query: e.target.value })}
              className="w-full px-3 py-1 border border-blue-300 rounded mt-1 text-sm focus:outline-none"
            />
          )}
        </div>

        {/* Lunch */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bữa trưa
          </label>
          <div className="relative">
            <input
              type="text"
              name="lunch"
              value={formData.lunch}
              onChange={handleChange}
              onClick={() => handleFoodSelect('lunch')}
              placeholder="Nhập hoặc chọn bữa trưa..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {foodSearch.selectedMeal === 'lunch' && foodSearch.query.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-1">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map(food => (
                    <button
                      key={food._id}
                      type="button"
                      onClick={() => handleAddFood(food.name, 'lunch')}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition border-b last:border-b-0"
                    >
                      {food.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Khong tim thay mon an</div>
                )}
              </div>
            )}
          </div>
          {foodSearch.selectedMeal === 'lunch' && (
            <input
              type="text"
              placeholder="Tim kiem mon an..."
              value={foodSearch.query}
              onChange={(e) => setFoodSearch({ ...foodSearch, query: e.target.value })}
              className="w-full px-3 py-1 border border-blue-300 rounded mt-1 text-sm focus:outline-none"
            />
          )}
        </div>

        {/* Dinner */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bữa tối
          </label>
          <div className="relative">
            <input
              type="text"
              name="dinner"
              value={formData.dinner}
              onChange={handleChange}
              onClick={() => handleFoodSelect('dinner')}
              placeholder="Nhập hoặc chọn bữa tối..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {foodSearch.selectedMeal === 'dinner' && foodSearch.query.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-1">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map(food => (
                    <button
                      key={food._id}
                      type="button"
                      onClick={() => handleAddFood(food.name, 'dinner')}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition border-b last:border-b-0"
                    >
                      {food.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Khong tim thay mon an</div>
                )}
              </div>
            )}
          </div>
          {foodSearch.selectedMeal === 'dinner' && (
            <input
              type="text"
              placeholder="Tim kiem mon an..."
              value={foodSearch.query}
              onChange={(e) => setFoodSearch({ ...foodSearch, query: e.target.value })}
              className="w-full px-3 py-1 border border-blue-300 rounded mt-1 text-sm focus:outline-none"
            />
          )}
        </div>

        {/* Snacks */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ăn nhẹ
          </label>
          <div className="relative">
            <input
              type="text"
              name="snacks"
              value={formData.snacks}
              onChange={handleChange}
              onClick={() => handleFoodSelect('snacks')}
              placeholder="Nhập hoặc chọn ăn nhẹ..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {foodSearch.selectedMeal === 'snacks' && foodSearch.query.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-1">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map(food => (
                    <button
                      key={food._id}
                      type="button"
                      onClick={() => handleAddFood(food.name, 'snacks')}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition border-b last:border-b-0"
                    >
                      {food.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Khong tim thay mon an</div>
                )}
              </div>
            )}
          </div>
          {foodSearch.selectedMeal === 'snacks' && (
            <input
              type="text"
              placeholder="Tim kiem mon an..."
              value={foodSearch.query}
              onChange={(e) => setFoodSearch({ ...foodSearch, query: e.target.value })}
              className="w-full px-3 py-1 border border-blue-300 rounded mt-1 text-sm focus:outline-none"
            />
          )}
        </div>

        {/* Notes */}
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

        {successMessage && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? 'Đang xử lý...' : (schedule ? 'Cập nhật' : 'Lưu')} lịch ăn
        </Button>
      </form>
    </div>
  );
};

export default MealScheduleForm;
