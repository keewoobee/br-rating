import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send } from 'lucide-react';

export const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        text: feedback,
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        createdAt: serverTimestamp(),
      });
      setFeedback('');
      setMessage('피드백이 전송되었습니다. 감사합니다!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      setMessage('피드백 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="맛 추가 요청이나 기능 의견을 남겨주세요!"
          className="flex-1 text-sm p-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-br-pink"
        />
        <button
          type="submit"
          disabled={isSending}
          className="p-2 bg-br-pink text-white rounded-xl hover:bg-br-pink/90 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
      {message && <p className="text-xs text-br-pink mt-2 font-bold">{message}</p>}
    </div>
  );
};
