import React, { FC, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFoodByIdQuery } from '../features/foods/api/foodApi';
import { useSubmitFoodEditMutation } from '../features/contributions/api/contributionsApi';
import { IContributionData } from '../features/contributions/api/contributionsApi';
import Button from '../shared/components/Button';
type TagKey = 'category' | 'ingredient' | 'meal_time' | 'cooking_method' | 'taste' | 'purpose' | 'diet';
const CATEGORIES = ['Cơm', 'Mì Ý', 'Salad', 'Soup', 'Dessert', 'Drink', 'Snack'];
const MEAL_TIMES = ['Sáng', 'Trưa', 'Tối', 'Nhẹ'];
const COOKING_METHODS = ['Nướng', 'Luộc', 'Xào', 'Hấp', 'Kho', 'Chiên'];
const DIETS = ['Vegetarian', 'Vegan', 'Không Gluten', 'Low Carb', 'Keto'];

const ContributeEditFoodPage: FC = () => {
  const { id: foodId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: foodResponse, isLoading: isFoodLoading } = useGetFoodByIdQuery(foodId || '');
  const food = foodResponse?.data?.food;
  
  const [submitFoodEdit, { isLoading: isSubmitting }] = useSubmitFoodEditMutation();

  const [formData, setFormData] = useState<IContributionData>({
    name: food?.name || '',
    intro: food?.intro || '',
    ingredients: food?.ingredients || '',
    cooking: food?.cooking || '',
    tags: {
      category: food?.tags?.category || [],
      ingredient: food?.tags?.ingredient || [],
      meal_time: food?.tags?.meal_time || [],
      cooking_method: food?.tags?.cooking_method || [],
      taste: food?.tags?.taste || [],
      purpose: food?.tags?.purpose || [],
      diet: food?.tags?.diet || []
    },
    image: food?.image || ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!foodId) {
    return <div className="p-6">Không tìm thấy món ăn</div>;
  }

  if (isFoodLoading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Không tìm thấy món ăn</p>
          <Button variant="outline" onClick={() => navigate('/foods')} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tagType: TagKey, tag: string) => {
    setFormData(prev => {
      const currentTags = prev.tags![tagType] as string[];
      return {
        ...prev,
        tags: {
          ...prev.tags!,
          [tagType]: currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag]
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const changes: Partial<IContributionData> = {};
      
      // Only include fields that were changed
      if (formData.name !== food.name) changes.name = formData.name;
      if (formData.intro !== food.intro) changes.intro = formData.intro;
      if (formData.ingredients !== food.ingredients) changes.ingredients = formData.ingredients;
      if (formData.cooking !== food.cooking) changes.cooking = formData.cooking;
      if (formData.image !== food.image) changes.image = formData.image;

      // Check if tags changed
      const tagsChanged = JSON.stringify(formData.tags) !== JSON.stringify(food.tags);
      if (tagsChanged) changes.tags = formData.tags;

      if (Object.keys(changes).length === 0) {
        setErrorMessage('Không có thay đổi nào để gửi');
        return;
      }

      await submitFoodEdit({
        foodId,
        changes
      }).unwrap();

      setSuccessMessage('✅ Đề xuất sửa đổi thành công! Đơn sẽ được xem xét trong thời gian sớm nhất.');
      setTimeout(() => {
        navigate('/my-contributions');
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setErrorMessage('❌ ' + message);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Đề Xuất Chỉnh Sửa Món Ăn</h1>
          <p className="text-gray-600">
            Đề xuất cải thiện thông tin về "{food.name}". Đề xuất của bạn sẽ được quản trị viên xem xét trước khi áp dụng.
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông Tin Cơ Bản</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Món Ăn
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tên món ăn"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.name !== food.name && (
                  <p className="text-xs text-blue-600 mt-1">💡 Sẽ thay đổi từ "{food.name}"</p>
                )}
              </div>

              {/* Introduction */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giới Thiệu
                </label>
                <textarea
                  name="intro"
                  value={formData.intro}
                  onChange={handleInputChange}
                  placeholder="Mô tả về món ăn"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.intro !== food.intro && (
                  <p className="text-xs text-blue-600 mt-1">💡 Sẽ cập nhật mô tả</p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thay Đổi Ảnh
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Ảnh hiện tại:</p>
                    {food.image && (
                      <img
                        src={food.image}
                        alt="Current"
                        className="w-40 h-40 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                    />
                    {formData.image !== food.image && formData.image && (
                      <>
                        <p className="text-xs text-gray-600 mb-2">Ảnh mới:</p>
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-40 h-40 object-cover rounded-lg"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cooking Details */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi Tiết Nấu Ăn</h2>

            <div className="space-y-4">
              {/* Ingredients */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nguyên Liệu
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="Danh sách nguyên liệu"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.ingredients !== food.ingredients && (
                  <p className="text-xs text-blue-600 mt-1">💡 Sẽ cập nhật nguyên liệu</p>
                )}
              </div>

              {/* Cooking Instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hướng Dẫn Nấu
                </label>
                <textarea
                  name="cooking"
                  value={formData.cooking}
                  onChange={handleInputChange}
                  placeholder="Các bước nấu ăn"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.cooking !== food.cooking && (
                  <p className="text-xs text-blue-600 mt-1">💡 Sẽ cập nhật hướng dẫn</p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Phân Loại & Thẻ</h2>

            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Thể Loại</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleTagToggle('category', cat)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        (formData.tags?.category || []).includes(cat)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking Methods */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cách Nấu</label>
                <div className="flex flex-wrap gap-2">
                  {COOKING_METHODS.map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => handleTagToggle('cooking_method', method)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        (formData.tags?.cooking_method || []).includes(method)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Times */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Thời Gian Ăn</label>
                <div className="flex flex-wrap gap-2">
                  {MEAL_TIMES.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTagToggle('meal_time', time)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        (formData.tags?.meal_time || []).includes(time)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chế Độ Ăn</label>
                <div className="flex flex-wrap gap-2">
                  {DIETS.map(diet => (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => handleTagToggle('diet', diet)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        (formData.tags?.diet || []).includes(diet)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Đang gửi...' : '✓ Gửi Đề Xuất'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/foods/${foodId}`)}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributeEditFoodPage;
