import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

interface LoginProps {
  onLogin: (name: string, avatar: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    // Handle redirect-based OAuth (for embedded browsers like KakaoTalk)
    const stored = sessionStorage.getItem('oauth_payload');
    if (stored) {
      sessionStorage.removeItem('oauth_payload');
      try {
        const payload = JSON.parse(atob(stored));
        if (payload?.idToken) {
          const credential = GoogleAuthProvider.credential(payload.idToken);
          signInWithCredential(auth, credential).then(() => {
            onLogin(payload.name || '아이스크림러버', '🍦');
          }).catch(() => {
            onLogin(payload.name || '아이스크림러버', '🍦');
          });
        } else {
          onLogin(payload?.name || '아이스크림러버', '🍦');
        }
      } catch (e) {
        console.error('Failed to parse oauth_payload', e);
      }
    }
  }, []);

  const handleSocialLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isEmbeddedBrowser = /KAKAOTALK|FBAN|FBAV|Instagram|Line/i.test(userAgent);

      // Get OAuth URL from server
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();

      if (isEmbeddedBrowser) {
        // Embedded browsers can't use popups — redirect the whole page
        window.location.href = url;
        return;
      }

      // Open popup to localhost OAuth endpoint (avoids firebaseapp.com block)
      const popup = window.open(url, 'google-auth', 'width=500,height=600');

      // Listen for OAuth callback message
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type !== 'OAUTH_AUTH_SUCCESS') return;
        window.removeEventListener('message', handleMessage);

        const { payload } = event.data;
        if (payload?.idToken) {
          // Use Google ID token to sign into Firebase Auth
          const credential = GoogleAuthProvider.credential(payload.idToken);
          await signInWithCredential(auth, credential);
        }
        onLogin(payload?.name || '아이스크림러버', '🍦');
      };
      window.addEventListener('message', handleMessage);
    } catch (err: any) {
      console.error('OAuth error:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FA]">
      <div className="bg-white rounded-[2.5rem] px-6 py-10 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md text-center border border-gray-100">
        <div className="mb-12">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Baskin-Robbins_logo.svg/3840px-Baskin-Robbins_logo.svg.png" 
            alt="Baskin Robbins" 
            className="h-16 mx-auto mb-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
            환영합니다
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed break-keep">
            내가 좋아하는 배스킨라빈스 맛을 평가하고<br/>
            친구들과 공유해보세요!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSocialLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:border-br-pink/30 hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all group disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google 계정으로 로그인
          </button>
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
