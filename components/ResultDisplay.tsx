
import React, { useState } from 'react';
import { DownloadIcon, PreviewIcon, CloseIcon } from './icons';

interface ResultDisplayProps {
  images: string[];
  isLoading: boolean;
  error: string | null;
}

const ImagePreviewModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                aria-label="Close preview"
            >
                <CloseIcon className="w-8 h-8" />
            </button>
            <div className="relative max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <img 
                    src={`data:image/png;base64,${imageUrl}`} 
                    alt="Generated preview"
                    className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg" 
                />
            </div>
        </div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ images, isLoading, error }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleDownload = (base64Image: string, index: number) => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64Image}`;
        link.download = `quy-animation-${Date.now()}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="aspect-video bg-gray-700/50 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h3>
                    <p>{error}</p>
                </div>
            );
        }

        if (images.length > 0) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="group relative aspect-video rounded-lg overflow-hidden bg-gray-700">
                            <img src={`data:image/png;base64,${img}`} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setPreviewImage(img)}
                                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
                                    title="Xem trước"
                                >
                                    <PreviewIcon className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => handleDownload(img, index)}
                                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
                                    title="Tải xuống"
                                >
                                    <DownloadIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <h3 className="text-2xl font-bold">Kết quả của bạn sẽ xuất hiện ở đây</h3>
                <p className="mt-2 max-w-md">Chuẩn bị ảnh tham chiếu và câu lệnh của bạn, sau đó nhấn "Tạo ảnh" để bắt đầu quá trình sáng tạo.</p>
            </div>
        );
    };
    
    return (
        <div className="lg:col-span-2 bg-gray-800/50 rounded-xl p-6 min-h-[500px] lg:min-h-0 flex flex-col justify-center">
            {renderContent()}
            {previewImage && (
                <ImagePreviewModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
            )}
        </div>
    );
};

export default ResultDisplay;
