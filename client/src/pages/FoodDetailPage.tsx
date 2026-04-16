import React, { FC, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetFoodByIdQuery,
  useLikeFoodMutation,
  useUnlikeFoodMutation,
  useRecommendFoodMutation,
  useAddToCollectionMutation
} from '../features/foods/api/foodApi';
import type { RootState, TabType } from '../types';

const FoodDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<TabType>('intro');
  const [isLiked, setIsLiked] = useState(false);

  const { data, isLoading, error } = useGetFoodByIdQuery(id || '', {
    skip: !id
  });

  const [likeFood] = useLikeFoodMutation();
  const [unlikeFood] = useUnlikeFoodMutation();
  const [recommendFood] = useRecommendFoodMutation();
  const [addToCollection] = useAddToCollectionMutation();

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Món ăn không tìm thấy</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error || !data?.data?.food) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Lỗi: Không thể tải thông tin món ăn</p>
        <button
          onClick={() => navigate('/foods')}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const food = data.data.food;
  const imageUrl = food.image.startsWith('http')
    ? food.image
    : `http://localhost:5000${food.image}`;

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await unlikeFood(food._id).unwrap();
        setIsLiked(false);
      } else {
        await likeFood(food._id).unwrap();
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Like action failed:', error);
    }
  };

  const handleRecommend = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await recommendFood(food._id).unwrap();
      alert('Đề cử thành công!');
    } catch (error: any) {
      alert(error?.data?.message || 'Đề cử thất bại');
    }
  };

  const handleAddToCollection = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Todo: Show modal to select collection
    console.log('Add to collection:', food._id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/foods')}
        className="text-orange-600 hover:text-orange-700 font-semibold mb-4"
      >
        Quay lại
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with image and basic info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Image */}
          <div className="md:col-span-1">
            <img
              src={imageUrl}
              alt={food.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{food.name}</h1>

            {/* Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap justify-between">
                {food.tags.category?.map((tag: string) => (
                  <span key={tag} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{food.likeCount}</p>
                <p className="text-gray-600 text-sm">Thích</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{food.recommendationCount}</p>
                <p className="text-gray-600 text-sm">Đề cử tuần này</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{food.recommendationAllTime}</p>
                <p className="text-gray-600 text-sm">Đề cử toàn thời</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleLike}
                className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                  isLiked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isLiked ? 'Đã thích' : 'Thích'}
              </button>
              <button
                onClick={handleRecommend}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Đề cử
              </button>
              <button
                onClick={handleAddToCollection}
                className="py-2 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Thêm vào bộ sưu tập
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  navigate(`/contributions/edit-food/${food._id}`);
                }}
                className="py-2 px-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
              >
                Đóng góp
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('intro')}
              className={`flex-1 py-4 px-6 font-semibold text-center border-b-2 transition-colors ${
                activeTab === 'intro'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-4 px-6 font-semibold text-center border-b-2 transition-colors ${
                activeTab === 'ingredients'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Nguyên liệu
            </button>
            <button
              onClick={() => setActiveTab('cooking')}
              className={`flex-1 py-4 px-6 font-semibold text-center border-b-2 transition-colors ${
                activeTab === 'cooking'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Cách nấu
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'intro' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
                <p className="text-gray-700 leading-7 whitespace-pre-wrap">{food.intro}</p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nguyên liệu</h2>
                <div className="space-y-2">
                  {food.ingredients.split('\n').map((ingredient: string, index: number) => (
                    <p key={index} className="text-gray-700">{ingredient}</p>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cooking' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cách nấu</h2>
                <div className="space-y-3">
                  {food.cooking.split('\n').map((step: string, index: number) => (
                    <p key={index} className="text-gray-700 leading-6">{step}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Tags Info */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Thông tin thêm</h3>
          <div className="grid grid-cols-2 gap-4">
            {food.tags.ingredient && food.tags.ingredient.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-2">Các thành phần chính:</p>
                <div className="flex flex-wrap gap-2">
                  {food.tags.ingredient.map((tag: string) => (
                    <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {food.tags.cooking_method && food.tags.cooking_method.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-2">Phương pháp nấu:</p>
                <div className="flex flex-wrap gap-2">
                  {food.tags.cooking_method.map((tag: string) => (
                    <span key={tag} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
