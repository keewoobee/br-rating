import React, { useState, useRef } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showNumber?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onChange, size = 'md', readonly = false, showNumber = true }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateRating = (clientX: number) => {
    if (!containerRef.current) return null;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = clientX - left;
    
    // Prevent out of bounds
    if (x < 0) return 0.5;
    if (x > width) return 5;

    const starWidth = width / 5;
    const starIndex = Math.floor(x / starWidth);
    const starX = x - starIndex * starWidth;
    
    let newHover = starIndex + (starX < starWidth / 2 ? 0.5 : 1);
    if (newHover < 0.5) newHover = 0.5;
    if (newHover > 5) newHover = 5;
    
    return newHover;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly) return;
    setHoverRating(calculateRating(e.clientX));
  };

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (readonly) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    // Also update hover rating on start
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (readonly) return;
    const touch = e.touches[0];
    if (!touch || !touchStartRef.current) return;

    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If vertical movement is greater than horizontal, it's likely a scroll
    if (deltaY > deltaX) {
      setHoverRating(null);
      return;
    }

    setHoverRating(calculateRating(touch.clientX));
  };

  const handleTouchEnd = () => {
    if (readonly) return;
    touchStartRef.current = null;
    handleClick();
    setHoverRating(null);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(null);
  };

  const handleClick = () => {
    if (readonly) return;
    if (hoverRating !== null) {
      onChange(hoverRating);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const starClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-8 h-8 sm:w-6 sm:h-6';
  const textClass = size === 'sm' ? 'text-[9px] w-3' : size === 'lg' ? 'text-xs w-5' : 'text-base sm:text-sm w-8 sm:w-6';

  return (
    <div className={`flex items-center ${readonly ? '' : 'group'}`}>
      <div 
        className={`flex items-center ${readonly ? '' : 'cursor-pointer'}`}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = displayRating >= star;
          const isHalf = displayRating >= star - 0.5 && displayRating < star;

          return (
            <div key={star} className={`relative ${starClass} text-gray-200 transition-transform ${readonly ? '' : 'group-hover:scale-105'}`}>
              {/* Empty Star */}
              <Star className={`absolute top-0 left-0 ${starClass}`} strokeWidth={1.5} />
              
              {/* Filled Star */}
              {(isFull || isHalf) && (
                <div 
                  className="absolute top-0 left-0 overflow-hidden text-br-pink"
                  style={{ width: isHalf ? '50%' : '100%' }}
                >
                  <Star className={`${starClass} fill-current`} strokeWidth={1.5} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className={`${size === 'sm' ? 'ml-0.5 sm:ml-1' : 'ml-1.5'} font-bold text-gray-400 text-center ${textClass}`}>
          {displayRating > 0 ? displayRating.toFixed(1) : '-'}
        </span>
      )}
    </div>
  );
}
