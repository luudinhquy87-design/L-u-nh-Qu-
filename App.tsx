
import React, { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';
import { CharacterSlot, BackgroundSlot } from './types';
import { generateFourImages } from './services/geminiService';

const App: React.FC = () => {
  const [characterSlots, setCharacterSlots] = useState<CharacterSlot[]>(
    Array.from({ length: 5 }, (_, i) => ({ id: i, file: null, selected: false }))
  );
  const [backgroundSlot, setBackgroundSlot] = useState<BackgroundSlot>({ file: null, use: false });
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCharacterSlotChange = (id: number, file: File | null) => {
    setCharacterSlots(prev =>
      prev.map(slot =>
        slot.id === id ? { ...slot, file, selected: file ? slot.selected : false } : slot
      )
    );
  };
  
  const handleCharacterSelectChange = (id: number, selected: boolean) => {
    setCharacterSlots(prev =>
      prev.map(slot => (slot.id === id ? { ...slot, selected } : slot))
    );
  };

  const handleBackgroundSlotChange = (file: File | null) => {
    setBackgroundSlot(prev => ({...prev, file, use: file ? prev.use : false }));
  };
  
  const handleUseBackgroundChange = (use: boolean) => {
    setBackgroundSlot(prev => ({ ...prev, use }));
  };

  const handleGenerate = useCallback(async () => {
    setError(null);
    setGeneratedImages([]);
    setIsLoading(true);

    const selectedCharacterFiles = characterSlots
      .filter(slot => slot.selected && slot.file)
      .map(slot => slot.file as File);

    if (selectedCharacterFiles.length === 0) {
      setError("Vui lòng chọn ít nhất một ảnh nhân vật tham chiếu.");
      setIsLoading(false);
      return;
    }

    if (!prompt.trim()) {
        setError("Vui lòng nhập câu lệnh mô tả.");
        setIsLoading(false);
        return;
    }

    try {
      const images = await generateFourImages(
        prompt,
        selectedCharacterFiles,
        backgroundSlot.file,
        backgroundSlot.use
      );
      setGeneratedImages(images);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, characterSlots, backgroundSlot]);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Quy Animation
          </h1>
          <p className="mt-2 text-lg text-gray-300">Tạo ảnh nhân vật hoạt hình đồng nhất với AI</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <ControlPanel
            characterSlots={characterSlots}
            backgroundSlot={backgroundSlot}
            prompt={prompt}
            isLoading={isLoading}
            onCharacterSlotChange={handleCharacterSlotChange}
            onCharacterSelectChange={handleCharacterSelectChange}
            onBackgroundSlotChange={handleBackgroundSlotChange}
            onUseBackgroundChange={handleUseBackgroundChange}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
          />
          <ResultDisplay images={generatedImages} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default App;
