import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface InfoPopoverProps {
  title: string;
  content: React.ReactNode;
  align?: 'left' | 'center';
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({ title, content, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-0.5 text-gray-400 hover:text-br-blue hover:bg-blue-50 rounded-full transition-all"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:absolute sm:inset-auto sm:mt-2 sm:block pointer-events-none">
          <div className="w-64 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200 sm:left-1/2 sm:-translate-x-1/2 pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-br-blue">{title}</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className={`text-xs text-gray-600 leading-relaxed ${align === 'center' ? 'text-center' : 'text-left'}`}>
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
