import React, { FC, useState } from 'react';
import { useCreateCollectionMutation } from '../api/collectionsApi';
import Button from '../../../shared/components/Button';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateCollectionModal: FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [createCollection] = useCreateCollectionMutation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên bộ sưu tập');
      return;
    }

    try {
      await createCollection({
        name: formData.name,
        description: formData.description || undefined,
        isPublic: formData.isPublic,
        tags: formData.tags
          ? formData.tags.split(',').map(tag => tag.trim())
          : undefined
      }).unwrap();

      setFormData({ name: '', description: '', isPublic: false, tags: '' });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tạo Bộ Sưu Tập Mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên bộ sưu tập *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Các món ăn Hà Nội"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả bộ sưu tập..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="VD: hà nội, truyền thống, phổ biến"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="isPublic" className="text-sm font-semibold text-gray-700">
              Công khai bộ sưu tập này
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              type="submit"
            >
              Tạo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal;
