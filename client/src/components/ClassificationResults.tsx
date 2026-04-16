import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/components/Button';

interface Prediction {
  rank?: number;
  class_id: number;
  class_slug: string;
  class_name: string;
  confidence: number;
  score: number;
}

interface ClassificationResultCardProps {
  prediction: Prediction;
  isBest?: boolean;
  onViewFood?: () => void;
}

interface ClassificationResultsProps {
  topPrediction: Prediction;
  top5: Prediction[];
  onViewFood?: (className: string) => void;
}

export const ClassificationResultCard: FC<ClassificationResultCardProps> = ({
  prediction,
  isBest = false,
  onViewFood,
}) => {
  const confidencePercent = (prediction.confidence * 100).toFixed(1);
  const confidenceColor = prediction.confidence > 0.7 ? 'green' : prediction.confidence > 0.5 ? 'yellow' : 'red';

  return (
    <div
      className={`rounded-lg border p-4 transition ${
        isBest
          ? 'border-2 border-blue-500 bg-blue-50 shadow-lg'
          : 'border border-gray-200 bg-white'
      }`}
    >
      {isBest && (
        <div className="mb-3 inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          🥇 Kết quả cao nhất
        </div>
      )}

      <h3 className={`text-lg font-bold mb-2 ${isBest ? 'text-blue-700' : 'text-gray-800'}`}>
        {prediction.class_name}
      </h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Độ chính xác</span>
          <span
            className={`font-bold text-${confidenceColor}-600`}
          >
            {confidencePercent}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full bg-${confidenceColor}-500 transition-all`}
            style={{ width: `${prediction.confidence * 100}%` }}
          />
        </div>
      </div>

      {prediction.rank && (
        <p className="text-sm text-gray-600 mb-3">
          Xếp hạng: <span className="font-semibold">#{prediction.rank}</span>
        </p>
      )}

      {onViewFood && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onViewFood}
          className="w-full"
        >
          Xem Chi Tiết
        </Button>
      )}
    </div>
  );
};

export const ClassificationResults: FC<ClassificationResultsProps> = ({
  topPrediction,
  top5,
  onViewFood,
}) => {
  const navigate = useNavigate();

  const handleViewFood = (className: string) => {
    if (onViewFood) {
      onViewFood(className);
    }
    // Could also navigate to food library with filter
    navigate(`/foods?search=${encodeURIComponent(className)}`);
  };

  return (
    <div className="w-full">
      {/* Top Result */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Kết Quả Phân Loại</h2>
        <ClassificationResultCard
          prediction={topPrediction}
          isBest
          onViewFood={() => handleViewFood(topPrediction.class_name)}
        />
      </div>

      {/* Top 5 Results */}
      {top5 && top5.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Top 5 Dự Đoán</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {top5.map((pred, index) => (
              <ClassificationResultCard
                key={index}
                prediction={{
                  ...pred,
                  rank: index + 1,
                }}
                onViewFood={() => handleViewFood(pred.class_name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Độ chính xác &gt; 70% thường cho kết quả tốt. Nếu độ chính xác thấp,
          hãy thử với ảnh chất lượng cao hơn.
        </p>
      </div>
    </div>
  );
};
