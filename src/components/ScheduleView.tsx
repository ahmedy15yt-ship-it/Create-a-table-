import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Timer,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  Filter,
  Bell,
  BellRing,
} from 'lucide-react';
import { GeneratedPlan, DayTask } from '../types/curriculum';
import { SCI_BIO_SUBJECTS } from '../data/curriculumData';
import { ProgressCharts } from './ProgressCharts';

interface ScheduleViewProps {
  plan: GeneratedPlan;
  onToggleTask: (dayIndex: number, taskId: string) => void;
  onOpenTimerForTask: (taskTitle: string, minutes?: number) => void;
  onViewPosterImage: () => void;
  onOpenNotifications: () => void;
  scheduledReminders?: { [taskId: string]: { taskId: string; title: string; scheduledTime: string } };
  onScheduleTaskReminder: (task: DayTask, minutesFromNow: number) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  plan,
  onToggleTask,
  onOpenTimerForTask,
  onViewPosterImage,
  onOpenNotifications,
  scheduledReminders = {},
  onScheduleTaskReminder,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  const currentDay = plan.days[selectedDayIndex] || plan.days[0];

  const totalTasks = plan.days.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = plan.days.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const currentDayCompleted = currentDay.tasks.filter((t) => t.completed).length;
  const currentDayTotal = currentDay.tasks.length;

