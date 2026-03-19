import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface FeedbackItem {
  id: string;
  text: string;
  email: string;
  createdAt: any;
}

export const AdminFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    if (auth.currentUser?.email !== 'b2record47@gmail.com') return;

    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FeedbackItem[];
      setFeedbackList(list);
    });

    return () => unsubscribe();
  }, []);

  if (auth.currentUser?.email !== 'b2record47@gmail.com') return null;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3">관리자 피드백 확인</h3>
      <div className="space-y-2">
        {feedbackList.map(item => (
          <div key={item.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
            <p className="font-bold text-gray-700">{item.email}</p>
            <p className="text-gray-600 mt-1">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
