import React, { FC, useState } from 'react';
import { useGetUserCollectionsQuery } from '../features/collections/api/collectionsApi';
import CollectionCard from '../features/collections/components/CollectionCard';
import CreateCollectionModal from '../features/collections/components/CreateCollectionModal';
import Button from '../shared/components/Button';

const CollectionsPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: collections = [], isLoading, refetch } = useGetUserCollectionsQuery();

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Bộ Sưu Tập Của Tôi
          </h1>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Tạo bộ sưu tập
          </Button>
        </div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(collection => (
              <CollectionCard key={collection._id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              Bạn chưa có bộ sưu tập nào. Hãy tạo bộ sưu tập đầu tiên!
            </p>
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Tạo bộ sưu tập ngay
            </Button>
          </div>
        )}

        {/* Modal */}
        <CreateCollectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => refetch()}
        />
      </div>
    </div>
  );
};

export default CollectionsPage;
