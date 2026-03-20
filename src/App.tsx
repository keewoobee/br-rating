import React, { useState, useEffect, useMemo } from 'react';
import { menuData, getTier, MenuItem } from './data';
import { MenuCard } from './components/MenuCard';
import { Analytics } from './components/Analytics';
import { FilterBar } from './components/FilterBar';
import { Login } from './components/Login';
import { NameInput } from './components/NameInput';
import { SocialStats, FriendType } from './components/SocialStats';
import { TierInfoModal } from './components/TierInfoModal';
import { InfoPopover } from './components/InfoPopover';
import { FeedbackModal } from './components/FeedbackModal';
import { Feedback } from './components/Feedback';
import { AdminFeedback } from './components/AdminFeedback';
import { PieChart, List, Users, ArrowLeft, LogOut, Settings, Info, Trash2, X, MessageSquare, IceCreamCone, BarChart3, ArrowUpDown, Search } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, collection, query, where, getDocs, deleteDoc, deleteField, updateDoc } from 'firebase/firestore';

function getJosa(name: string) {
  if (!name) return '가';
  const lastChar = name.charCodeAt(name.length - 1);
  if (lastChar >= 0xac00 && lastChar <= 0xd7a3) {
    const hasJongseong = (lastChar - 0xac00) % 28 > 0;
    return hasJongseong ? '이가' : '가';
  }
  return '가';
}

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isProfileSetupComplete, setIsProfileSetupComplete] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [view, setView] = useState<'list' | 'analytics' | 'social'>('list');
  const [viewingFriend, setViewingFriend] = useState<FriendType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | 'rated' | 'unrated'>('all');
  const [sortOrder, setSortOrder] = useState<'name' | 'rating'>('name');
  const [socialTab, setSocialTab] = useState<'global' | 'friends' | 'awards'>('global');
  const [socialSearchQuery, setSocialSearchQuery] = useState('');
  const [socialHasFriendSelected, setSocialHasFriendSelected] = useState(false);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Firebase Auth initialization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        
        // Load user data
        const localData = localStorage.getItem(`br_data_${user.uid}`);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            setUserName(parsed.name || user.displayName || '아이스크림러버');
            setUserAvatar(parsed.avatar || '🍦');
            setRatings(parsed.ratings || {});
            setComments(parsed.comments || {});
            setFavorites(parsed.favorites || []);
            setIsProfileSetupComplete(true);
          } catch (e) {
            console.error("Error parsing LocalStorage data:", e);
          }
        } else {
          setUserName(user.displayName || '아이스크림러버');
          setUserAvatar('🍦');
          setIsProfileSetupComplete(false);
        }
      } else {
        setUserId(null);
        setIsProfileSetupComplete(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Listen for real-time updates to user data
  useEffect(() => {
    if (!userId || !isProfileSetupComplete || userId === 'local_user_01') return;

    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        console.log("Firestore update received:", data);
        
        // 데이터가 실제로 변경되었을 때만 상태 업데이트
        if (data.name) setUserName(prev => prev === data.name ? prev : data.name);
        if (data.avatar) setUserAvatar(prev => prev === data.avatar ? prev : data.avatar);
        setRatings(prev => {
          const newRatings = data.ratings || {};
          return JSON.stringify(prev) === JSON.stringify(newRatings) ? prev : newRatings;
        });
        setComments(prev => {
          const newComments = data.comments || {};
          return JSON.stringify(prev) === JSON.stringify(newComments) ? prev : newComments;
        });
        setFavorites(prev => {
          const newFavorites = data.favorites || [];
          return JSON.stringify(prev) === JSON.stringify(newFavorites) ? prev : newFavorites;
        });

        // localStorage도 최신 상태로 동기화 (다음 앱 시작 시 반영)
        const cached = localStorage.getItem(`br_data_${userId}`);
        const cachedData = cached ? JSON.parse(cached) : {};
        localStorage.setItem(`br_data_${userId}`, JSON.stringify({
          ...cachedData,
          name: data.name || cachedData.name,
          avatar: data.avatar || cachedData.avatar,
          ratings: data.ratings || cachedData.ratings,
          comments: data.comments || cachedData.comments,
          favorites: data.favorites || cachedData.favorites,
          updatedAt: new Date().toISOString()
        }));
      } else {
        console.log("Firestore document does not exist for user:", userId);
      }
    }, (error) => {
      console.error("Error listening to user data:", error);
    });

    return () => unsubscribe();
  }, [userId, isProfileSetupComplete]);

  const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
    const errInfo = {
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
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const saveUserData = async (newRatings: Record<number, number>, newComments: Record<number, string>, newFavorites: string[]) => {
    if (!userId || !isProfileSetupComplete) {
      return;
    }

    console.log("saveUserData called with:", { newRatings, newComments, newFavorites });

    // 1. Save to Firestore
    try {
      await setDoc(doc(db, 'users', userId), {
        name: userName,
        avatar: userAvatar,
        ratings: newRatings,
        comments: newComments,
        favorites: newFavorites,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log("User data saved to Firestore successfully");
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${userId}`);
    }

    // 2. Save to LocalStorage (as cache/backup)
    const localData = {
      name: userName,
      avatar: userAvatar,
      ratings: newRatings,
      comments: newComments,
      favorites: newFavorites,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`br_data_${userId}`, JSON.stringify(localData));
    console.log("User data saved to LocalStorage");
  };

  const handleToggleFavorite = (friendId: string) => {
    const newFavorites = favorites.includes(friendId)
      ? favorites.filter(id => id !== friendId)
      : [...favorites, friendId];
    setFavorites(newFavorites);
    saveUserData(ratings, comments, newFavorites);
  };

  const handleReset = (id: number) => {
    const newRatings = { ...ratings, [id]: 0 };
    const newComments = { ...comments, [id]: '' };
    setRatings(newRatings);
    setComments(newComments);
    saveUserData(newRatings, newComments, favorites);
  };

  const handleRatingChange = (id: number, rating: number) => {
    console.log("handleRatingChange called:", id, rating, "current ratings:", ratings);
    const newRatings = { ...ratings, [id]: rating };
    console.log("newRatings:", newRatings);
    setRatings(newRatings);
    saveUserData(newRatings, comments, favorites);
  };

  const handleCommentChange = async (id: number, comment: string) => {
    console.log("handleCommentChange called:", id, comment);
    const newComments = { ...comments };
    
    if (comment.trim() === '') {
      delete newComments[id];
      if (userId) {
        try {
          console.log("Deleting comment from Firestore:", id);
          await updateDoc(doc(db, 'users', userId), {
            [`comments.${id}`]: deleteField()
          });
          console.log("Comment deleted from Firestore");
        } catch (error) {
          handleFirestoreError(error, 'write', `users/${userId}`);
        }
      }
    } else {
      newComments[id] = comment;
      if (userId) {
        try {
          console.log("Updating comment in Firestore:", id, comment);
          await updateDoc(doc(db, 'users', userId), {
            [`comments.${id}`]: comment
          });
          console.log("Comment updated in Firestore");
        } catch (error) {
          handleFirestoreError(error, 'write', `users/${userId}`);
        }
      }
    }
    
    setComments(newComments);
  };

  const filteredMenu = useMemo(() => {
    const filtered = menuData.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });

    if (sortOrder === 'rating') {
      return filtered.sort((a, b) => {
        const ratingA = ratings[a.id] || 0;
        const ratingB = ratings[b.id] || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return a.name.localeCompare(b.name);
      });
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, sortOrder, ratings]);

  const ratedItems = useMemo(() => filteredMenu.filter(item => ratings[item.id] > 0), [filteredMenu, ratings]);
  const unratedItems = useMemo(() => filteredMenu.filter(item => !ratings[item.id] || ratings[item.id] === 0), [filteredMenu, ratings]);

  const displayItems = useMemo(() => {
    if (ratingFilter === 'rated') return ratedItems;
    if (ratingFilter === 'unrated') return unratedItems;
    return filteredMenu;
  }, [filteredMenu, ratedItems, unratedItems, ratingFilter]);

  const handleLogin = (name: string, avatar: string) => {
    // Handled by onAuthStateChanged
  };

  const handleProfileSubmit = async (name: string, avatar: string) => {
    if (!userId) return;
    if (name.length > 8) {
      setProfileError("이름은 8자까지 입력 가능합니다.");
      return;
    }
    setProfileError(null);

    // 1. Save to Firestore
    try {
      await setDoc(doc(db, 'users', userId), {
        name,
        avatar,
        ratings: ratings || {},
        comments: comments || {},
        favorites: favorites || [],
        updatedAt: serverTimestamp()
      });
      console.log("Profile saved to Firestore");
    } catch (error) {
      handleFirestoreError(error, 'write', `users/${userId}`);
      setProfileError("프로필 저장 중 오류가 발생했습니다.");
      return;
    }

    // 2. Save to LocalStorage (as cache/backup)
    const localData = {
      name,
      avatar,
      ratings: ratings || {},
      comments: comments || {},
      favorites: favorites || [],
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`br_data_${userId}`, JSON.stringify(localData));
    
    setUserName(name);
    setUserAvatar(avatar);
    setIsProfileSetupComplete(true);
    setIsEditingProfile(false);
    history.back();
    console.log("Profile saved to LocalStorage");
  };

  const handleDeleteAccount = async () => {
    if (!userId || !auth.currentUser) return;

    try {
      // 1. Delete Firestore document
      await deleteDoc(doc(db, 'users', userId));
      
      // 2. Delete LocalStorage data
      localStorage.removeItem(`br_data_${userId}`);
      
      // 3. Delete Firebase Auth user
      await deleteUser(auth.currentUser);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        try {
          // Re-authenticate
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(auth.currentUser, provider);
          // Retry deletion
          await handleDeleteAccount();
        } catch (reauthError) {
          console.error("Re-authentication failed:", reauthError);
        }
      } else {
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      console.log("popstate event triggered", { isTierModalOpen, isEditingProfile, viewingFriend, view, selectedItem, isFeedbackOpen });
      if (selectedItem) setSelectedItem(null);
      else if (isFeedbackOpen) setIsFeedbackOpen(false);
      else if (isTierModalOpen) setIsTierModalOpen(false);
      else if (isEditingProfile) setIsEditingProfile(false);
      else if (viewingFriend) { setViewingFriend(null); setView('social'); setSocialHasFriendSelected(false); }
      else if (view !== 'list') { setView('list'); setSocialHasFriendSelected(false); }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isTierModalOpen, isEditingProfile, viewingFriend, view, selectedItem, isFeedbackOpen]);

  const handleViewFriendStats = (friend: FriendType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, '');
    setViewingFriend(friend);
    setView('analytics');
  };

  const handleNavClick = (newView: 'list' | 'analytics' | 'social') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (newView !== 'list') history.pushState(null, '');
    setView(newView);
    setViewingFriend(null);
    setSocialHasFriendSelected(false);
  };

  const handleCountClick = () => {
    // No longer needed
  };

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-br-pink"></div></div>;
  }

  if (!userId) {
    return <Login onLogin={handleLogin} />;
  }

  const ratedCount = Object.values(ratings).filter(r => (r as number) > 0).length;
  console.log("App ratings:", JSON.stringify(ratings), "ratedCount:", ratedCount);
  const tier = getTier(ratedCount);

  const gridClass = "grid grid-cols-3 gap-3";

  if (!isProfileSetupComplete || isEditingProfile) {
    return (
      <NameInput 
        onSubmit={handleProfileSubmit} 
        onCancel={isProfileSetupComplete ? () => {
          setProfileError(null);
          history.back();
        } : undefined}
        initialName={userName || ''} 
        initialAvatar={userAvatar || '🍦'} 
        error={profileError}
          onDelete={isProfileSetupComplete ? handleDeleteAccount : undefined}
        onLogout={isProfileSetupComplete ? handleLogout : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 relative pb-28">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between relative">
          <div className="flex items-center gap-2 shrink-0 z-10">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Baskin-Robbins_logo.svg/3840px-Baskin-Robbins_logo.svg.png" 
              alt="BR Logo" 
              className="h-5 sm:h-6 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="h-4 w-px bg-gray-200"></div>
          </div>
          
          <div className="flex-1 flex items-center justify-start pointer-events-none px-2 sm:px-4 overflow-visible">
            <h1 className="text-br-blue font-bold tracking-tight text-[11px] sm:text-sm truncate flex items-center gap-1">
              <span className="text-sm sm:text-lg shrink-0">{userAvatar}</span>
              <span className="truncate">
                <span className="truncate">{userName}</span>{getJosa(userName)} 좋아하는
                <span className="hidden sm:inline"> 배스킨라빈스 31</span>
                <span className="sm:hidden"> 배스킨라빈스 31</span>
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 z-10">
            <button 
              onClick={() => { history.pushState(null, ''); setIsFeedbackOpen(true); }}
              className="p-1.5 text-gray-400 hover:text-br-pink hover:bg-pink-50 rounded-full transition-all"
              title="피드백 보내기"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                history.pushState(null, '');
                setIsEditingProfile(true);
              }}
              className="p-1.5 text-gray-400 hover:text-br-blue hover:bg-blue-50 rounded-full transition-all"
              title="프로필 수정"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {view === 'list' ? (
          <>
            {filteredMenu.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍦</span>
                </div>
                <p className="text-gray-500 font-medium">조건에 맞는 아이스크림이 없어요.</p>
              </div>
            ) : (
              <div className="pb-32">
                <div className="flex items-center justify-between mb-6 px-1">
                  <h2 className="text-xl font-black text-br-blue flex items-baseline gap-2">
                    {ratingFilter === 'all' ? '전체 아이스크림' : ratingFilter === 'rated' ? '내가 평가한 맛' : '아직 평가하지 않은 맛'}
                    <span className="inline-flex items-center justify-center text-sm font-bold text-gray-400 bg-[#e8e9f0] px-2 py-0.5 rounded-full ml-1">
                      {ratingFilter === 'all' ? filteredMenu.length : ratingFilter === 'rated' ? ratedItems.length : unratedItems.length}
                    </span>
                  </h2>
                  {ratingFilter !== 'unrated' && (
                    <button
                      onClick={() => { setSortOrder(s => s === 'name' ? 'rating' : 'name'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 hover:bg-br-pink/10 hover:text-br-pink transition-all duration-200 whitespace-nowrap shrink-0"
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      {sortOrder === 'name' ? '이름순' : '별점순'}
                    </button>
                  )}
                </div>

                <div className="space-y-10">
                  <section>
                    <div className={gridClass}>
                      {displayItems.map(item => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          rating={ratings[item.id] || 0}
                          comment={comments[item.id] || ''}
                          onRatingChange={handleRatingChange}
                          onCommentChange={handleCommentChange}
                          onReset={handleReset}
                          mode="mini"
                          onClick={() => {
                history.pushState(null, '');
                setSelectedItem(item);
              }}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* Search and Filter Bar (Bottom Stack) */}
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 w-[80%] max-w-sm space-y-2">
              <div className="bg-white/95 backdrop-blur-xl p-2 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200/80 mb-[-43px]">
                <div className="mb-1.5">
                  <FilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>
                <div className="flex w-full items-center gap-2">
                  <div className="flex-1 flex items-center bg-gray-100 p-0.5 rounded-full whitespace-nowrap">
                    <button
                      onClick={() => { setRatingFilter('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 px-2 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 ${
                        ratingFilter === 'all' ? 'bg-white text-br-blue shadow-sm scale-100' : 'text-gray-600 hover:text-br-blue hover:bg-white/50 scale-95'
                      }`}
                    >
                      전체보기
                    </button>
                    <button
                      onClick={() => { setRatingFilter('rated'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 px-2 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 ${
                        ratingFilter === 'rated' ? 'bg-white text-br-pink shadow-sm scale-100' : 'text-gray-600 hover:text-br-pink hover:bg-white/50 scale-95'
                      }`}
                    >
                      평가한 맛
                    </button>
                    <button
                      onClick={() => { setRatingFilter('unrated'); setSortOrder('name'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 px-2 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 ${
                        ratingFilter === 'unrated' ? 'bg-white text-gray-800 shadow-sm scale-100' : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 scale-95'
                      }`}
                    >
                      미평가
                    </button>
                  </div>
                </div>
              </div>
              {/* Visual Connector to Nav Bar */}
              <div className="flex justify-center">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </>
        ) : view === 'analytics' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            {viewingFriend && (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setViewingFriend(null);
                    setView('social');
                  }}
                  className="flex items-center gap-1.5 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm border border-br-blue/10"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  돌아가기
                </button>
                <div className="bg-br-blue-light/20 text-br-blue px-6 py-4 rounded-2xl flex items-center gap-3">
                  <span className="text-3xl">{viewingFriend.avatar}</span>
                  <h2 className="font-black text-lg">{viewingFriend.name}님의 통계</h2>
                </div>
              </div>
            )}
            <Analytics 
              ratings={viewingFriend ? viewingFriend.ratings : ratings} 
              comments={viewingFriend ? {} : comments} 
              menuData={menuData} 
              onRatingChange={handleRatingChange}
              onCommentChange={handleCommentChange}
              isReadOnly={!!viewingFriend}
            />
          </div>
        ) : (
          <>
            <SocialStats
              myRatings={ratings}
              myComments={comments}
              myName={userName}
              myAvatar={userAvatar}
              menuData={menuData}
              onViewFriendStats={handleViewFriendStats}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              activeTab={socialTab}
              setActiveTab={setSocialTab}
              onRatingChange={handleRatingChange}
              onCommentChange={handleCommentChange}
              searchQuery={socialSearchQuery}
              onSearchQueryChange={setSocialSearchQuery}
              onSelectedFriendChange={(f) => setSocialHasFriendSelected(!!f)}
            />
            {!socialHasFriendSelected && (
              <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 w-[80%] max-w-sm space-y-2">
                <div className="bg-white/95 backdrop-blur-xl p-2 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200/80 mb-[-43px]">
                  {socialTab !== 'awards' && (
                    <div className="relative mb-1.5">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Search className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder={socialTab === 'global' ? "맛 이름이나 태그를 검색해보세요" : "친구 닉네임을 검색해보세요"}
                        value={socialSearchQuery}
                        onChange={(e) => setSocialSearchQuery(e.target.value)}
                        className="block w-full pl-9 pr-4 py-1.5 border border-gray-100 rounded-full leading-4 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-br-pink text-[10px] transition-all"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSocialTab('global'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                        socialTab === 'global'
                          ? 'bg-br-blue text-white shadow-[0_3px_10px_rgba(0,82,155,0.3)]'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      글로벌 랭킹
                    </button>
                    <button
                      onClick={() => { setSocialTab('friends'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                        socialTab === 'friends'
                          ? 'bg-br-pink text-white shadow-[0_3px_10px_rgba(255,42,112,0.3)]'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      친구 취향 탐구
                    </button>
                    <button
                      onClick={() => { setSocialTab('awards'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                        socialTab === 'awards'
                          ? 'bg-gray-800 text-white shadow-[0_3px_10px_rgba(0,0,0,0.2)]'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      어워드
                    </button>
                  </div>
                </div>
                {/* Visual Connector to Nav Bar */}
                <div className="flex justify-center">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-2 h-16">
          <button
            onClick={() => handleNavClick('list')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 ${
              view === 'list'
                ? 'text-br-blue'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-200 ${view === 'list' ? 'bg-blue-50' : ''}`}>
              <IceCreamCone className="w-5 h-5" strokeWidth={view === 'list' ? 2.5 : 1.8} />
            </div>
            <span className="text-[10px] font-bold">맛 리스트</span>
          </button>
          <button
            onClick={() => handleNavClick('analytics')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 ${
              view === 'analytics' && !viewingFriend
                ? 'text-br-pink'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-200 ${view === 'analytics' && !viewingFriend ? 'bg-pink-50' : ''}`}>
              <BarChart3 className="w-5 h-5" strokeWidth={view === 'analytics' && !viewingFriend ? 2.5 : 1.8} />
            </div>
            <span className="text-[10px] font-bold">나의 통계</span>
          </button>
          <button
            onClick={() => handleNavClick('social')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 ${
              view === 'social'
                ? 'text-purple-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-200 ${view === 'social' ? 'bg-purple-50' : ''}`}>
              <Users className="w-5 h-5" strokeWidth={view === 'social' ? 2.5 : 1.8} />
            </div>
            <span className="text-[10px] font-bold">소셜</span>
          </button>
        </div>
      </div>

      <TierInfoModal 
        isOpen={isTierModalOpen} 
        onClose={() => setIsTierModalOpen(false)} 
      />

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div 
            className="w-full max-w-md relative max-h-[90vh] overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-800 hover:bg-white transition-colors shadow-sm"
            >
              <X size={20} />
            </button>
            <MenuCard
              item={selectedItem}
              rating={ratings[selectedItem.id] || 0}
              comment={comments[selectedItem.id] || ''}
              onRatingChange={handleRatingChange}
              onCommentChange={handleCommentChange}
              onReset={handleReset}
              mode="detailed"
            />
          </div>
        </div>
      )}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
