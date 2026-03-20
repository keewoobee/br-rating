import React, { useState, useEffect } from 'react';
import { MenuItem } from '../data';
import { StarRating } from './StarRating';
import { Trash2 } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  rating: number;
  comment: string;
  onRatingChange: (id: number, rating: number) => void;
  onCommentChange: (id: number, comment: string) => void;
  onReset: (id: number) => void;
  mode?: 'detailed' | 'mini';
  onClick?: () => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, rating, comment, onRatingChange, onCommentChange, onReset, mode = 'detailed', onClick }) => {
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [localComment, setLocalComment] = useState(comment);

  useEffect(() => {
    setLocalComment(comment || '');
  }, [comment]);

  const handleCommentSubmit = async () => {
    await onCommentChange(item.id, localComment);
    setIsEditingComment(false);
  };

  const handleResetRating = () => {
    console.log("handleResetRating called for item:", item.id);
    onReset(item.id);
    setIsEditingComment(true);
    setLocalComment('');
  };

  const isFomTag = (tag: string) => tag === '이달의맛' || /^\d+년$/.test(tag) || /^\d+월$/.test(tag);
  const originalTags = item.tags?.filter(tag => !isFomTag(tag)) || [];
  const fomTags = item.tags?.filter(tag => isFomTag(tag)) || [];

  if (mode === 'mini') {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-3 flex flex-col items-center h-full transition-all hover:shadow-md hover:border-br-pink-light group cursor-pointer"
        onClick={onClick}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center relative transition-colors shrink-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 text-[9px] font-medium">No Image</div>
          )}
        </div>
        <h3 className="text-[11px] sm:text-xs font-bold text-br-blue text-center line-clamp-2 leading-tight mb-2 flex-grow flex items-center break-keep w-full justify-center px-0.5">
          {item.name.includes("(Lessly Edition)") ? (
            <>
              (Lessly Edition)
              <br />
              {item.name.replace("(Lessly Edition)", "").trim()}
            </>
          ) : (
            item.name
          )}
        </h3>
        <div 
          className="shrink-0 w-full flex flex-col items-center gap-1 overflow-hidden pointer-events-none"
        >
          <StarRating rating={rating} onChange={() => {}} size="sm" readonly={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-br-pink-light p-5 flex flex-col h-full transition-all duration-300 hover:shadow-xl group">
      <div className="w-full h-48 mb-5 flex items-center justify-center relative transition-colors">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 text-sm font-medium">No Image</div>
        )}
      </div>
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xl font-black text-br-blue leading-tight tracking-tight">
          {item.name.includes("(Lessly Edition)") ? (
            <>
              (Lessly Edition)
              <br />
              {item.name.replace("(Lessly Edition)", "").trim()}
            </>
          ) : (
            item.name
          )}
        </h3>
      </div>

      {item.englishName && (
        <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">{item.englishName}</p>
      )}

      <div className="flex flex-col gap-1.5 mb-4">
        {originalTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {originalTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-br-pink-light text-br-pink">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {fomTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {fomTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-br-blue/10 text-br-blue">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {item.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed break-keep">{item.description}</p>
      )}

      <div className="flex-grow"></div>

      <div className="flex items-center justify-center mt-auto pt-4 border-t-2 border-gray-50 relative">
        <StarRating rating={rating} onChange={(newRating) => {
          onRatingChange(item.id, newRating);
          if (rating === 0 && newRating > 0 && !comment) {
            setIsEditingComment(true);
          }
        }} size="md" />
        {rating > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetRating();
            }}
            className="absolute right-0 px-3 py-1 bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 text-xs font-bold rounded-full shadow-sm transition-colors z-10"
            title="평가 취소"
          >
            취소
          </button>
        )}
      </div>

      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
        {rating === 0 ? (
          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100 items-center justify-center text-center">
            <p className="text-sm text-gray-500 font-medium break-keep leading-relaxed">
              별점을 남기면<br />코멘트를 작성할 수 있어요!
            </p>
          </div>
        ) : isEditingComment ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={localComment}
              onChange={(e) => setLocalComment(e.target.value)}
              placeholder="코멘트를 남겨보세요..."
              className="w-full text-[16px] sm:text-sm p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-br-pink focus:bg-white focus:ring-1 focus:ring-br-pink resize-none transition-all placeholder:text-gray-400"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setLocalComment(comment || '');
                  setIsEditingComment(false);
                }}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:text-gray-700 text-xs font-bold rounded-full shadow-sm transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCommentSubmit}
                className="px-3 py-1 bg-br-pink text-white text-xs font-bold rounded-full shadow-sm hover:bg-br-pink/90 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-700 italic flex-1 truncate">{comment ? `"${comment}"` : <span className="text-gray-400 not-italic">코멘트가 없습니다</span>}</p>
            <div className="flex gap-2 shrink-0">
              {comment && (
                <button
                  onClick={() => {
                    onCommentChange(item.id, '');
                    setIsEditingComment(false);
                  }}
                  className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200 text-xs font-bold rounded-full shadow-sm transition-colors"
                >
                  삭제
                </button>
              )}
              <button
                onClick={() => setIsEditingComment(true)}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:text-br-pink hover:border-br-pink-light text-xs font-bold rounded-full shadow-sm transition-colors"
              >
                수정
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
