import React, { FC, useState } from 'react';
import { useSubmitFoodEditMutation } from '../api/contributionsApi';
import { IContributionData } from '../api/contributionsApi';
import { Food } from '../../foods/api/foodApi';

interface SubmitEditSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: Food;
}

const SubmitEditSuggestionModal: FC<SubmitEditSuggestionModalProps> = ({ isOpen, onClose, food }) => {
  const [submitEdit, { isLoading }] = useSubmitFoodEditMutation();
  const [changes, setChanges] = useState<Partial<IContributionData>>({});
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setChanges((prev: Partial<IContributionData>) => ({
      ...prev,
      [field]: value
    }));
  };

  const hasChanges = Object.keys(changes).length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hasChanges) {
      setError('Vui lòng thay đổi ít nhất một trường');
      return;
    }

    try {
      await submitEdit({
        foodId: food._id,
        changes
      }).unwrap();
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setChanges({});
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
          <h2 className="text-2xl font-bold text-gray-800">Đề Xuất Sửa Đổi</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Current Food Info */}
        <div className="bg-gray-50 p-4 border-b">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Sửa đổi cho:</span> {food.name}
          </p>
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
              ✓ Đề xuất thành công! Đang chuyển hướng...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên Món Ăn
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={food.name}
                  disabled
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
                <span className="text-gray-500 py-2">→</span>
                <input
                  type="text"
                  value={changes.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value || undefined)}
                  placeholder="Tên mới (nếu muốn thay đổi)"
                  maxLength={200}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Intro */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giới Thiệu
              </label>
              <textarea
                value={changes.intro || ''}
                onChange={(e) => handleInputChange('intro', e.target.value || undefined)}
                placeholder="Giới thiệu mới (nếu muốn thay đổi)"
                maxLength={2000}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-xs text-gray-500">{changes.intro?.length || 0}/2000</span>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nguyên Liệu
              </label>
              <textarea
                value={changes.ingredients || ''}
                onChange={(e) => handleInputChange('ingredients', e.target.value || undefined)}
                placeholder="Nguyên liệu mới (nếu muốn thay đổi)"
                maxLength={5000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-xs text-gray-500">{changes.ingredients?.length || 0}/5000</span>
            </div>

            {/* Cooking */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cách Nấu
              </label>
              <textarea
                value={changes.cooking || ''}
                onChange={(e) => handleInputChange('cooking', e.target.value || undefined)}
                placeholder="Cách nấu mới (nếu muốn thay đổi)"
                maxLength={5000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-xs text-gray-500">{changes.cooking?.length || 0}/5000</span>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Ảnh
              </label>
              <input
                type="url"
                value={changes.image || ''}
                onChange={(e) => handleInputChange('image', e.target.value || undefined)}
                placeholder="URL ảnh mới (nếu muốn thay đổi)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
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
                disabled={isLoading || !hasChanges}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

export default SubmitEditSuggestionModal;
