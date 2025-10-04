
import React, { useRef, useState, useEffect } from 'react';
import { UploadIcon, TrashIcon } from './icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  id, 
  label, 
  file, 
  onFileChange, 
  showCheckbox = false, 
  isChecked = false, 
  onCheckboxChange 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    onFileChange(selectedFile || null);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inputRef.current) {
        inputRef.current.value = "";
    }
    onFileChange(null);
  };

  return (
    <div className="flex items-center gap-4">
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheckboxChange?.(e.target.checked)}
          disabled={!file}
          className="w-5 h-5 bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600 rounded disabled:opacity-50"
        />
      )}
      <div className="relative w-full">
        <label
          htmlFor={id}
          className="relative flex items-center justify-center w-full h-24 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors cursor-pointer"
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt={label} className="w-full h-full object-contain p-1 rounded-lg" />
              <button
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-500 text-white rounded-full p-1 transition-all"
                aria-label="Remove image"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <UploadIcon className="w-8 h-8 mb-1" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          )}
        </label>
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
