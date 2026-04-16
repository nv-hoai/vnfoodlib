import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import type { CollectionCardProps } from '@/types';
import Button from '../../../shared/components/Button';

const CollectionCard: FC<CollectionCardProps> = ({ collection, onSelect }) => {
  const dishCount = collection.dishes?.length || 0;

  return (
    <div
      onClick={() => onSelect?.(collection)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden hover:scale-105 transform duration-200"
    >
      {/* Collection Header */}
      <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-32 flex items-center justify-center">
        <div className="text-5xl font-bold text-white">C</div>
      </div>

      {/* Collection Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {collection.name}
        </h3>

        {collection.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {collection.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <span>{dishCount} món ăn</span>
          {collection.isPublic && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
              Công khai
            </span>
          )}
        </div>

        {/* Tags */}
        {collection.tags && collection.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-3">
            {collection.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {collection.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{collection.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <Link
          to={`/collections/${collection._id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
};

export default CollectionCard;
