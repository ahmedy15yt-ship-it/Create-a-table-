import React, { useEffect } from 'react';
import { BellRing, X, Timer } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  body: string;
  taskTitle?: string;
}

interface InAppNotificationToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  onOpenTimer?: (taskTitle: string) => void;
}

export const InAppNotificationToast: React.FC<InAppNotificationToastProps> = ({
  toast,
  onClose,
  onOpenTimer,
}) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none animate-slideDown">
      <div className="pointer-events-auto bg-[#0a142c]/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-blue-500/40 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5 shadow-sm shadow-blue-500/30">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.body}</p>

            {onOpenTimer && toast.taskTitle && (
              <button
                onClick={() => {
                  onOpenTimer(toast.taskTitle || '');
                  onClose();
                }}
                className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Timer className="w-3.5 h-3.5" />
                <span>بدء مؤقت التركيز لهذه المهمة</span>
                <span aria-hidden="true">←</span>
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0 cursor-pointer"
          aria-label="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
