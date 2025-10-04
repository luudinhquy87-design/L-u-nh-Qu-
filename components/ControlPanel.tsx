
import React from 'react';
import { CharacterSlot, BackgroundSlot } from '../types';
import ImageUploader from './ImageUploader';

interface ControlPanelProps {
  characterSlots: CharacterSlot[];
  backgroundSlot: BackgroundSlot;
  prompt: string;
  isLoading: boolean;
  onCharacterSlotChange: (id: number, file: File | null) => void;
  onCharacterSelectChange: (id: number, selected: boolean) => void;
  onBackgroundSlotChange: (file: File | null) => void;
  onUseBackgroundChange: (use: boolean) => void;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  characterSlots,
  backgroundSlot,
  prompt,
  isLoading,
  onCharacterSlotChange,
  onCharacterSelectChange,
  onBackgroundSlotChange,
  onUseBackgroundChange,
  onPromptChange,
  onGenerate,
}) => {
  const isGenerateDisabled = isLoading || !prompt.trim() || !characterSlots.some(c => c.selected && c.file);

  return (
    <div className="lg:col-span-1 bg-gray-800 rounded-xl p-6 flex flex-col gap-6 h-fit shadow-lg">
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-100">Ảnh nhân vật tham chiếu</h2>
        <div className="space-y-4">
          {characterSlots.map((slot, index) => (
            <ImageUploader
              key={slot.id}
              id={`character-${slot.id}`}
              label={`Nhân vật ${index + 1}`}
              file={slot.file}
              onFileChange={(file) => onCharacterSlotChange(slot.id, file)}
              showCheckbox={true}
              isChecked={slot.selected}
              onCheckboxChange={(checked) => onCharacterSelectChange(slot.id, checked)}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-100">Bối cảnh tham chiếu</h2>
        <div className="space-y-4">
            <ImageUploader
              id="background"
              label="+ Tải ảnh nền"
              file={backgroundSlot.file}
              onFileChange={onBackgroundSlotChange}
            />
             <div className="flex items-center">
                <input
                    id="use-background-checkbox"
                    type="checkbox"
                    checked={backgroundSlot.use}
                    onChange={(e) => onUseBackgroundChange(e.target.checked)}
                    disabled={!backgroundSlot.file}
                    className="w-5 h-5 bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600 rounded disabled:opacity-50"
                />
                <label htmlFor="use-background-checkbox" className="ml-3 text-sm font-medium text-gray-300 disabled:text-gray-500">
                    Sử dụng bối cảnh này
                </label>
            </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-100">Câu lệnh</h2>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Mô tả hành động, bối cảnh, hoặc bố cục bạn muốn..."
          rows={5}
          className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-200 placeholder-gray-400"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerateDisabled}
        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 flex items-center justify-center"
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isLoading ? 'Đang tạo...' : 'Tạo ảnh'}
      </button>
    </div>
  );
};

export default ControlPanel;
