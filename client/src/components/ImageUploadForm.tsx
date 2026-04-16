import React, { FC, useState, useRef } from 'react';
import { useClassifyImageMutation } from '../features/foods/api/foodClassificationApi';
import Button from '../shared/components/Button';

interface ImageUploadFormProps {
  onClassificationSuccess?: (data: any) => void;
}

const ImageUploadForm: FC<ImageUploadFormProps> = ({ onClassificationSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [classifyImage, { isLoading, error: classifyError }] = useClassifyImageMutation();

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Vui lòng chọn tệp ảnh hợp lệ');
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Vui lòng chọn một ảnh');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = await classifyImage(formData).unwrap();
      onClassificationSuccess?.(result);

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Classification error:', err);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {preview ? (
          <div className="flex flex-col items-center">
            <img src={preview} alt="Preview" className="max-h-48 rounded mb-4" />
            <p className="text-sm text-gray-600 mb-2">{selectedFile?.name}</p>
            <p className="text-xs text-gray-500">Nhấp để thay đổi ảnh</p>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-3"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-12l-3.172-3.172a4 4 0 00-5.656 0L28 12M28 12l-4-4a4 4 0 00-5.656 0l-10.172 10.172"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-1">
              Kéo thả ảnh hoặc nhấp để chọn
            </p>
            <p className="text-sm text-gray-600">PNG, JPG, GIF tối đa 10MB</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {classifyError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <p className="font-medium">Lỗi phân loại ảnh</p>
          <p className="text-sm mt-1">
            {typeof classifyError === 'string'
              ? classifyError
              : 'Vui lòng thử lại'}
          </p>
        </div>
      )}

      {/* Buttons */}
      {selectedFile && (
        <div className="flex gap-3 mt-6">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Đang phân loại...' : 'Phân Loại Ảnh'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isLoading}
          >
            Xóa
          </Button>
        </div>
      )}
    </form>
  );
};

export default ImageUploadForm;
