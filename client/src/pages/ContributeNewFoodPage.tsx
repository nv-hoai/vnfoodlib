import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmitNewFoodMutation } from '../features/contributions/api/contributionsApi';
import { IContributionData } from '../features/contributions/api/contributionsApi';
import Button from '../shared/components/Button';

type TagKey = 'category' | 'ingredient' | 'meal_time' | 'cooking_method' | 'taste' | 'purpose' | 'diet';

const CATEGORIES = ['Cơm', 'Mì Ý', 'Salad', 'Soup', 'Dessert', 'Drink', 'Snack'];
const INGREDIENTS = ['Gà', 'Cá', 'Thịt Bò', 'Tôm', 'Trứng', 'Rau', 'Nấm'];
const MEAL_TIMES = ['Sáng', 'Trưa', 'Tối', 'Nhẹ'];
const COOKING_METHODS = ['Nướng', 'Luộc', 'Xào', 'Hấp', 'Kho', 'Chiên'];
const TASTES = ['Cay', 'Mặn', 'Ngọt', 'Chua', 'Đầy Đủ'];
const PURPOSES = ['Tăng Cân', 'Giảm Cân', 'Sức Khỏe', 'Năng Lượng'];
const DIETS = ['Vegetarian', 'Vegan', 'Không Gluten', 'Low Carb', 'Keto'];

const ContributeNewFoodPage: FC = () => {
  const navigate = useNavigate();
  const [submitNewFood, { isLoading }] = useSubmitNewFoodMutation();

  const [formData, setFormData] = useState<IContributionData>({
    name: '',
    intro: '',
    ingredients: '',
    cooking: '',
    tags: {
      category: [],
      ingredient: [],
      meal_time: [],
      cooking_method: [],
      taste: [],
      purpose: [],
      diet: []
    },
    image: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

    if (!formData.name || !formData.intro || !formData.ingredients || !formData.cooking) {
      setErrorMessage('Vui lòng điền các trường bắt buộc');
      return;
    }

    try {
      const result = await submitNewFood(formData).unwrap();
      setSuccessMessage('✅ Đóng góp thành công! Đơn sẽ được xem xét trong thời gian sớm nhất.');
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Đóng Góp Món Ăn Mới</h1>
          <p className="text-gray-600">
            Chia sẻ một món ăn yêu thích của bạn với cộng đồng. Đóng góp của bạn sẽ được quản trị viên xem xét trước khi xuất bản.
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
                  Tên Món Ăn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="VD: Phở Bò Hà Nội"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Introduction */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giới Thiệu <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="intro"
                  value={formData.intro}
                  onChange={handleInputChange}
                  placeholder="Mô tả ngắn về món ăn..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ảnh Món Ăn
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
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
                  Nguyên Liệu <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="VD: 500g thịt bò, 2 lít nước xương, 2 hành khô..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Cooking Instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hướng Dẫn Nấu <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="cooking"
                  value={formData.cooking}
                  onChange={handleInputChange}
                  placeholder="Mô tả từng bước nấu ăn..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Đang gửi...' : '✓ Gửi Đóng Góp'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/my-contributions')}
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

export default ContributeNewFoodPage;
