import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, Users, Heart, Swords, Sparkles, ArrowLeft, Star, PieChart, Search, Info, Frown } from 'lucide-react';
import { MenuItem, getTier } from '../data';
import { db, auth } from '../firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { InfoPopover } from './InfoPopover';
import { StarRating } from './StarRating';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FriendType {
  id: string;
  name: string;
  avatar: string;
  description: string;
  ratings: Record<number, number>;
  isFavorite?: boolean;
}

interface SocialStatsProps {
  myRatings: Record<number, number>;
  myComments: Record<number, string>;
  myName: string;
  myAvatar: string;
  menuData: MenuItem[];
  onViewFriendStats?: (friend: FriendType) => void;
  favorites: string[];
  onToggleFavorite: (friendId: string) => void;
  activeTab: 'global' | 'friends' | 'awards';
  setActiveTab: (tab: 'global' | 'friends' | 'awards') => void;
  onRatingChange?: (id: number, rating: number) => void;
  onCommentChange?: (id: number, comment: string) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onSelectedFriendChange?: (friend: FriendType | null) => void;
}

// Mock Data Generators removed

export const SocialStats: React.FC<SocialStatsProps> = ({
  myRatings,
  myComments,
  myName,
  myAvatar,
  menuData,
  onViewFriendStats,
  favorites,
  onToggleFavorite,
  activeTab,
  setActiveTab,
  onRatingChange,
  onCommentChange,
  searchQuery,
  onSearchQueryChange,
  onSelectedFriendChange,
}) => {
  const setSearchQuery = onSearchQueryChange;
  const [selectedFriend, _setSelectedFriend] = useState<FriendType | null>(null);
  const setSelectedFriend = (friend: FriendType | null) => {
    _setSelectedFriend(friend);
    onSelectedFriendChange?.(friend);
  };
  const [selectedFlavor, setSelectedFlavor] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (selectedFlavor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedFlavor]);
  const [flavorComments, setFlavorComments] = useState<{userId: string, name: string, avatar: string, rating: number, comment: string}[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [friendsList, setFriendsList] = useState<FriendType[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [globalStats, setGlobalStats] = useState<any[]>([]);
  const [allUsersData, setAllUsersData] = useState<any[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(true);
  const [awards, setAwards] = useState<{
    mostRated: any[],
    mostGenerous: any[],
    strictest: any[],
    mostComments: any[]
  } | null>(null);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [localComment, setLocalComment] = useState('');

  useEffect(() => {
    console.log("SocialStats received myRatings:", myRatings, "myComments:", myComments);
    const fetchAllData = async () => {
      setIsLoadingGlobal(true);
      try {
        // In local-only mode, we don't fetch from Firestore.
        // We can show some mock data for the "Global" rankings so it's not empty.
        // Fetch all users from Firestore
        let usersSnapshot;
        try {
          usersSnapshot = await getDocs(collection(db, 'users'));
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
        const allUsersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        setAllUsersData(allUsersData);

        // Add current user to stats if they have ratings
        const currentUserId = auth.currentUser?.uid || 'local_user_01';
        const currentUserData = {
          id: currentUserId,
          name: myName,
          avatar: myAvatar,
          description: `평가한 아이스크림: ${Object.values(myRatings || {}).filter(r => (r as number) > 0).length}개`,
          ratings: myRatings,
          comments: myComments
        };

        const users: FriendType[] = [
          currentUserData,
          ...allUsersData.filter(u => u.id !== currentUserId).map(u => ({
            id: u.id,
            name: u.name,
            avatar: u.avatar,
            description: `평가한 아이스크림: ${Object.values(u.ratings || {}).filter(r => (r as number) > 0).length}개`,
            ratings: u.ratings || {}
          }))
        ];
        
        // For global stats
        const flavorStats: Record<number, { count: number, sum: number, distribution: number[] }> = {};
        menuData.forEach(item => {
          flavorStats[item.id] = { count: 0, sum: 0, distribution: new Array(10).fill(0) };
        });

        // Aggregate ratings for global stats
        const allUsersIncludingMe = [currentUserData, ...allUsersData.filter(u => u.id !== currentUserId)];
        allUsersIncludingMe.forEach((data) => {
          const ratings = data.ratings || {};
          
          Object.entries(ratings).forEach(([idStr, rating]) => {
            const id = parseInt(idStr);
            const r = rating as number;
            if (flavorStats[id] && r > 0) {
              flavorStats[id].count += 1;
              flavorStats[id].sum += r;
              
              const distIndex = Math.max(0, Math.min(9, Math.floor(r * 2) - 1));
              flavorStats[id].distribution[distIndex] += 1;
            }
          });
        });
        
        setFriendsList(users);

        // Calculate Awards
        const ratedUsers = allUsersIncludingMe.filter(u => Object.values(u.ratings || {}).filter(r => (r as number) > 0).length > 0);
        const mostRated = [...ratedUsers].sort((a, b) => Object.values(b.ratings || {}).filter(r => (r as number) > 0).length - Object.values(a.ratings || {}).filter(r => (r as number) > 0).length).slice(0, 3);
        const generousUsers = ratedUsers.map(u => {
          const ratings = Object.values(u.ratings || {}).filter(r => (r as number) > 0) as number[];
          const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
          return { ...u, avg };
        }).filter(u => Object.values(u.ratings || {}).filter(r => (r as number) > 0).length >= 1);
        
        const mostGenerous = [...generousUsers].sort((a, b) => b.avg - a.avg).slice(0, 3);
        const strictest = [...generousUsers].sort((a, b) => a.avg - b.avg).slice(0, 3);
        const mostComments = [...allUsersIncludingMe]
          .filter(u => Object.values(u.comments || {}).filter(c => (c as string).length > 0).length > 0)
          .sort((a, b) => Object.values(b.comments || {}).filter(c => (c as string).length > 0).length - Object.values(a.comments || {}).filter(c => (c as string).length > 0).length)
          .slice(0, 3);

        setAwards({
          mostRated,
          mostGenerous,
          strictest,
          mostComments
        });

        // Calculate Bayesian Average
        const activeFlavors = Object.values(flavorStats).filter(s => s.count > 0);
        const totalVotes = activeFlavors.reduce((sum, s) => sum + s.count, 0);
        const meanVotes = activeFlavors.length > 0 ? totalVotes / activeFlavors.length : 0;
        const meanRating = activeFlavors.length > 0 ? activeFlavors.reduce((sum, s) => sum + (s.sum / s.count), 0) / activeFlavors.length : 0;

        const calculatedStats = menuData.map(item => {
          const stats = flavorStats[item.id];
          const v = stats.count;
          const R = v > 0 ? stats.sum / v : 0;
          const bayesianScore = v > 0 ? ((v / (v + meanVotes)) * R) + ((meanVotes / (v + meanVotes)) * meanRating) : 0;
          
          // Calculate variance
          let variance = 0;
          if (v > 1) {
            const mean = R;
            let sumSquaredDiff = 0;
            stats.distribution.forEach((count, idx) => {
              const rating = (idx + 1) * 0.5;
              sumSquaredDiff += count * Math.pow(rating - mean, 2);
            });
            variance = sumSquaredDiff / v;
          }

          return {
            ...item,
            globalCount: v,
            globalAvg: parseFloat(R.toFixed(1)),
            distribution: stats.distribution,
            score: bayesianScore,
            variance: variance
          };
        }).filter(item => item.globalCount > 0);

        const statsWithRank = calculatedStats.sort((a, b) => (b.score || 0) - (a.score || 0)).map((item, idx) => ({
          ...item,
          originalRank: idx + 1
        }));

        setGlobalStats(statsWithRank);

      } catch (error) {
        console.error("Error calculating local stats:", error);
      } finally {
        setIsLoadingGlobal(false);
      }
    };
    
    fetchAllData();
  }, [menuData, myRatings, myComments]);

  const filteredFriends = useMemo(() => {
    return friendsList.filter(f => 
      f.name.includes(searchQuery) || 
      f.description.includes(searchQuery)
    );
  }, [searchQuery, friendsList]);

  const getComparison = (friendRatings: Record<number, number>) => {
    const sharedIds = Object.keys(myRatings).map(Number).filter(id => friendRatings[id]);
    const friendOnlyIds = Object.keys(friendRatings).map(Number).filter(id => !myRatings[id]);
    
    if (sharedIds.length === 0) return null;

    // Calculate averages for normalization
    const myValues = Object.values(myRatings) as number[];
    const frValues = Object.values(friendRatings) as number[];
    const myAvg = myValues.reduce((a, b) => a + b, 0) / myValues.length;
    const frAvg = frValues.reduce((a, b) => a + b, 0) / frValues.length;

    let totalDiff = 0;
    const sharedItems = sharedIds.map(id => {
      const myR = myRatings[id] || 0;
      const frR = friendRatings[id] || 0;
      
      // Normalize ratings to account for different standards
      const myNorm = myR - myAvg;
      const frNorm = frR - frAvg;
      
      const diff = Math.abs(myNorm - frNorm); // Normalized difference
      const sum = myR + frR; // Keep raw sum for soulmates
      
      totalDiff += diff;
      return { id, myR, frR, diff, sum };
    });

    // Soulmates: Highest sum, sorted descending. Take top 3.
    const soulmates = [...sharedItems]
      .filter(item => item.sum >= 7) // At least decent ratings from both
      .sort((a, b) => b.sum - a.sum)
      .slice(0, 3)
      .map(item => menuData.find(m => m.id === item.id))
      .filter(Boolean) as MenuItem[];

    const soulmateIds = new Set(soulmates.map(s => s.id));

    // Opposites: Highest normalized diff, sorted descending. Take top 3.
    // Require raw diff >= 1.5 as well to avoid normalization artifacts (e.g. 5 vs 4 appearing as opposites).
    // Also exclude items already in soulmates.
    const opposites = [...sharedItems]
      .filter(item => item.diff >= 1.5 && Math.abs(item.myR - item.frR) >= 1.5 && !soulmateIds.has(item.id))
      .sort((a, b) => b.diff - a.diff)
      .slice(0, 3)
      .map(item => ({
        menu: menuData.find(m => m.id === item.id),
        myR: item.myR,
        frR: item.frR
      }))
      .filter(item => item.menu) as { menu: MenuItem, myR: number, frR: number }[];

    // Mutual Dislikes: Both rated <= 2.5
    const mutualDislikes = [...sharedItems]
      .filter(item => item.myR <= 2.5 && item.frR <= 2.5)
      .sort((a, b) => a.sum - b.sum) // Lowest sum first
      .slice(0, 3)
      .map(item => menuData.find(m => m.id === item.id))
      .filter(Boolean) as MenuItem[];

    // Friend's Recommendations: Friend rated >= 4, I haven't rated
    const friendRecs = friendOnlyIds
      .filter(id => friendRatings[id] >= 4)
      .sort((a, b) => friendRatings[b] - friendRatings[a])
      .slice(0, 3)
      .map(id => menuData.find(m => m.id === id))
      .filter(Boolean) as MenuItem[];

    // Match rate based on normalized difference
    const matchRate = Math.max(0, 100 - (totalDiff / sharedIds.length / 4 * 100));
    return {
      matchRate: matchRate.toFixed(0),
      sharedCount: sharedIds.length,
      soulmates,
      opposites,
      mutualDislikes,
      friendRecs
    };
  };

  const handleFlavorClick = async (item: MenuItem) => {
    console.log("Selected Flavor:", item);
    setSelectedFlavor(item);
    setIsEditingComment(false);
    setLocalComment(myComments[item.id] || '');
    setIsLoadingComments(true);
    try {
      // Find comments for this flavor from all users
      const comments: {userId: string, name: string, avatar: string, rating: number, comment: string}[] = [];
      
      allUsersData.forEach(user => {
        if (user.comments && user.comments[item.id]) {
          comments.push({
            userId: user.id,
            name: user.name,
            avatar: user.avatar,
            rating: user.ratings ? (user.ratings[item.id] || 0) : 0,
            comment: user.comments[item.id]
          });
        }
      });
      
      setFlavorComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const renderSparkline = (distribution: number[]) => {
    const max = Math.max(...distribution);
    return (
      <div className="flex items-end gap-[2px] h-8 w-24">
        {distribution.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
            <div 
              className="w-full bg-br-pink rounded-t-sm opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ height: `${Math.max((val / max) * 100, 10)}%` }}
            ></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-48">

      {activeTab === 'friends' && (
        <div className="px-4 text-xs text-gray-400 font-medium text-center">
          현재 <span className="font-bold text-br-pink">{friendsList.length}명</span>의 전문가들이 함께하고 있어요!
        </div>
      )}
      {activeTab === 'awards' && awards && (
        <div className="space-y-3">
          {[
            {
              title: '가장 많은 맛을 평가한 사람',
              users: awards.mostRated,
              icon: '🏆',
              getValue: (u: any) => `${Object.values(u.ratings || {}).filter(r => (r as number) > 0).length}개`
            },
            {
              title: '가장 평균 평점이 높은 사람',
              users: awards.mostGenerous,
              icon: '😊',
              getValue: (u: any) => `${u.avg.toFixed(1)}점`
            },
            {
              title: '가장 평균 평점이 낮은 사람',
              users: awards.strictest,
              icon: '🧐',
              getValue: (u: any) => `${u.avg.toFixed(1)}점`
            },
            {
              title: '코멘트가 가장 많은 사람',
              users: awards.mostComments,
              icon: '📝',
              getValue: (u: any) => `${Object.values(u.comments || {}).filter(c => (c as string).length > 0).length}개`
            }
          ].map((award, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{award.icon}</span>
                  <span className="text-xs font-bold text-gray-700">{award.title}</span>
                </div>
                <span className="text-xs font-black text-gray-400 tracking-widest">TOP 3</span>
              </div>
              <div className="divide-y divide-gray-50">
                {award.users.map((user, uIdx) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      const friend = friendsList.find(f => f.id === user.id);
                      if (friend) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveTab('friends');
                        setSelectedFriend(friend);
                      }
                    }}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        uIdx === 0 ? 'bg-yellow-100 text-yellow-600' :
                        uIdx === 1 ? 'bg-gray-100 text-gray-500' :
                        'bg-orange-50 text-orange-500'
                      }`}>
                        {uIdx + 1}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                        {user.avatar}
                      </div>
                      <span className="text-xs font-semibold text-gray-800">{user.name}</span>
                    </div>
                    <span className="text-xs font-bold text-br-pink">{award.getValue(user)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'global' && (
        <div className="space-y-6">
          {/* Full List with Distribution */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-sm font-black text-br-blue">배스킨라빈스 맛 순위</h3>
              <InfoPopover 
                title="순위 선정 기준"
                content={
                  <>
                    <strong>베이지안 평균</strong>
                    <br/><br/>
                    단순히 평점이 높은 순서가 아닙니다. 평가 참여자 수와 평균 평점을 종합적으로 고려하여, 소수만 평가한 5점짜리 맛보다 많은 사람이 평가한 4.5점짜리 맛이 더 높은 순위를 차지하도록 설계된 '종합 인기 점수'를 기준으로 정렬됩니다.
                  </>
                }
              />
            </div>
            <div className="space-y-4">
              {isLoadingGlobal ? (
                <div className="text-center py-10 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-br-pink mx-auto mb-4"></div>
                  글로벌 랭킹 데이터를 불러오는 중입니다...
                </div>
              ) : (
                globalStats.filter(item => item.name.includes(searchQuery) || item.tags?.some((tag: string) => tag.includes(searchQuery))).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleFlavorClick(item)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer"
                  >
                    <div className="w-6 text-center font-bold text-gray-400 shrink-0">
                      {item.globalCount > 0 ? item.originalRank : '-'}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1 text-br-pink font-bold">
                          평점 {item.globalAvg > 0 ? item.globalAvg : '-'}
                        </span>
                        <span>{item.globalCount.toLocaleString()}명 평가</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Polarizing Ranking */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-sm font-black text-br-blue">호불호 순위 (Top 10)</h3>
              <InfoPopover 
                title="호불호 순위 기준"
                content={
                  <>
                    <strong>분산 기준</strong>
                    <br/><br/>
                    평점의 분포가 가장 큰(분산이 큰) 맛들입니다. 누군가에게는 인생 맛, 누군가에게는 최악의 맛으로 평가받는 '호불호가 확실한' 맛들을 확인해보세요!
                  </>
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              {globalStats
                .filter(item => item.globalCount >= 5) // Need at least 5 ratings to calculate variance
                .sort((a, b) => b.variance - a.variance)
                .slice(0, 10)
                .map((item, idx) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleFlavorClick(item)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer"
                  >
                    <div className="w-6 text-center font-bold text-br-pink shrink-0">
                      {idx + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-500">분산 {item.variance.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'friends' && !selectedFriend && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {isLoadingFriends ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-br-pink mx-auto mb-4"></div>
                친구들의 데이터를 불러오는 중입니다...
              </div>
            ) : friendsList.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                <div className="text-4xl mb-4">😢</div>
                아직 가입한 친구가 없습니다.
              </div>
            ) : (
              friendsList
                .filter(f => f.name.includes(searchQuery) || f.description.includes(searchQuery))
                .sort((a, b) => {
                  const aFav = favorites.includes(a.id);
                  const bFav = favorites.includes(b.id);
                  if (aFav && !bFav) return -1;
                  if (!aFav && bFav) return 1;
                  return 0;
                })
                .map(friend => {
                  const friendRatedCount = Object.keys(friend.ratings).length;
                  const friendTier = getTier(friendRatedCount);
                  return (
                    <div
                      key={friend.id}
                      className={`flex items-center gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all text-left relative ${
                        favorites.includes(friend.id) ? 'border-yellow-200' : 'border-gray-100 hover:border-br-pink-light'
                      }`}
                    >
                      <button
                        onClick={() => onToggleFavorite(friend.id)}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                          favorites.includes(friend.id) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${favorites.includes(friend.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setSelectedFriend(friend);
                        }}
                        className="flex items-center gap-4 flex-1"
                      >
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl shrink-0 relative">
                          {friend.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1">
                            {friend.id === auth.currentUser?.uid ? `${friend.name} (나)` : friend.name}
                          </h4>
                          <p className="text-xs text-gray-500">{friend.description}</p>
                        </div>
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {activeTab === 'friends' && selectedFriend && (() => {
        const comparison = getComparison(selectedFriend.ratings);
        const friendRatedCount = Object.keys(selectedFriend.ratings).length;
        const friendTier = getTier(friendRatedCount);
        
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setSelectedFriend(null)}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm border border-br-blue/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              돌아가기
            </button>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-br-pink-light/30 to-br-blue-light/30"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl shadow-lg mb-4 border-4 border-white relative">
                  {selectedFriend.avatar}
                </div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center justify-center gap-1">
                  {selectedFriend.id === auth.currentUser?.uid ? `${selectedFriend.name} (나)` : selectedFriend.name}
                </h2>
                <p className="text-gray-500 mt-1 mb-4">{selectedFriend.description}</p>
                <button
                  onClick={() => onViewFriendStats?.(selectedFriend)}
                  className="bg-br-blue hover:bg-br-blue/90 text-white font-bold py-2 px-6 rounded-full shadow-sm transition-all text-sm flex items-center gap-2 mx-auto"
                >
                  <PieChart className="w-4 h-4" />
                  {selectedFriend.id === auth.currentUser?.uid ? '내' : selectedFriend.name + '의'} 통계 보러가기
                </button>
              </div>
            </div>

            {comparison ? (
              <div className="space-y-6">
                {/* Match Rate */}
                <div className="bg-[#0a0a0a] rounded-3xl p-8 shadow-xl text-center text-white relative overflow-hidden">
                  <h3 className="text-gray-400 font-medium mb-2">우리들의 입맛 씽크로율</h3>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-br-pink to-br-blue mb-2">
                    {comparison.matchRate}%
                  </div>
                  <p className="text-sm text-gray-400">함께 평가한 아이스크림 {comparison.sharedCount}개 기준</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Soulmate Flavors */}
                  {comparison.soulmates.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 text-br-pink font-bold mb-4">
                        <Heart className="w-5 h-5 fill-current shrink-0" />
                        <span className="break-keep">우리의 소울 아이스크림</span>
                      </div>
                      <div className="space-y-3">
                        {comparison.soulmates.map((item, idx) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <span className="text-xs font-black text-br-pink w-8 shrink-0 text-center">TOP{idx + 1}</span>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                              {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                              <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">나: {myRatings[item.id]}점 · 친구: {selectedFriend.ratings[item.id]}점</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opposite Flavors */}
                  {comparison.opposites.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 text-br-blue font-bold mb-4">
                        <Swords className="w-5 h-5" />
                        취향 극과 극
                      </div>
                      <div className="space-y-3">
                        {comparison.opposites.map((item, idx) => (
                          <div key={item.menu.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                              {item.menu.imageUrl && <img src={item.menu.imageUrl} alt={item.menu.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.menu.name}</h4>
                              <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">나: {item.myR}점 · 친구: {item.frR}점</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Friend's Recommendations */}
                  {comparison.friendRecs.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 text-emerald-500 font-bold mb-4">
                        <Star className="w-5 h-5 fill-current" />
                        친구는 강추, 나는 아직 안 먹어본 맛!
                      </div>
                      <div className="space-y-3">
                        {comparison.friendRecs.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                              {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm leading-tight break-keep">{item.name}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mutual Dislikes */}
                  {comparison.mutualDislikes.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 font-bold mb-4">
                        <Frown className="w-5 h-5" />
                        우리 둘 다 불호
                      </div>
                      <div className="space-y-3">
                        {comparison.mutualDislikes.map((item, idx) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 grayscale opacity-60">
                              {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-600 text-sm leading-tight">{item.name}</h4>
                              <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">나: {myRatings[item.id]}점 · 친구: {selectedFriend.ratings[item.id]}점</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-100">
                <div className="text-4xl mb-4">🤔</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">비교할 데이터가 부족해요</h3>
                <p className="text-gray-500">나와 친구가 공통으로 평가한 아이스크림이 없습니다.<br/>더 많은 아이스크림에 별점을 남겨보세요!</p>
              </div>
            )}
          </div>
        );
      })()}


      {/* Flavor Comments Modal */}
      {selectedFlavor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-20 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedFlavor(null)}>
          <div className="bg-[#141414] w-full max-w-[360px] max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {selectedFlavor.imageUrl && <img src={selectedFlavor.imageUrl} alt={selectedFlavor.name} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white leading-tight break-keep">
                    {selectedFlavor.name.includes("(Lessly Edition)") ? (
                      <>
                        (Lessly Edition)
                        <br />
                        {selectedFlavor.name.replace("(Lessly Edition)", "").trim()}
                      </>
                    ) : (
                      selectedFlavor.name
                    )}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <div className="text-br-pink font-bold text-sm">
                      {((selectedFlavor as any).globalAvg || 0).toFixed(1)}
                      <span className="text-gray-400 text-xs font-normal ml-0.5">/ 5.0</span>
                    </div>
                    <div className="text-gray-400 text-[10px]">
                      {((selectedFlavor as any).distribution.reduce((a: number, b: number) => a + b, 0))}명 평가
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFlavor(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-12">
              {isLoadingComments ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-br-pink mb-4"></div>
                  코멘트를 불러오는 중입니다...
                </div>
              ) : (
                <>
                  {/* Rating Distribution */}
                  {(selectedFlavor as any).distribution && (
                    <div className="mb-8">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-white font-bold text-lg">별점 분포</h4>
                      </div>
                      <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/5">
                        <div className="flex items-end justify-between h-24 gap-1">
                          {(selectedFlavor as any).distribution.map((count: number, idx: number) => (
                            <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full">
                              <div className="w-full bg-white/10 rounded-t-sm relative flex items-end justify-center h-full">
                                <div 
                                  className={`w-full rounded-t-sm ${count > 0 ? 'bg-br-pink' : 'bg-white/5'}`}
                                  style={{ height: `${Math.max((count / Math.max(...(selectedFlavor as any).distribution, 1)) * 100, 10)}%` }}
                                ></div>
                              </div>
                              <span className="text-gray-400 text-[9px] font-bold">{((idx + 1) * 0.5).toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* My Rating & Comment */}
                  {onRatingChange && selectedFlavor && (
                    <div className="mb-8">
                      <h4 className="text-white font-bold text-lg mb-4">내 평가</h4>
                      <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <StarRating
                            rating={myRatings[selectedFlavor.id] || 0}
                            onChange={(newRating) => {
                              onRatingChange(selectedFlavor.id, newRating);
                              const currentUserId = auth.currentUser?.uid;
                              if (currentUserId) {
                                setFlavorComments(prev => prev.map(c =>
                                  c.userId === currentUserId ? { ...c, rating: newRating } : c
                                ));
                              }
                            }}
                            size="md"
                          />
                        </div>
                        {(myRatings[selectedFlavor.id] || 0) > 0 && (
                          <div>
                            {isEditingComment ? (
                              <div className="flex flex-col gap-2">
                                <textarea
                                  value={localComment}
                                  onChange={(e) => setLocalComment(e.target.value)}
                                  placeholder="코멘트를 남겨보세요..."
                                  className="w-full bg-white/5 text-white text-sm rounded-xl p-3 border border-white/10 focus:border-br-pink focus:outline-none resize-none placeholder-gray-500"
                                  rows={3}
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => {
                                      setIsEditingComment(false);
                                      setLocalComment(myComments[selectedFlavor.id] || '');
                                    }}
                                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                  >
                                    취소
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (onCommentChange) {
                                        await onCommentChange(selectedFlavor.id, localComment);
                                      }
                                      setIsEditingComment(false);
                                      const currentUserId = auth.currentUser?.uid;
                                      if (currentUserId && selectedFlavor) {
                                        const currentUserData = allUsersData.find(u => u.id === currentUserId);
                                        setFlavorComments(prev => {
                                          const filtered = prev.filter(c => c.userId !== currentUserId);
                                          if (localComment.trim()) {
                                            return [...filtered, {
                                              userId: currentUserId,
                                              name: currentUserData?.name || '나',
                                              avatar: currentUserData?.avatar || '🍦',
                                              rating: myRatings[selectedFlavor.id] || 0,
                                              comment: localComment.trim()
                                            }];
                                          }
                                          return filtered;
                                        });
                                      }
                                    }}
                                    className="px-3 py-1.5 text-xs text-white bg-br-pink rounded-lg hover:opacity-90 transition-opacity font-bold"
                                  >
                                    저장
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setLocalComment(myComments[selectedFlavor.id] || '');
                                  setIsEditingComment(true);
                                }}
                                className="cursor-pointer group"
                              >
                                {myComments[selectedFlavor.id] ? (
                                  <p className="text-gray-300 text-sm italic group-hover:text-white transition-colors">
                                    "{myComments[selectedFlavor.id]}"
                                    <span className="text-gray-500 text-xs ml-2 not-italic">수정</span>
                                  </p>
                                ) : (
                                  <p className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors">
                                    코멘트를 남겨보세요...
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-white font-bold text-lg">코멘트 {flavorComments.length}개</h4>
                  </div>
                  {flavorComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                      <div className="text-4xl mb-4">📝</div>
                      아직 작성된 코멘트가 없습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {flavorComments.map((comment, idx) => (
                        <div key={idx} className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <button 
                              onClick={() => {
                                const friend = friendsList.find(f => f.id === comment.userId);
                                if (friend) {
                                  setSelectedFlavor(null);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                  setActiveTab('friends');
                                  setSelectedFriend(friend);
                                }
                              }}
                              className="flex items-center gap-2 hover:bg-white/5 p-1 -ml-1 rounded-lg transition-colors cursor-pointer text-left"
                            >
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm shrink-0">
                                {comment.avatar}
                              </div>
                              <span className="font-bold text-white text-sm hover:underline">{comment.name}</span>
                            </button>
                            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full shrink-0">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-white text-xs font-bold">{comment.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed flex-1 whitespace-pre-wrap">
                            {comment.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
