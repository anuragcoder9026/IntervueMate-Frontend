import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const FullscreenImageModal = ({ galleryData, setGalleryData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (galleryData) {
            setCurrentIndex(galleryData.index || 0);
        }
    }, [galleryData]);

    const handleClose = useCallback(() => {
        setGalleryData(null);
    }, [setGalleryData]);

    const handleNext = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!galleryData) return;
        setCurrentIndex((prev) => (prev + 1) % galleryData.images.length);
    }, [galleryData]);

    const handlePrev = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!galleryData) return;
        setCurrentIndex((prev) => (prev - 1 + galleryData.images.length) % galleryData.images.length);
    }, [galleryData]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!galleryData) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') handleClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [galleryData, handleNext, handlePrev, handleClose]);

    if (!galleryData) return null;

    const currentImage = galleryData.images[currentIndex];
    const showNav = galleryData.images.length > 1;

    return (
        <div
            className="fixed inset-0 z-[5000] bg-black/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md cursor-zoom-out select-none"
            onClick={handleClose}
        >
            <button
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/50 hover:text-white bg-black/40 hover:bg-black/60 p-2.5 rounded-full transition-all cursor-pointer z-[5001] border border-white/5"
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
            >
                <X size={24} />
            </button>

            {showNav && (
                <>
                    <button
                        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all cursor-pointer z-[5001] border border-white/5"
                        onClick={handlePrev}
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all cursor-pointer z-[5001] border border-white/5"
                        onClick={handleNext}
                    >
                        <ChevronRight size={32} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 px-4 py-1.5 rounded-full text-white/80 text-sm font-medium border border-white/5 backdrop-blur-sm">
                        {currentIndex + 1} / {galleryData.images.length}
                    </div>
                </>
            )}

            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                <img
                    src={currentImage.url}
                    alt={`Fullscreen ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

export default FullscreenImageModal;
