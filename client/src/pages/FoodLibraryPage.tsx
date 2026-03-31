import React, { FC, useState, useMemo } from 'react';
import { useGetAllFoodsQuery, useSearchFoodsQuery, useFilterFoodsQuery } from '../features/foods/api/foodApi';
import FoodCard from '../features/foods/components/FoodCard';

type FilterType = {
  categories?: string[];
  ingredients?: string[];
  mealTimes?: string[];
  cookingMethods?: string[];
  tastes?: string[];
  purposes?: string[];
  diets?: string[];
};

const FoodLibraryPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [openFilterCategory, setOpenFilterCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterType>({});
  const limit = 12;

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Queries
  const allFoodsQuery = useGetAllFoodsQuery({ page, limit }, { skip: !!debouncedQuery || hasFilters(filters) });
  const searchQuery_result = useSearchFoodsQuery(
    { q: debouncedQuery, page, limit },
    { skip: !debouncedQuery }
  );
  const filteredQuery = useFilterFoodsQuery(
    { ...filters, page, limit },
    { skip: !hasFilters(filters) }
  );

  // Determine which data to show
  const isSearching = !!debouncedQuery;
  const isFiltering = hasFilters(filters);
  const data = isSearching ? searchQuery_result.data : isFiltering ? filteredQuery.data : allFoodsQuery.data;
  const isLoading = isSearching ? searchQuery_result.isLoading : isFiltering ? filteredQuery.isLoading : allFoodsQuery.isLoading;
  const error = isSearching ? searchQuery_result.error : isFiltering ? filteredQuery.error : allFoodsQuery.error;

  const foods = data?.data?.foods || [];
  const pagination = data?.data?.pagination;

  function hasFilters(filters: FilterType): boolean {
    return Object.values(filters).some(arr => arr && arr.length > 0);
  }

  const handleFilterChange = (filterType: keyof FilterType, value: string) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    setFilters({
      ...filters,
      [filterType]: newValues.length > 0 ? newValues : undefined
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setDebouncedQuery('');
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Thư viện món ăn</h1>
        <p className="text-gray-600">Khám phá và thích các món ăn từ khắp nơi</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Filter Toggle */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
        </button>
        {(searchQuery || hasFilters(filters)) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {/* Filter Categories - Horizontal */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setOpenFilterCategory(openFilterCategory === 'categories' ? null : 'categories')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                openFilterCategory === 'categories'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Loại món ăn {filters.categories?.length ? `(${filters.categories.length})` : ''}
            </button>
            <button
              onClick={() => setOpenFilterCategory(openFilterCategory === 'cookingMethods' ? null : 'cookingMethods')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                openFilterCategory === 'cookingMethods'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Cách nấu {filters.cookingMethods?.length ? `(${filters.cookingMethods.length})` : ''}
            </button>
            <button
              onClick={() => setOpenFilterCategory(openFilterCategory === 'tastes' ? null : 'tastes')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                openFilterCategory === 'tastes'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Vị {filters.tastes?.length ? `(${filters.tastes.length})` : ''}
            </button>
            <button
              onClick={() => setOpenFilterCategory(openFilterCategory === 'mealTimes' ? null : 'mealTimes')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                openFilterCategory === 'mealTimes'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Thời điểm ăn {filters.mealTimes?.length ? `(${filters.mealTimes.length})` : ''}
            </button>
            <button
              onClick={() => setOpenFilterCategory(openFilterCategory === 'purposes' ? null : 'purposes')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                openFilterCategory === 'purposes'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Mục đích {filters.purposes?.length ? `(${filters.purposes.length})` : ''}
            </button>
            <button
              onClick={() => setOpenFilterCategory(openFilterCategory === 'diets' ? null : 'diets')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                openFilterCategory === 'diets'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Chế độ ăn {filters.diets?.length ? `(${filters.diets.length})` : ''}
            </button>
          </div>

          {/* Filter Options - Show based on selected category */}
          {openFilterCategory && (
            <div className="border-t pt-6">
              {openFilterCategory === 'categories' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Loại món ăn</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {['món nước', 'món kho', 'món chiên', 'món xào', 'món nướng', 'món hấp', 'món luộc', 'món trộn', 'món cuốn', 'món cơm', 'món bánh', 'món ăn vặt', 'món tráng miệng', 'món chè', 'món lẩu', 'món cháo', 'món súp', 'đồ uống'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories?.includes(cat) || false}
                          onChange={() => handleFilterChange('categories', cat)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {openFilterCategory === 'cookingMethods' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Cách nấu</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {['nước dùng', 'kho', 'chiên giòn', 'chiên ngập dầu', 'áp chảo', 'xào', 'nướng than', 'nướng lò', 'hấp', 'luộc', 'trộn', 'ướp', 'rim', 'sốt', 'lên men'].map((method) => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.cookingMethods?.includes(method) || false}
                          onChange={() => handleFilterChange('cookingMethods', method)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {openFilterCategory === 'tastes' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Vị</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {['cay', 'không cay', 'ngọt', 'mặn', 'chua', 'đắng', 'béo', 'thanh đạm', 'đậm vị'].map((taste) => (
                      <label key={taste} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.tastes?.includes(taste) || false}
                          onChange={() => handleFilterChange('tastes', taste)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">{taste}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {openFilterCategory === 'mealTimes' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Thời điểm ăn</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {['ăn sáng', 'ăn trưa', 'ăn tối', 'ăn đêm', 'ăn vặt'].map((time) => (
                      <label key={time} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.mealTimes?.includes(time) || false}
                          onChange={() => handleFilterChange('mealTimes', time)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {openFilterCategory === 'purposes' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Mục đích</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {['ăn vặt', 'ăn chính', 'nhậu', 'tiệc', 'gia đình', 'đường phố', 'nhà hàng', 'take away'].map((purpose) => (
                      <label key={purpose} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.purposes?.includes(purpose) || false}
                          onChange={() => handleFilterChange('purposes', purpose)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">{purpose}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {openFilterCategory === 'diets' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Chế độ ăn</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {['chay', 'thuần chay', 'healthy', 'ăn kiêng', 'ít calo', 'ít đường', 'ít béo', 'high protein'].map((diet) => (
                      <label key={diet} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.diets?.includes(diet) || false}
                          onChange={() => handleFilterChange('diets', diet)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Info */}
      {pagination && (
        <div className="mb-6 text-gray-600">
          <p>
            Tìm thấy {pagination.total} món ăn
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">Lỗi: Không thể tải món ăn</p>
        </div>
      )}

      {/* Food Grid */}
      {!isLoading && foods.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && foods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Không tìm thấy món ăn nào phù hợp</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Xóa lọc
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages ? (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang trước
          </button>

          {Array.from({ length: Math.min(5, pagination.pages as number) }).map((_, index) => {
            const pageNum = Math.max(1, page - 2) + index;
            if (pageNum > (pagination.pages as number)) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pageNum === page
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage(Math.min(pagination.pages as number, page + 1))}
            disabled={page === (pagination.pages as number)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang sau
          </button>
        </div>
      ) : foods.length >= limit ? (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang trước
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Trang sau
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FoodLibraryPage;