  const handleTaskClick = (dayIdx: number, task: DayTask) => {
    const willBeCompleted = !task.completed;
    onToggleTask(dayIdx, task.id);

    if (willBeCompleted) {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#3b82f6', '#60a5fa', '#38bdf8', '#fbbf24'],
        });
      } catch (e) {}
    }
  };

  const morningTasks = currentDay.tasks.filter((t) => t.period === 'morning');
  const afternoonTasks = currentDay.tasks.filter((t) => t.period === 'afternoon');
  const eveningTasks = currentDay.tasks.filter((t) => t.period === 'evening');

  const filterTask = (task: DayTask) => {
    if (filterMode === 'completed') return task.completed;
    if (filterMode === 'pending') return !task.completed;
    return true;
  };

  return (
    <div className="space-y-6 text-white">
      {/* Overall Progress Banner - Royal Blue Surface */}
      <div className="bg-[#091226] rounded-3xl p-6 sm:p-7 border border-[#192b52] shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                متابعة الخطة اليومية: {plan.studentName}
              </h2>
              <span className="text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-500/40 px-3 py-0.5 rounded-full">
                {plan.totalDays} أيام
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              ضع علامة صح أمام كل مهمة تنتهي منها، وتدرج في جدولك يوم بيوم.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={onOpenNotifications}
              className="px-3.5 py-2 text-xs font-bold text-blue-300 bg-blue-950/70 hover:bg-blue-900/60 border border-blue-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="جدولة إشعارات وتذكيرات الجلسات"
            >
              <Bell className="w-4 h-4 text-blue-400" />
              <span>تذكيرات الجلسات</span>
            </button>

            <button
              onClick={onViewPosterImage}
              className="px-4 py-2 text-xs font-bold text-slate-200 bg-[#101c38] hover:bg-[#15254b] border border-[#1f3463] rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>تحميل البوستر وصورة الجدول</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 text-xs font-bold text-slate-200 bg-[#101c38] hover:bg-[#15254b] border border-[#1f3463] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>طباعة</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">
              نسبة إنجاز المتراكم الكلي:{' '}
              <strong className="text-blue-400">{progressPercent}%</strong>
            </span>
            <span className="text-slate-400 tabular-nums">
              ({completedTasks} من {totalTasks} مهام منجزة)
            </span>
          </div>
          <div className="w-full bg-[#060b18] rounded-full h-3 overflow-hidden p-0.5 border border-[#132247]">
            <div
              className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-blue-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recharts Graphical Study Progress Analytics Component */}
      <ProgressCharts plan={plan} />

      {/* Day Selector Tabs (Horizontal Scroll) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {plan.days.map((day, idx) => {
          const isSelected = idx === selectedDayIndex;
          const isCompleted = day.tasks.length > 0 && day.tasks.every((t) => t.completed);
          const dayDoneCount = day.tasks.filter((t) => t.completed).length;

          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayIndex(idx)}
              className={`shrink-0 px-4 py-3 rounded-2xl border text-right transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 font-bold scale-[1.02]'
                  : 'bg-[#0a1329] hover:bg-[#0e1b38] text-slate-300 border-[#172a54]'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs mb-1">
                <span className="font-black">اليوم {day.dayNumber}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" />
                ) : (
                  <span
                    className={`text-[10px] tabular-nums font-semibold ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {dayDoneCount}/{day.tasks.length}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] block truncate max-w-[120px] ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}
              >
                {day.dayNameArabic} • {day.dateStr}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Day Details Banner */}
      <div className="bg-gradient-to-r from-[#0c1630] via-[#112146] to-[#091226] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#1e3363] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1.5">
            <Calendar className="w-4 h-4" />
            <span>
              {currentDay.dayNameArabic} • {currentDay.dateStr} (اليوم {currentDay.dayNumber} من{' '}
              {plan.totalDays})
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {currentDay.focusTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 flex items-center gap-1.5">
            <span>💡 نصيحة اليوم: </span>
            <span className="italic">{currentDay.quote}</span>
          </p>
        </div>

        {/* Filter modes */}
        <div className="flex items-center gap-1.5 bg-[#070e20] p-1 rounded-xl border border-[#172952] text-xs shrink-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({currentDayTotal})
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المتبقي ({currentDayTotal - currentDayCompleted})
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'completed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المنجز ({currentDayCompleted})
          </button>
        </div>
      </div>

      {/* Task Periods Container */}
      <div className="space-y-6">
        {morningTasks.filter(filterTask).length > 0 && (
          <PeriodBlock
            title="الفترة الصباحية (تركيز عميق على المفاهيم الصعبة)"
            timeWindow="08:00 ص – 12:30 م"
            icon={<Sun className="w-5 h-5 text-amber-400" />}
            tasks={morningTasks.filter(filterTask)}
            dayIdx={selectedDayIndex}
            onToggle={handleTaskClick}
            onOpenTimer={onOpenTimerForTask}
            scheduledReminders={scheduledReminders}
            onScheduleTaskReminder={onScheduleTaskReminder}
          />
        )}

        {afternoonTasks.filter(filterTask).length > 0 && (
          <PeriodBlock
            title="فترة بعد الظهيرة (حل تمارين ومسائل وتطبيقات)"
            timeWindow="02:00 م – 06:00 م"
            icon={<Sunset className="w-5 h-5 text-orange-400" />}
            tasks={afternoonTasks.filter(filterTask)}
            dayIdx={selectedDayIndex}
            onToggle={handleTaskClick}
            onOpenTimer={onOpenTimerForTask}
            scheduledReminders={scheduledReminders}
            onScheduleTaskReminder={onScheduleTaskReminder}
          />
        )}

        {eveningTasks.filter(filterTask).length > 0 && (
          <PeriodBlock
            title="الفترة المسائية (مراجعة سريعة وتثبيت وحل بابل شيت)"
            timeWindow="07:30 م – 10:30 م"
            icon={<Moon className="w-5 h-5 text-blue-400" />}
            tasks={eveningTasks.filter(filterTask)}
            dayIdx={selectedDayIndex}
            onToggle={handleTaskClick}
            onOpenTimer={onOpenTimerForTask}
            scheduledReminders={scheduledReminders}
            onScheduleTaskReminder={onScheduleTaskReminder}
          />
        )}

        {currentDay.tasks.filter(filterTask).length === 0 && (
          <div className="bg-[#091226] rounded-3xl p-10 text-center border border-[#192b52] shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">
              لا توجد مهام مطابقة للفلتر المحدد
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              ما شاء الله! كل المهام المحددة منجزة في هذا اليوم، أو قم بتغيير الفلتر لرؤية المهام الأخرى.
            </p>
          </div>
        )}
      </div>

      {/* Day Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => setSelectedDayIndex((prev) => Math.max(0, prev - 1))}
          disabled={selectedDayIndex === 0}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            selectedDayIndex === 0
              ? 'text-slate-600 bg-[#081022] cursor-not-allowed border border-[#132247]'
              : 'text-white bg-[#0e1b38] hover:bg-[#14264d] border border-[#1d3363] shadow-md'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
          <span>اليوم السابق</span>
        </button>

        <span className="text-xs font-bold text-slate-400 tabular-nums">
          اليوم {selectedDayIndex + 1} من {plan.totalDays}
        </span>

        <button
          onClick={() =>
            setSelectedDayIndex((prev) => Math.min(plan.days.length - 1, prev + 1))
          }
          disabled={selectedDayIndex === plan.days.length - 1}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            selectedDayIndex === plan.days.length - 1
              ? 'text-slate-600 bg-[#081022] cursor-not-allowed border border-[#132247]'
              : 'text-white bg-[#0e1b38] hover:bg-[#14264d] border border-[#1d3363] shadow-md'
          }`}
        >
          <span>اليوم التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface PeriodBlockProps {
  title: string;
  timeWindow: string;
  icon: React.ReactNode;
  tasks: DayTask[];
  dayIdx: number;
  onToggle: (dayIdx: number, task: DayTask) => void;
  onOpenTimer: (taskTitle: string, minutes?: number) => void;
  scheduledReminders?: { [taskId: string]: { taskId: string; title: string; scheduledTime: string } };
  onScheduleTaskReminder?: (task: DayTask, minutesFromNow: number) => void;
}

const PeriodBlock: React.FC<PeriodBlockProps> = ({
  title,
  timeWindow,
  icon,
  tasks,
  dayIdx,
  onToggle,
  onOpenTimer,
  scheduledReminders = {},
  onScheduleTaskReminder,
}) => {
  return (
    <div className="bg-[#091226] rounded-3xl border border-[#192b52] shadow-xl overflow-hidden">
      <div className="bg-[#0d1836] px-5 py-3.5 border-b border-[#182a52] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">{title}</h4>
            <span className="text-[11px] text-slate-400 font-medium">{timeWindow}</span>
          </div>
        </div>
        <span className="text-xs font-bold text-blue-400 tabular-nums">
          {tasks.length} مهام
        </span>
      </div>

      <div className="divide-y divide-[#132247]">
        {tasks.map((task) => {
          const subject = SCI_BIO_SUBJECTS.find((s) => s.id === task.subjectId);

          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                task.completed ? 'bg-blue-950/20 opacity-60' : 'hover:bg-[#0c1630]'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  type="button"
                  onClick={() => onToggle(dayIdx, task)}
                  className="mt-0.5 text-blue-500 hover:text-blue-400 shrink-0 cursor-pointer"
                  aria-label={task.completed ? 'إلغاء الإكمال' : 'إكمال المهمة'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 fill-blue-600 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-500 hover:text-slate-400" />
                  )}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: subject ? `${subject.color}25` : '#132145',
                        borderColor: subject ? `${subject.accentColor}50` : '#1f3469',
                        color: '#ffffff',
                      }}
                    >
                      {task.subjectName}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400">
                      {task.chapterTitle} • {task.taskType === 'study'
                        ? 'مذاكرة واستيعاب'
                        : task.taskType === 'solve'
                        ? 'حل أسئلة وتطبيقات'
                        : 'مراجعة وامتحان'}
                    </span>
                  </div>

                  <h5
                    className={`text-sm sm:text-base font-bold ${
                      task.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h5>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#142347]">
                <span className="text-xs font-bold text-slate-300 bg-[#070e20] px-2.5 py-1 rounded-lg border border-[#16274e] tabular-nums">
                  {Math.round(task.estimatedMinutes / 60)} س ({task.estimatedMinutes} د)
                </span>

                {onScheduleTaskReminder && (
                  <button
                    onClick={() => onScheduleTaskReminder(task, 15)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                      scheduledReminders[task.id]
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm shadow-blue-600/30'
                        : 'bg-[#0f1b38] hover:bg-[#15254c] text-blue-300 border-[#1f3566]'
                    }`}
                    title={
                      scheduledReminders[task.id]
                        ? 'التذكير مجدول لهذا الدرس، انقر للإلغاء'
                        : 'تذكيري ببدء مذاكرة هذا الدرس بعد 15 دقيقة'
                    }
                  >
                    {scheduledReminders[task.id] ? (
                      <>
                        <BellRing className="w-3.5 h-3.5 text-white animate-pulse" />
                        <span className="text-[10px]">مجدول</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-blue-400" />
                        <span className="hidden sm:inline text-[10px]">تذكير</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => onOpenTimer(task.title, task.estimatedMinutes)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
                  title="بدء مؤقت التركيز لهذه المهمة"
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>بدء المؤقت</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
