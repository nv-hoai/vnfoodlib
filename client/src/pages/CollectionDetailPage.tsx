import React, { FC, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetCollectionByIdQuery,
  useRemoveDishFromCollectionMutation,
  useDeleteCollectionMutation,
  useUpdateCollectionMutation
} from '../features/collections/api/collectionsApi';
import { useGetFoodByIdQuery } from '../features/foods/api/foodApi';
import Button from '../shared/components/Button';

const CollectionDetailPage: FC = () => {
  const { id: collectionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: collection, isLoading, refetch } = useGetCollectionByIdQuery(collectionId || '');
  const [removeDish] = useRemoveDishFromCollectionMutation();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [updateCollection] = useUpdateCollectionMutation();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    isPublic: collection?.isPublic || false
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!collectionId) {
    return <div className="p-6">Không tìm thấy collection</div>;
  }

  const handleRemoveDish = async (dishId: string) => {
    try {
      await removeDish({
        collectionId,
        dishId
      }).unwrap();
      setSuccessMessage('Đã xóa món ăn khỏi bộ sưu tập');
      refetch();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Xóa thất bại';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDeleteCollection = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này?')) {
      try {
        await deleteCollection(collectionId).unwrap();
        navigate('/collections');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Xóa thất bại';
        setErrorMessage(message);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateCollection({
        id: collectionId,
        payload: {
          name: editData.name,
          description: editData.description,
          isPublic: editData.isPublic
        }
      }).unwrap();
      setSuccessMessage('Cập nhật bộ sưu tập thành công');
      setIsEditMode(false);
      refetch();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cập nhật thất bại';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  if (isLoading) {
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

  if (!collection) {
    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Không tìm thấy bộ sưu tập</p>
          <Button variant="outline" onClick={() => navigate('/collections')} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {isEditMode ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="border-2 border-blue-500 px-4 py-2 rounded-lg"
                />
              ) : (
                collection.name
              )}
            </h1>
            {collection.tags && collection.tags.length > 0 && (
              <div className="flex gap-2">
                {collection.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <Button
                  variant="primary"
                  onClick={handleSaveEdit}
                >
                  Lưu
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditData({
                      name: collection.name,
                      description: collection.description || '',
                      isPublic: collection.isPublic
                    });
                  }}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditMode(true)}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteCollection}
                >
                  Xóa bộ sưu tập
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Collection Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
              {isEditMode ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Nhập mô tả..."
                  rows={3}
                  className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-700">
                  {collection.description || 'Chưa có mô tả'}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</h3>
              {isEditMode ? (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editData.isPublic}
                    onChange={(e) => setEditData({ ...editData, isPublic: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Công khai</span>
                </label>
              ) : (
                <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                  collection.isPublic
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {collection.isPublic ? 'Công khai' : 'Riêng tư'}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Số lượng món ăn: <strong>{collection.dishes?.length || 0}</strong></p>
            <p>Tạo lúc: <strong>{new Date(collection.createdAt).toLocaleDateString('vi-VN')}</strong></p>
          </div>
        </div>

        {/* Dishes Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Các Món Ăn ({collection.dishes?.length || 0})</h2>
          
          {collection.dishes && collection.dishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collection.dishes.map((dishId) => (
                <DishCard
                  key={dishId}
                  dishId={dishId}
                  collectionId={collectionId}
                  onRemove={handleRemoveDish}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">
                Bộ sưu tập này chưa có món ăn nào.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/foods')}
              >
                Cháy thêm món ăn
              </Button>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/collections')}
          >
            ← Quay lại danh sách
          </Button>
        </div>
      </div>
    </div>
  );
};

// Dish Card Component
interface DishCardProps {
  dishId: string;
  collectionId: string;
  onRemove: (dishId: string) => void;
}

const DishCard: FC<DishCardProps> = ({ dishId, collectionId, onRemove }) => {
  const { data: foodResponse, isLoading } = useGetFoodByIdQuery(dishId);
  const food = foodResponse?.data?.food;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 animate-pulse">
        <div className="h-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!food) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {/* Food Image */}
      {food.image && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover hover:scale-110 transition"
          />
        </div>
      )}

      {/* Food Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
          {food.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {food.intro || 'Không có mô tả'}
        </p>

        {/* Food Details */}
        <div className="text-xs text-gray-500 mb-3 space-y-1">
          {food.ingredients && (
            <p className="line-clamp-1">Nguyên liệu: <strong>{food.ingredients}</strong></p>
          )}
          {food.likeCount && <p>Lượt thích: <strong>{food.likeCount}</strong></p>}
        </div>

        {/* Tags */}
        {food.tags?.category && food.tags.category.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {food.tags.category.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => window.location.href = `/foods/${food._id}`}
          >
            Xem chi tiết
          </Button>
          <Button
            variant="danger"
            className="flex-1 text-xs"
            onClick={() => onRemove(dishId)}
          >
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailPage;
