import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Trash2,
} from 'lucide-react';
import {
  NotificationConfig,
  getNotificationPermission,
  requestNotificationPermission,
  sendStudyNotification,
} from '../utils/notificationService';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: NotificationConfig;
  onUpdateConfig: (updates: Partial<NotificationConfig>) => void;
  onTriggerInAppToast: (title: string, message: string) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onTriggerInAppToast,
}) => {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      onUpdateConfig({ enabled: true });
      sendStudyNotification(
        '🔔 تم تفعيل إشعارات جدول المذاكرة!',
        'سنذكرك بمواعيد جلساتك اليومية في الأوقات التي تختارها.',
        onTriggerInAppToast,
        config.soundEnabled
      );
    }
  };

  const handleSendTest = () => {
    setTestSent(true);
    sendStudyNotification(
      '🔔 حان وقت جلسة المذاكرة! (تجربة)',
      'هكذا سيصلك إشعار التذكير قبل موعد بدء درسك في جدول تالتة ثانوي. بالتوفيق يا بطل! 🎯',
      onTriggerInAppToast,
      config.soundEnabled
    );
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleRemoveReminder = (taskId: string) => {
    const updated = { ...config.scheduledReminders };
    delete updated[taskId];
    onUpdateConfig({ scheduledReminders: updated });
  };

  const remindersList = Object.values(config.scheduledReminders || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#091226] text-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#192b52] overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#16274b] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                إشعارات وتذكيرات جلسات المذاكرة
              </h3>
              <p className="text-xs text-slate-400">
                جدولة إشعارات المتصفح لتنبيهك عند بدء كل فترة دراسية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#101b38] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Status */}
        <div className="mb-6 p-4 rounded-2xl border bg-[#060c1c] border-[#16274b] flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">
              حالة إذن إشعارات المتصفح:
            </span>
            {permission === 'granted' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-500/40 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>مسموح ومفعل بنجاح</span>
              </span>
            ) : permission === 'denied' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-950/80 border border-rose-500/40 px-2.5 py-1 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>تم الرفض في إعدادات المتصفح</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>بانتظار منح الإذن من المتصفح</span>
              </span>
            )}
          </div>

          {permission !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 cursor-pointer shrink-0"
            >
              منح الإذن الآن
            </button>
          )}
        </div>

        {/* Global Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0d1836] border border-[#1b2e59] mb-6">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                تفعيل الإشعارات والتذكيرات اليومية
              </span>
              <span className="text-[11px] text-slate-400">
                تلقي إشعارات على جهازك بمواعيد بدء الفترات الدراسية
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onUpdateConfig({ enabled: e.target.checked })}
            className="w-5 h-5 accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Daily Session Reminder Times */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>مواعيد تذكيرات الفترات الدراسية اليومية:</span>
          </h4>

          {/* Morning Period */}
          <div className="p-3 bg-[#060c1c] rounded-xl border border-[#16274b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">الفترة الصباحية</span>
                <span className="text-[10px] text-slate-400">مفاهيم صعبة وتركيز عالي</span>
              </div>
            </div>
            <input
              type="time"
              value={config.morningTime}
              onChange={(e) => onUpdateConfig({ morningTime: e.target.value })}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-[#0d1836] text-white rounded-lg border border-[#1d315f] focus:border-blue-500 outline-none"
            />
          </div>

          {/* Afternoon Period */}
          <div className="p-3 bg-[#060c1c] rounded-xl border border-[#16274b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-xs font-bold text-white block">فترة بعد الظهيرة</span>
                <span className="text-[10px] text-slate-400">حل تدريبات وتمارين وبابل شيت</span>
              </div>
            </div>
            <input
              type="time"
              value={config.afternoonTime}
              onChange={(e) => onUpdateConfig({ afternoonTime: e.target.value })}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-[#0d1836] text-white rounded-lg border border-[#1d315f] focus:border-blue-500 outline-none"
            />
          </div>

          {/* Evening Period */}
          <div className="p-3 bg-[#060c1c] rounded-xl border border-[#16274b] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-white block">الفترة المسائية</span>
                <span className="text-[10px] text-slate-400">مراجعة وتلخيص لغويات</span>
              </div>
            </div>
            <input
              type="time"
              value={config.eveningTime}
              onChange={(e) => onUpdateConfig({ eveningTime: e.target.value })}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-[#0d1836] text-white rounded-lg border border-[#1d315f] focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Lead Time & Sound Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-[#060c1c] rounded-xl border border-[#16274b]">
            <span className="text-[11px] font-bold text-slate-300 block mb-1">
              التنبيه قبل البدء بـ:
            </span>
            <select
              value={config.leadMinutes}
              onChange={(e) => onUpdateConfig({ leadMinutes: parseInt(e.target.value, 10) })}
              className="w-full text-xs font-bold bg-[#0d1836] text-white p-1.5 rounded-lg border border-[#1d315f] focus:border-blue-500 outline-none"
            >
              <option value={0}>في نفس الموعد بالضبط</option>
              <option value={5}>قبل 5 دقائق</option>
              <option value={10}>قبل 10 دقائق</option>
              <option value={15}>قبل 15 دقيقة</option>
            </select>
          </div>

          <div className="p-3 bg-[#060c1c] rounded-xl border border-[#16274b] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-300 block">رنين صوتي</span>
              <span className="text-[10px] text-slate-400">جرس تنبيه هادئ</span>
            </div>
            <button
              onClick={() => onUpdateConfig({ soundEnabled: !config.soundEnabled })}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                config.soundEnabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#101b38] text-slate-400'
              }`}
            >
              {config.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Scheduled Task Reminders List */}
        {remindersList.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-300 mb-2">
              التذكيرات المجدولة لدروس معينة ({remindersList.length}):
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-[#16274b] p-2.5 bg-[#060c1c] rounded-xl border border-[#16274b]">
              {remindersList.map((rem) => (
                <div key={rem.taskId} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                  <div className="truncate pl-2">
                    <span className="font-bold text-white block truncate">{rem.title}</span>
                    <span className="text-[10px] text-blue-400">
                      {new Date(rem.scheduledTime).toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveReminder(rem.taskId)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer shrink-0"
                    title="إلغاء التذكير"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test and Close Actions */}
        <div className="pt-4 border-t border-[#16274b] flex items-center justify-between gap-3">
          <button
            onClick={handleSendTest}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-[#101c38] hover:bg-[#16254d] border border-[#1e3260] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{testSent ? 'تم إرسال الإشعار!' : 'إرسال إشعار تجريبي الآن'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
