import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PostImageCarousel = ({ allImages, currentImageIndex, prevImage, nextImage }) => {
    if (allImages.length === 0) return null;

    return (
        <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-border-primary aspect-video bg-bg-tertiary relative group/image shadow-inner">
            <img
                src={allImages[currentImageIndex]}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                alt="Post Content"
            />

            {/* Carousel Controls */}
            {allImages.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all backdrop-blur-md opacity-0 group-hover/image:opacity-100 border border-white/10"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all backdrop-blur-md opacity-0 group-hover/image:opacity-100 border border-white/10"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Counter Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 shadow-lg">
                        {currentImageIndex + 1} / {allImages.length}
                    </div>
                </>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    );
};

export default PostImageCarousel;
