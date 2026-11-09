/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SubjectSelector } from './components/SubjectSelector';
import { PlanConfigurator } from './components/PlanConfigurator';
import { ScheduleView } from './components/ScheduleView';
import { ScheduleImagePoster } from './components/ScheduleImagePoster';
import { PomodoroTimer } from './components/PomodoroTimer';
import { StudyTips } from './components/StudyTips';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { InAppNotificationToast, ToastMessage } from './components/InAppNotificationToast';
import { StudentPreferences, GeneratedPlan, DayTask } from './types/curriculum';
import { generateStudyPlan } from './utils/planGenerator';
import { SCI_BIO_SUBJECTS } from './data/curriculumData';
import {
  NotificationConfig,
  DEFAULT_NOTIFICATION_CONFIG,
  sendStudyNotification,
  requestNotificationPermission,
} from './utils/notificationService';
import { Calendar, Download, Sparkles, BookOpen, Clock, Lightbulb, Bell, Globe } from 'lucide-react';

const STORAGE_PREFS_KEY = 'thanaweya_sci_bio_prefs_v2';
const STORAGE_PLAN_KEY = 'thanaweya_sci_bio_plan_v2';
const STORAGE_NOTIF_KEY = 'thanaweya_sci_bio_notif_v1';

export default function App() {
  // Default selected individual lessons
  const defaultSelectedLessons: { [subId: string]: string[] } = {
    biology: ['bio_l_10', 'bio_l_11', 'bio_l_12', 'bio_l_16', 'bio_l_18', 'bio_l_22'],
    chemistry: ['chem_l_14', 'chem_l_17', 'chem_l_19', 'chem_l_20', 'chem_l_22'],
    physics: ['phy_l_7', 'phy_l_10', 'phy_l_11', 'phy_l_13'],
    geology: ['geo_l_2', 'geo_l_5'],
  };

  const getTodayStr = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [preferences, setPreferences] = useState<StudentPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedLessons) {
          return parsed;
        }
      }
    } catch (e) {}

    return {
      studentName: 'طبيب المستقبل',
      totalDays: 7,
      dailyHours: 8,
      startDate: getTodayStr(),
      strategy: 'balanced',
      selectedLessons: defaultSelectedLessons,
    };
  });

  const [activeTab, setActiveTab] = useState<'select' | 'plan' | 'schedule' | 'poster' | 'timer' | 'tips'>('select');

  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PLAN_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    return generateStudyPlan({
      studentName: 'طبيب المستقبل',
      totalDays: 7,
      dailyHours: 8,
      startDate: getTodayStr(),
      strategy: 'balanced',
      selectedLessons: defaultSelectedLessons,
    });
  });

  // Notification configuration state
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIF_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return DEFAULT_NOTIFICATION_CONFIG;
  });

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [inAppToast, setInAppToast] = useState<ToastMessage | null>(null);

  // Track session reminders triggered today to prevent duplicate popups
  const triggeredDailySessionsRef = useRef<{ [key: string]: boolean }>({});

  // Pomodoro timer target
  const [timerTarget, setTimerTarget] = useState<{ title: string; minutes: number }>({
    title: 'مذاكرة وحل أسئلة متراكمة',
    minutes: 25,
  });

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(preferences));
    } catch (e) {}
  }, [preferences]);

  // Save generated plan
  useEffect(() => {
    if (generatedPlan) {
      try {
        localStorage.setItem(STORAGE_PLAN_KEY, JSON.stringify(generatedPlan));
      } catch (e) {}
    }
  }, [generatedPlan]);

  // Save notification config
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(notificationConfig));
    } catch (e) {}
  }, [notificationConfig]);

  const triggerToast = (title: string, body: string, taskTitle?: string) => {
    setInAppToast({
      id: `toast_${Date.now()}`,
      title,
      body,
      taskTitle,
    });
  };

  // Background reminder scheduler interval
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().split('T')[0];

      // 1. Check daily session time reminders if notifications are enabled
      if (notificationConfig.enabled) {
        const sessions = [
          {
            key: 'morning',
            time: notificationConfig.morningTime,
            title: '☀️ حان وقت الفترة الصباحية!',
            desc: 'ابدأ بمذاكرة المفاهيم والقوانين الجديدة وأنت في كامل تركيزك.',
          },
          {
            key: 'afternoon',
            time: notificationConfig.afternoonTime,
            title: '🌤️ حان وقت فترة بعد الظهيرة!',
            desc: 'وقت التمارين والمسائل وحل البابل شيت وتثبيت ما ذاكرته.',
          },
          {
            key: 'evening',
            time: notificationConfig.eveningTime,
            title: '🌙 حان وقت الفترة المسائية!',
            desc: 'مراجعة خفيفة للكلمات والنحو والقواعد ووضع علامة صح على إنجازك.',
          },
        ];

        sessions.forEach((session) => {
          const sessionKey = `${todayDateStr}_${session.key}`;
          if (currentTimeStr === session.time && !triggeredDailySessionsRef.current[sessionKey]) {
            triggeredDailySessionsRef.current[sessionKey] = true;
            sendStudyNotification(
              session.title,
              session.desc,
              triggerToast,
              notificationConfig.soundEnabled
            );
          }
        });
      }

      // 2. Check scheduled individual task reminders
      const reminders = notificationConfig.scheduledReminders || {};
      const nowTimestamp = now.getTime();
      let hasRemovals = false;
      const updatedReminders = { ...reminders };

      Object.entries(reminders).forEach(([taskId, rem]) => {
        const scheduledTime = new Date(rem.scheduledTime).getTime();
        if (nowTimestamp >= scheduledTime) {
          hasRemovals = true;
          delete updatedReminders[taskId];

          sendStudyNotification(
            '🔔 تذكير جلسة المذاكرة المجدولة!',
            `حان موعد البدء في: ${rem.title} - توكل على الله وافتح مؤقت التركيز! 🎯`,
            (title, body) => triggerToast(title, body, rem.title),
            notificationConfig.soundEnabled
          );
        }
      });

      if (hasRemovals) {
        setNotificationConfig((prev) => ({
          ...prev,
          scheduledReminders: updatedReminders,
        }));
      }
    };

    const interval = setInterval(checkReminders, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [notificationConfig]);

  // Handlers for lesson selection
  const handleToggleLesson = (subjectId: string, lessonId: string) => {
    setPreferences((prev) => {
      const current = prev.selectedLessons[subjectId] || [];
      const updated = current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId];

      const newSelected = { ...prev.selectedLessons, [subjectId]: updated };
      return { ...prev, selectedLessons: newSelected };
    });
  };

  const handleSelectAllChapterLessons = (
    subjectId: string,
    chapterId: string,
    selectAll: boolean
  ) => {
    const subject = SCI_BIO_SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return;

    const chapter = subject.chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    const chapterLessonIds = chapter.lessons.map((l) => l.id);

    setPreferences((prev) => {
      const current = prev.selectedLessons[subjectId] || [];
      let updated: string[];

      if (selectAll) {
        updated = Array.from(new Set([...current, ...chapterLessonIds]));
      } else {
        updated = current.filter((id) => !chapterLessonIds.includes(id));
      }

      return {
        ...prev,
        selectedLessons: { ...prev.selectedLessons, [subjectId]: updated },
      };
    });
  };

  const handleSelectAllSubject = (subjectId: string, selectAll: boolean) => {
    const subject = SCI_BIO_SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return;

    const allSubjectLessonIds = subject.chapters.flatMap((c) => c.lessons.map((l) => l.id));

    setPreferences((prev) => {
      const newSelected = {
        ...prev.selectedLessons,
        [subjectId]: selectAll ? allSubjectLessonIds : [],
      };
      return { ...prev, selectedLessons: newSelected };
    });
  };

  const handleSelectEntireCurriculum = () => {
    const allSelected: { [subId: string]: string[] } = {};
    SCI_BIO_SUBJECTS.forEach((sub) => {
      allSelected[sub.id] = sub.chapters.flatMap((c) => c.lessons.map((l) => l.id));
    });
    setPreferences((prev) => ({ ...prev, selectedLessons: allSelected }));
  };

  const handleClearAll = () => {
    setPreferences((prev) => ({ ...prev, selectedLessons: {} }));
  };

  const handleUpdatePreferences = (updates: Partial<StudentPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  // Trigger Plan Generation
  const handleGeneratePlan = () => {
    const plan = generateStudyPlan(preferences);
    setGeneratedPlan(plan);
    setActiveTab('poster');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle individual task completion in plan
  const handleToggleTask = (dayIndex: number, taskId: string) => {
    if (!generatedPlan) return;

    const newDays = [...generatedPlan.days];
    const targetDay = newDays[dayIndex];
    if (!targetDay) return;

    targetDay.tasks = targetDay.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    targetDay.completedTasksCount = targetDay.tasks.filter((t) => t.completed).length;

    setGeneratedPlan({
      ...generatedPlan,
      days: newDays,
    });
  };

  // Open timer for specific task
  const handleOpenTimerForTask = (taskTitle: string, minutes?: number) => {
    setTimerTarget({
      title: taskTitle,
      minutes: minutes ? Math.min(60, Math.max(15, minutes)) : 25,
    });
    setActiveTab('timer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Schedule or toggle a specific task reminder
  const handleScheduleTaskReminder = async (task: DayTask, minutesFromNow: number = 15) => {
    const currentReminders = notificationConfig.scheduledReminders || {};

    if (currentReminders[task.id]) {
      // Cancel existing reminder
      const updated = { ...currentReminders };
      delete updated[task.id];
      setNotificationConfig((prev) => ({ ...prev, scheduledReminders: updated }));
      triggerToast('تم إلغاء التذكير', `تم إلغاء التنبيه المجدول لمهمة: ${task.title}`);
      return;
    }

    // Request browser permission if not yet enabled
    const perm = await requestNotificationPermission();
    const scheduledTime = new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString();

    setNotificationConfig((prev) => ({
      ...prev,
      enabled: true,
      scheduledReminders: {
        ...prev.scheduledReminders,
        [task.id]: {
          taskId: task.id,
          title: task.title,
          scheduledTime,
        },
      },
    }));

    triggerToast(
      '🔔 تم جدولة التذكير بنجاح!',
      `سنرسل لك إشعاراً خلال ${minutesFromNow} دقيقة لبدء مذاكرة: ${task.title}`
    );
  };

  const totalSelectedLessonsCount = Object.values(preferences.selectedLessons).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab === 'poster' ? 'schedule' : activeTab}
        setActiveTab={(tab) => {
          if (tab === 'schedule' && generatedPlan) {
            setActiveTab('poster');
          } else {
            setActiveTab(tab);
          }
        }}
        hasPlan={Boolean(generatedPlan)}
        onGeneratePlan={handleGeneratePlan}
        notificationsEnabled={notificationConfig.enabled}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />

      {/* In-App Floating Notification Banner */}
      <InAppNotificationToast
        toast={inAppToast}
        onClose={() => setInAppToast(null)}
        onOpenTimer={(title) => handleOpenTimerForTask(title)}
      />

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        config={notificationConfig}
        onUpdateConfig={(updates) => setNotificationConfig((prev) => ({ ...prev, ...updates }))}
        onTriggerInAppToast={triggerToast}
      />

      {/* Mobile Quick Navigation Bar */}
      <div className="no-print md:hidden bg-[#091124] border-b border-[#18294e] px-4 py-2.5 flex items-center justify-between gap-1 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('select')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'select' ? 'bg-blue-600 text-white' : 'text-slate-300'
          }`}
        >
          1. اختيار الدروس
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'plan' ? 'bg-blue-600 text-white' : 'text-slate-300'
          }`}
        >
          2. عدد الأيام
        </button>
        <button
          onClick={() => setActiveTab('poster')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'poster' ? 'bg-blue-600 text-white' : 'text-slate-300'
          }`}
        >
          3. صورة الجدول
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'text-slate-300'
          }`}
        >
          المهام
        </button>
        <button
          onClick={() => setIsNotificationModalOpen(true)}
          className="px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer text-blue-300 bg-blue-900/40 border border-blue-800/60 flex items-center gap-1"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>الإشعارات</span>
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'timer' ? 'bg-blue-600 text-white' : 'text-slate-300'
          }`}
        >
          المؤقت
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'select' && (
          <SubjectSelector
            selectedLessons={preferences.selectedLessons}
            onToggleLesson={handleToggleLesson}
            onSelectAllChapterLessons={handleSelectAllChapterLessons}
            onSelectAllSubject={handleSelectAllSubject}
            onSelectEntireCurriculum={handleSelectEntireCurriculum}
            onClearAll={handleClearAll}
            onProceedToPlan={() => {
              setActiveTab('plan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'plan' && (
          <PlanConfigurator
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onGenerate={handleGeneratePlan}
            onBackToSubjects={() => setActiveTab('select')}
            selectedCount={totalSelectedLessonsCount}
          />
        )}

        {activeTab === 'poster' && generatedPlan && (
          <ScheduleImagePoster
            plan={generatedPlan}
            onModifyPlan={() => setActiveTab('plan')}
            onGoToInteractiveSchedule={() => {
              setActiveTab('schedule');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'schedule' && generatedPlan && (
          <ScheduleView
            plan={generatedPlan}
            onToggleTask={handleToggleTask}
            onOpenTimerForTask={handleOpenTimerForTask}
            onViewPosterImage={() => {
              setActiveTab('poster');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNotifications={() => setIsNotificationModalOpen(true)}
            scheduledReminders={notificationConfig.scheduledReminders}
            onScheduleTaskReminder={handleScheduleTaskReminder}
          />
        )}

        {activeTab === 'timer' && (
          <PomodoroTimer
            initialTaskName={timerTarget.title}
            initialMinutes={timerTarget.minutes}
            onBackToSchedule={() => setActiveTab('schedule')}
          />
        )}

        {activeTab === 'tips' && <StudyTips />}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-[#18294e] bg-[#091124] py-8 mt-12 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">موقع منقذ تالتة ثانوي علمي علوم</span>
              <span className="text-blue-400 font-bold">دفعة 2027</span>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div className="bg-blue-950/60 border border-blue-500/30 px-3.5 py-1.5 rounded-xl text-amber-300 font-bold">
              تم عمل هذا الموقع بواسطة: <strong className="text-white underline decoration-amber-400 underline-offset-2">أحمد يحيى</strong> — نسألكم الدعاء له بالتوفيق والسداد 🤲
            </div>
          </div>

          <p className="text-slate-400 text-center md:text-left leading-relaxed">
            «وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ وَأَنَّ سَعْيَهُ سَوْفَ يُرَىٰ» • اللهم وفّق كل طالب علم وسدد خُطاه
          </p>
        </div>
      </footer>
    </div>
  );
}
