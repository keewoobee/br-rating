import React, { useState } from 'react';
import { IceCream } from 'lucide-react';

interface NameInputProps {
  onSubmit: (name: string, avatar: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onLogout?: () => void;
  initialName?: string | null;
  initialAvatar?: string | null;
  error?: string | null;
}

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐧', '🐥', '🦆', '🦉', '🐙', '🐬', '🐳', '🦭', '🦦', '🦖', '🐢', '🦋', '🌸', '🍀', '🍓', '🧁', '🍦', '🍩', '🍪', '🍭', '🍬', '✨', '🌈', '☀️', '☁️'];

export const NameInput: React.FC<NameInputProps> = ({ onSubmit, onCancel, onDelete, onLogout, initialName, initialAvatar, error }) => {
  const [name, setName] = useState(onCancel ? (initialName || '') : '');
  const [avatar, setAvatar] = useState(initialAvatar || '🐶');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), avatar);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 sm:p-14 text-center border border-gray-100">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Baskin-Robbins_logo.svg/3840px-Baskin-Robbins_logo.svg.png" 
          alt="Baskin Robbins" 
          className="h-12 mx-auto mb-6 object-contain"
          referrerPolicy="no-referrer"
        />
        <p className="text-gray-500 mb-10 font-medium leading-relaxed">프로필 이모지와 이름을 설정하고<br/>시작해보세요!</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-left ml-1">프로필 이모지 선택</label>
            <div className="grid grid-cols-5 gap-3 mb-2 max-h-44 overflow-y-auto p-4 bg-gray-50 rounded-2xl border border-gray-100 hide-scrollbar">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl transition-all ${avatar === emoji ? 'bg-white border-2 border-br-pink scale-110 shadow-sm' : 'hover:bg-gray-200 border-2 border-transparent'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">이름(닉네임)</label>
              <span className="text-xs font-bold text-gray-400">{name.length}/8</span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className={`w-full px-6 py-4 bg-gray-50 border-2 ${error ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:outline-none focus:border-br-pink/50 focus:bg-white transition-all text-center text-lg font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium`}
              autoFocus
              maxLength={8}
            />
            {error && <p className="text-red-500 text-sm mt-2 text-left ml-1">{error}</p>}
          </div>
          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-[2] bg-br-blue hover:bg-br-blue/90 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md disabled:shadow-none"
            >
              {onCancel ? '저장하기' : '시작하기'}
            </button>
          </div>
        </form>
        <div className="mt-8 flex flex-col gap-3">
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full text-xs text-gray-500 hover:text-br-blue transition-colors py-2"
            >
              로그아웃
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full text-xs text-gray-500 hover:text-red-500 transition-colors py-2 border-t border-gray-100"
            >
              계정 탈퇴하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
