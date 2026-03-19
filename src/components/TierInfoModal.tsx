import React from 'react';
import { X, Info } from 'lucide-react';
import { tiers } from '../data';

interface TierInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TierInfoModal: React.FC<TierInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-[280px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-br-blue text-white">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <h2 className="text-sm font-black">티어 설명표</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-0 max-h-[60vh] overflow-y-auto">
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
                    <div className="text-xs font-black text-gray-800">{tier.name}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-[11px] font-bold text-br-pink">{tier.minCount}개 이상</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-br-blue text-white rounded-xl text-xs font-black shadow-md hover:brightness-110 transition-all active:scale-[0.98]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
