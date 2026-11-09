import React from 'react';
import { Calendar, BookOpen, Clock, Download, Sparkles, Bell, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'select' | 'plan' | 'schedule' | 'timer' | 'tips';
  setActiveTab: (tab: 'select' | 'plan' | 'schedule' | 'timer' | 'tips') => void;
  hasPlan: boolean;
  onGeneratePlan: () => void;
  notificationsEnabled?: boolean;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasPlan,
  onGeneratePlan,
  notificationsEnabled,
  onOpenNotifications,
}) => {

  return (
    <header className="no-print sticky top-0 z-40 bg-[#091124]/95 backdrop-blur-md border-b border-[#18294e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with Ahmed Yehia credit & duaa */}
          <button
            onClick={() => setActiveTab('select')}
            className="flex items-center gap-2.5 text-right cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform border border-blue-400/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white whitespace-nowrap block leading-tight">
                  موقع منقذ تالتة ثانوي
                </span>
                <span className="hidden lg:inline-block text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  موقع أحمد يحيى 🤲
                </span>
              </div>
              <span className="text-[11px] font-medium text-blue-300 block leading-tight">
                علمي علوم 2027 (دفعة 2027) • <span className="text-amber-300/90 font-semibold">دعواتكم لأحمد يحيى بالتوفيق 🤲</span>
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('select')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'select'
                  ? 'text-blue-400 font-bold border-b-2 border-blue-500'
                  : ''
              }`}
            >
              1. اختيار المواد
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'plan'
                  ? 'text-blue-400 font-bold border-b-2 border-blue-500'
                  : ''
              }`}
            >
              2. مدة الخطة والأيام
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'schedule'
                  ? 'text-blue-400 font-bold border-b-2 border-blue-500'
                  : ''
              }`}
            >
              3. جدول المذاكرة والصورة
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'timer'
                  ? 'text-blue-400 font-bold border-b-2 border-blue-500'
                  : ''
              }`}
            >
              مؤقت التركيز
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeTab === 'tips'
                  ? 'text-blue-400 font-bold border-b-2 border-blue-500'
                  : ''
              }`}
            >
              نصائح المراجعة
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Notification Button */}
          <div className="flex items-center gap-2.5 shrink-0">

            <button
              onClick={onOpenNotifications}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                notificationsEnabled
                  ? 'bg-blue-900/50 text-blue-300 border-blue-500/60 hover:bg-blue-900/70'
                  : 'bg-[#101b38] text-slate-300 border-[#1f3261] hover:bg-[#18274f]'
              }`}
              title="إعدادات إشعارات وتذكير المذاكرة"
            >
              <Bell className="w-4 h-4" />
              {notificationsEnabled && (
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400 absolute top-1 left-1" />
              )}
            </button>

            {hasPlan ? (
              <button
                onClick={() => setActiveTab('schedule')}
                className="px-4 py-2 text-xs md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/30 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 rounded-xl"
              >
                <Calendar className="w-4 h-4" />
                <span>عرض الجدول والصورة</span>
              </button>
            ) : (
              <button
                onClick={onGeneratePlan}
                className="px-4 py-2 text-xs md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/30 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 rounded-xl"
              >
                <Sparkles className="w-4 h-4" />
                <span>إنشاء الخطة الآن</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
