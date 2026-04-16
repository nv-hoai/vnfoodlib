import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FoodCardProps } from '@/types';

export const FoodCard: FC<FoodCardProps> = ({ food }) => {
  const navigate = useNavigate();

  const imageUrl = food.image.startsWith('http')
    ? food.image
    : `http://localhost:5000${food.image}`;

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => navigate(`/foods/${food._id}`)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={food.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {food.tags.category?.[0] || 'Món ăn'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate hover:text-orange-600">
          {food.name}
        </h3>

        {/* Intro */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.intro}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {food.tags.taste?.slice(0, 2).map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Thích: {food.likeCount}</span>
          <span>Đề cử: {food.recommendationCount}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
