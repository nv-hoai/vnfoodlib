import React, { FC, useState } from 'react';
import { useSubmitNewFoodMutation } from '../api/contributionsApi';
import { IContributionData } from '../api/contributionsApi';

interface SubmitNewFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitNewFoodModal: FC<SubmitNewFoodModalProps> = ({ isOpen, onClose }) => {
  const [submitFood, { isLoading }] = useSubmitNewFoodMutation();
  const [formData, setFormData] = useState<IContributionData>({
    name: '',
    intro: '',
    ingredients: '',
    cooking: '',
    image: '',
    tags: {
      category: [],
      ingredient: [],
      meal_time: [],
      cooking_method: [],
      taste: [],
      purpose: [],
      diet: []
    }
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const categories = ['món nước', 'món kho', 'món chiên', 'món xào', 'món nướng', 'món hấp', 'món luộc', 'món trộn', 'món cuốn', 'món cơm', 'món bánh', 'món ăn vặt', 'món tráng miệng', 'món chè', 'món lẩu', 'món cháo', 'món súp', 'đồ uống'];
  const cookingMethods = ['nước dùng', 'kho', 'chiên giòn', 'chiên ngập dầu', 'áp chảo', 'xào', 'nướng than', 'nướng lò', 'hấp', 'luộc', 'trộn', 'ướp', 'rim', 'sốt', 'lên men'];
  const tastes = ['cay', 'không cay', 'ngọt', 'mặn', 'chua', 'đắng', 'béo', 'thanh đạm', 'đậm vị'];
  const mealTimes = ['ăn sáng', 'ăn trưa', 'ăn tối', 'ăn đêm', 'ăn vặt'];
  const purposes = ['ăn vặt', 'ăn chính', 'nhậu', 'tiệc', 'gia đình', 'đường phố', 'nhà hàng', 'take away'];
  const diets = ['chay', 'thuần chay', 'healthy', 'ăn kiêng', 'ít calo', 'ít đường', 'ít béo', 'high protein'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: IContributionData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tagType: 'category' | 'ingredient' | 'meal_time' | 'cooking_method' | 'taste' | 'purpose' | 'diet', value: string) => {
    setFormData((prev: IContributionData) => {
      const currentTags = prev.tags?.[tagType] || [];
      const isSelected = currentTags.includes(value);
      
      return {
        ...prev,
        tags: {
          ...prev.tags!,
          [tagType]: isSelected
            ? currentTags.filter((t: string) => t !== value)
            : [...currentTags, value]
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name?.trim() || formData.name.length < 3) {
      setError('Tên món ăn phải từ 3-200 ký tự');
      return;
    }

    if (!formData.intro?.trim() || formData.intro.length < 10 || formData.intro.length > 2000) {
      setError('Giới thiệu phải từ 10-2000 ký tự');
      return;
    }

    if (!formData.ingredients?.trim() || formData.ingredients.length < 20) {
      setError('Nguyên liệu phải ít nhất 20 ký tự');
      return;
    }

    if (!formData.cooking?.trim() || formData.cooking.length < 20) {
      setError('Cách nấu phải ít nhất 20 ký tự');
      return;
    }

    if (!formData.image?.trim()) {
      setError('Vui lòng nhập URL ảnh');
      return;
    }

    try {
      await submitFood(formData).unwrap();
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          intro: '',
          ingredients: '',
          cooking: '',
          image: '',
          tags: {}
        });
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Đề xuất Món Ăn Mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              ✓ Đóng góp thành công! Đang chuyển hướng...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tên Món Ăn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="VD: Phở bò Hà Nội"
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-xs text-gray-500">{formData.name?.length || 0}/200</span>
            </div>

            {/* Intro */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Giới Thiệu <span className="text-red-500">*</span>
              </label>
              <textarea
                name="intro"
                value={formData.intro}
                onChange={handleInputChange}
                placeholder="Mô tả ngắn về món ăn..."
                maxLength={2000}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-xs text-gray-500">{formData.intro?.length || 0}/2000</span>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nguyên Liệu <span className="text-red-500">*</span>
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                placeholder="Liệt kê các nguyên liệu..."
                maxLength={5000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-xs text-gray-500">{formData.ingredients?.length || 0}/5000</span>
            </div>

            {/* Cooking */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Cách Nấu <span className="text-red-500">*</span>
              </label>
              <textarea
                name="cooking"
                value={formData.cooking}
                onChange={handleInputChange}
                placeholder="Các bước nấu..."
                maxLength={5000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-xs text-gray-500">{formData.cooking?.length || 0}/5000</span>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                URL Ảnh <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Tags */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Nhãn Dán (Tùy Chọn)</h3>

              {/* Categories */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Loại Món Ăn</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.tags?.category || []).includes(cat)}
                        onChange={() => handleTagToggle('category', cat)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cooking Methods */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Cách Nấu</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {cookingMethods.map(method => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.tags?.cooking_method || []).includes(method)}
                        onChange={() => handleTagToggle('cooking_method', method)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tastes */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Vị</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tastes.map(taste => (
                    <label key={taste} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.tags?.taste || []).includes(taste)}
                        onChange={() => handleTagToggle('taste', taste)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">{taste}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meal Times */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Thời Điểm Ăn</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {mealTimes.map(time => (
                    <label key={time} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.tags?.meal_time || []).includes(time)}
                        onChange={() => handleTagToggle('meal_time', time)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Purposes */}
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Mục Đích</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {purposes.map(purpose => (
                    <label key={purpose} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.tags?.purpose || []).includes(purpose)}
                        onChange={() => handleTagToggle('purpose', purpose)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">{purpose}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Diets */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Chế Độ Ăn</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {diets.map(diet => (
                    <label key={diet} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.tags?.diet || []).includes(diet)}
                        onChange={() => handleTagToggle('diet', diet)}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">{diet}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi Đề Xuất'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitNewFoodModal;
