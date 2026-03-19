import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { MenuItem, getTier, tiers } from '../data';
import { Info, Edit2, Check } from 'lucide-react';
import { StarRating } from './StarRating';
import { InfoPopover } from './InfoPopover';

interface AnalyticsProps {
  ratings: Record<number, number>;
  comments: Record<number, string>;
  menuData: MenuItem[];
  onRatingChange?: (id: number, rating: number) => void;
  onCommentChange?: (id: number, comment: string) => void;
  isReadOnly?: boolean;
}

const CompactMenuRow: React.FC<{
  item: MenuItem;
  rating: number;
  comment: string;
  onRatingChange?: (id: number, rating: number) => void;
  onCommentChange?: (id: number, comment: string) => void;
  isReadOnly?: boolean;
}> = ({ 
  item, 
  rating, 
  comment, 
  onRatingChange, 
  onCommentChange, 
  isReadOnly 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localRating, setLocalRating] = React.useState(rating);
  const [localComment, setLocalComment] = React.useState(comment || '');

  React.useEffect(() => {
    setLocalRating(rating);
    setLocalComment(comment || '');
  }, [rating, comment]);

  const handleSave = async () => {
    if (onRatingChange && localRating !== rating) {
      onRatingChange(item.id, localRating);
    }
    if (onCommentChange && localComment !== comment) {
      await onCommentChange(item.id, localComment);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 bg-white p-2 sm:p-2.5 rounded-xl border border-gray-100 hover:border-br-pink-light transition-colors shadow-sm group">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gray-100"></div>
          )}
        </div>
        <span className="text-xs font-bold text-gray-700 leading-tight break-keep flex-1" title={item.name}>
          {item.name.includes("(Lessly Edition)") ? (
            <>
              (Lessly Edition)
              <br />
              {item.name.replace("(Lessly Edition)", "").trim()}
            </>
          ) : (
            item.name
          )}
        </span>
        {isEditing && (
          <div className="shrink-0">
            <StarRating
              rating={localRating}
              onChange={(r) => setLocalRating(r)}
              size="lg"
            />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {isReadOnly ? (
          <div className="text-xs text-gray-500 italic truncate flex-1 px-1">
            {comment ? `"${comment}"` : ''}
          </div>
        ) : isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={localComment}
                onChange={e => setLocalComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave();
                  }
                }}
                placeholder="코멘트를 남겨보세요..."
                className="text-xs text-gray-600 bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100 focus:outline-none focus:ring-1 focus:ring-br-pink flex-1 min-w-0"
                autoFocus
              />
              {comment && (
                <button
                  onClick={async () => {
                    setLocalComment('');
                    if (onCommentChange) await onCommentChange(item.id, '');
                    setIsEditing(false);
                  }}
                  className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors shrink-0"
                >
                  삭제
                </button>
              )}
              <button
                onClick={() => {
                  setLocalRating(rating);
                  setLocalComment(comment || '');
                  setIsEditing(false);
                }}
                className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-700 transition-colors shrink-0"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-br-pink text-white text-xs font-bold rounded-full shadow-sm hover:bg-br-pink/90 transition-colors shrink-0"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1 w-full">
            <div className="text-xs text-gray-500 italic truncate flex-1 px-1">
              {comment ? `"${comment}"` : <span className="text-gray-300">코멘트가 없습니다</span>}
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:text-br-pink hover:border-br-pink-light text-xs font-bold rounded-full shadow-sm transition-colors shrink-0 sm:opacity-0 group-hover:opacity-100"
            >
              수정
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Analytics: React.FC<AnalyticsProps> = ({ ratings, comments, menuData, onRatingChange, onCommentChange, isReadOnly = false }) => {
  const filteredRatings = useMemo(() => {
    const result: Record<number, number> = {};
    Object.entries(ratings).forEach(([id, rating]) => {
      if ((rating as number) > 0) {
        result[parseInt(id, 10)] = rating as number;
      }
    });
    return result;
  }, [ratings]);

  const ratingEntries = Object.values(filteredRatings) as number[];
  const totalRatings = ratingEntries.length;
  const tier = getTier(totalRatings);

  // 1. Distribution: Histogram of ratings
  const distributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (let i = 0.5; i <= 5.0; i += 0.5) {
      counts[i.toFixed(1)] = 0;
    }
    ratingEntries.forEach(rating => {
      const key = rating.toFixed(1);
      if (counts[key] !== undefined) counts[key]++;
    });
    return Object.keys(counts).map(key => ({
      rating: key,
      count: counts[key]
    }));
  }, [ratingEntries]);

  const averageRating = useMemo(() => {
    if (totalRatings === 0) return 0;
    return (ratingEntries.reduce((a, b) => a + b, 0) / totalRatings).toFixed(2);
  }, [ratingEntries, totalRatings]);

  // 4. Grouped by Rating
  const groupedByRating = useMemo(() => {
    const groups: Record<number, MenuItem[]> = {};
    (Object.entries(filteredRatings) as [string, number][]).forEach(([idStr, rating]) => {
      const id = parseInt(idStr, 10);
      const menu = menuData.find(m => m.id === id);
      if (menu) {
        if (!groups[rating]) groups[rating] = [];
        groups[rating].push(menu);
      }
    });
    // Sort ratings descending
    return Object.entries(groups)
      .map(([rating, items]) => ({ rating: parseFloat(rating), items }))
      .sort((a, b) => b.rating - a.rating);
  }, [filteredRatings, menuData]);

  const maxCount = Math.max(...distributionData.map(d => d.count));

  if (totalRatings === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">데이터가 없습니다</h3>
        <p className="text-sm text-gray-500 mt-1">맛을 평가하고 분석 결과를 확인해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Tier Card */}
      <div
        className="bg-white rounded-2xl shadow-sm p-6 border-2 border-transparent hover:border-br-pink-light transition-all group"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0 ${tier.color} overflow-hidden`}>
            <img src={tier.imageUrl} alt={tier.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">나의 배스킨라빈스 티어</h3>
              <InfoPopover
                title="티어 설명표"
                align="center"
                content={
                  <div className="max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">아이콘</th>
                          <th className="px-2 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">티어명</th>
                          <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">정복 개수</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tiers.map((tier) => (
                          <tr key={tier.name} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 flex justify-center">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm ${tier.color} overflow-hidden`}>
                                <img src={tier.imageUrl} alt={tier.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            </td>
                            <td className="px-2 py-3">
                              <div className="text-xs font-black text-gray-800 whitespace-nowrap">
                                {tier.name.includes("(Lessly Edition)") ? (
                                  <>
                                    (Lessly Edition)
                                    <br />
                                    {tier.name.replace("(Lessly Edition)", "").trim()}
                                  </>
                                ) : (
                                  tier.name
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="text-[11px] font-bold text-br-pink whitespace-nowrap">{tier.minCount}개 이상</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              />
            </div>
            <div className="text-2xl font-black text-gray-900 leading-tight">
              {tier.name.includes("(Lessly Edition)") ? (
                <>
                  (Lessly Edition)
                  <br />
                  {tier.name.replace("(Lessly Edition)", "").trim()}
                </>
              ) : (
                tier.name
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-around pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xl font-black text-gray-900">{totalRatings}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap">정복한 맛</div>
          </div>

          <div className="w-px h-8 bg-gray-100"></div>

          <div className="text-center">
            {totalRatings < 50 ? (
              <>
                <div className="text-xl font-black text-br-pink">
                  {tiers.find((t, i) => tiers[i-1]?.name === tier.name)?.minCount! - totalRatings}
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap">다음 등급까지</div>
              </>
            ) : (
              <>
                <div className="text-xl font-black text-yellow-500">MAX</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase whitespace-nowrap">최고 등급</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Integrated Rating Distribution Card */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-br-pink-light p-6 transition-all">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-lg font-black text-br-blue">별점 분포</h3>
        </div>

        <div className="relative h-48 flex items-end justify-between gap-1 sm:gap-2 mb-4 mt-8">
          {distributionData.map((data) => {
            const heightPercentage = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
            return (
              <div key={data.rating} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                {/* Count label on top of bar */}
                <div className={`text-xs font-bold mb-1 transition-all ${data.count > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
                  {data.count > 0 ? data.count : ''}
                </div>
                {/* Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${data.count > 0 ? 'bg-br-pink hover:brightness-110' : 'bg-gray-100'}`}
                  style={{ height: `${heightPercentage}%`, minHeight: data.count > 0 ? '4px' : '1px' }}
                ></div>
                {/* Rating label under bar */}
                <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-2">
                  {data.rating}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex justify-around pt-6 border-t border-gray-100 mt-4">
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900 mb-1">{averageRating}</div>
            <div className="text-xs text-gray-500 font-medium">별점 평균</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900 mb-1">{totalRatings}</div>
            <div className="text-xs text-gray-500 font-medium">별점 개수</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-br-pink-light p-6 transition-all">
        <h3 className="text-lg font-black text-br-blue mb-6">평점별 맛 리스트</h3>
        {groupedByRating.length > 0 ? (
          <div className="space-y-6">
            {groupedByRating.map(group => (
              <div key={group.rating} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-br-pink font-black text-xl">
                    평점 {group.rating.toFixed(1)}
                  </div>
                  <StarRating rating={group.rating} onChange={() => {}} readonly size="lg" showNumber={false} />
                  <span className="text-sm text-gray-400 font-medium">({group.items.length}개)</span>
                </div>
                <div className="flex flex-col gap-2">
                  {group.items.map(item => (
                    <CompactMenuRow
                      key={item.id}
                      item={item}
                      rating={group.rating}
                      comment={comments[item.id] || ''}
                      onRatingChange={onRatingChange}
                      onCommentChange={onCommentChange}
                      isReadOnly={isReadOnly}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm font-medium">
            아직 평가한 메뉴가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
