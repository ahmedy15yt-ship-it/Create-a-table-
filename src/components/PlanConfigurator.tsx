import React from 'react';
import { Calendar, Clock, Flame, ShieldCheck, User, Zap, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { StudentPreferences } from '../types/curriculum';
import { SCI_BIO_SUBJECTS } from '../data/curriculumData';

interface PlanConfiguratorProps {
  preferences: StudentPreferences;
  onUpdatePreferences: (updates: Partial<StudentPreferences>) => void;
  onGenerate: () => void;
  onBackToSubjects: () => void;
  selectedCount: number;
}

export const PlanConfigurator: React.FC<PlanConfiguratorProps> = ({
  preferences,
  onUpdatePreferences,
  onGenerate,
  onBackToSubjects,
  selectedCount,
}) => {
  const DAY_PRESETS = [
    { days: 3, label: '3 أيام', desc: 'معسكر طوارئ سريع' },
    { days: 7, label: '7 أيام', desc: 'أسبوع الإنقاذ الأسطوري' },
    { days: 10, label: '10 أيام', desc: 'خطة الـ 10 أيام المتوازنة' },
    { days: 14, label: '14 يوماً', desc: 'أسبوعان للتمكن والحل' },
    { days: 21, label: '21 يوماً', desc: '3 أسابيع تأسيس وإتقان' },
    { days: 30, label: 'شهر (30 يوم)', desc: 'مراجعة وتثبيت شامل' },
  ];

  let rawEstimatedHours = 0;
  SCI_BIO_SUBJECTS.forEach((sub) => {
    const list = preferences.selectedLessons[sub.id] || [];
    sub.chapters.forEach((ch) => {
      ch.lessons.forEach((l) => {
        if (list.includes(l.id)) {
          rawEstimatedHours += l.estimatedHours;
        }
      });
    });
  });

  const multiplier =
    preferences.strategy === 'intensive'
      ? 0.8
      : preferences.strategy === 'deep'
      ? 1.25
      : 1.0;

  const totalEffectiveHours = Math.round(rawEstimatedHours * multiplier * 10) / 10;
  const hoursPerDayNeeded = Math.round((totalEffectiveHours / preferences.totalDays) * 10) / 10;

  const isTooHeavy = hoursPerDayNeeded > 11;
  const isDemanding = hoursPerDayNeeded > 8 && hoursPerDayNeeded <= 11;
  const isComfortable = hoursPerDayNeeded <= 8;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title Card - Royal Blue Dark Surface */}
      <div className="bg-[#091226] rounded-3xl p-6 sm:p-8 border border-[#192b52] shadow-2xl text-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#16274b] pb-5 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">
              تحديد مدة الخطة ونظام المذاكرة
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              اختر عدد الأيام التي تريد خلالها إنهاء هذا المتراكم، وسيقوم النظام بتوزيع الفصول بأفضل توازن ذهني.
            </p>
          </div>
          <button
            onClick={onBackToSubjects}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>تعديل المواد</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Student Name & Start Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>اسم الطالب / طالبة (سيظهر في صورة الجدول)</span>
            </label>
            <input
              type="text"
              value={preferences.studentName}
              onChange={(e) => onUpdatePreferences({ studentName: e.target.value })}
              placeholder="مثال: د. أحمد / دكتورة مريم"
              className="w-full px-4 py-2.5 rounded-xl bg-[#060c1a] border border-[#1d3260] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white text-sm font-medium outline-none transition-all placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>تاريخ بداية الخطة</span>
            </label>
            <input
              type="date"
              value={preferences.startDate}
              onChange={(e) => onUpdatePreferences({ startDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#060c1a] border border-[#1d3260] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white text-sm font-medium outline-none transition-all"
            />
          </div>
        </div>

        {/* 1. Days Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>في كم يوم تود لم هذا المتراكم؟</span>
            </label>
            <span className="text-sm font-black text-blue-300 bg-blue-950/70 border border-blue-500/40 px-3 py-1 rounded-xl tabular-nums">
              {preferences.totalDays} يوماً
            </span>
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
            {DAY_PRESETS.map((p) => {
              const active = preferences.totalDays === p.days;
              return (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => onUpdatePreferences({ totalDays: p.days })}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-bold scale-[1.02]'
                      : 'bg-[#0d1833] hover:bg-[#122144] text-slate-300 border-[#1a2d56]'
                  }`}
                >
                  <span className="block text-sm font-black">{p.label}</span>
                  <span
                    className={`block text-[10px] mt-0.5 ${
                      active ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slider for exact days */}
          <div className="bg-[#070e20] p-4 rounded-2xl border border-[#17284f]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>تحديد يدوي دقيق للأيام:</span>
              <span className="font-bold text-white">{preferences.totalDays} يوم</span>
            </div>
            <input
              type="range"
              min="2"
              max="45"
              step="1"
              value={preferences.totalDays}
              onChange={(e) => onUpdatePreferences({ totalDays: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>يومين</span>
              <span>15 يوم</span>
              <span>30 يوم</span>
              <span>45 يوم</span>
            </div>
          </div>
        </div>

        {/* 2. Daily Study Capacity */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-black text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>طاقتك اليومية القصوى للمذاكرة (ساعات/اليوم)</span>
            </label>
            <span className="text-sm font-black text-amber-300 bg-amber-950/50 border border-amber-500/40 px-3 py-1 rounded-xl tabular-nums">
              {preferences.dailyHours} ساعات يومياً
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { hours: 6, label: '6 ساعات', desc: 'معتدل (مناسب للمدرسة والدروس)' },
              { hours: 8, label: '8 ساعات', desc: 'طاقة ممتازة ومنتجة جداً' },
              { hours: 10, label: '10 ساعات', desc: 'معسكر تدريبي مكثف' },
              { hours: 12, label: '12 ساعة', desc: 'تفرغ كامل بدون دروس' },
            ].map((h) => {
              const active = preferences.dailyHours === h.hours;
              return (
                <button
                  key={h.hours}
                  type="button"
                  onClick={() => onUpdatePreferences({ dailyHours: h.hours })}
                  className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-600 text-white border-amber-400 font-bold shadow-md shadow-amber-600/30'
                      : 'bg-[#0d1833] hover:bg-[#122144] text-slate-300 border-[#1a2d56]'
                  }`}
                >
                  <span className="block text-sm font-black">{h.label}</span>
                  <span
                    className={`block text-[11px] mt-0.5 ${
                      active ? 'text-amber-100' : 'text-slate-400'
                    }`}
                  >
                    {h.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Strategy */}
        <div className="mb-8">
          <label className="block text-sm font-black text-white mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>نمط واستراتيجية المذاكرة المفضلة</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'intensive',
                title: 'مكثف وسريع',
                desc: 'مراجعة الخرائط الذهنية والقوانين فوراً + حل أفكار الامتحانات مباشرة.',
                badge: 'أسرع إنجاز',
              },
              {
                id: 'balanced',
                title: 'متوازن (موصى به)',
                desc: 'شرح وتثبيت مفاهيم 60% + حل أسئلة وتطبيقات بابل شيت 40%.',
                badge: 'أعلى تثبيت للمعلومة',
              },
              {
                id: 'deep',
                title: 'تأسيسي وعميق',
                desc: 'قراءة تفصيلية للفصول مع حل نماذج شاملة وربط بين الأبواب.',
                badge: 'فهم جذري',
              },
            ].map((strat) => {
              const active = preferences.strategy === strat.id;
              return (
                <div
                  key={strat.id}
                  onClick={() =>
                    onUpdatePreferences({
                      strategy: strat.id as 'intensive' | 'balanced' | 'deep',
                    })
                  }
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    active
                      ? 'bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/30'
                      : 'bg-[#0d1833] border-[#182a52] hover:border-[#22396e]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-sm text-white">{strat.title}</span>
                    <span className="text-[10px] font-bold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded-md border border-blue-500/30">
                      {strat.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{strat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feasibility Indicator */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isTooHeavy
              ? 'bg-rose-950/40 border-rose-800 text-rose-200'
              : isDemanding
              ? 'bg-amber-950/40 border-amber-800 text-amber-200'
              : 'bg-blue-950/40 border-blue-800 text-blue-200'
          }`}
        >
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-current" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold block mb-0.5">
              {isTooHeavy
                ? 'تنبيه واقعي: الخطة مضغوطة جداً'
                : isDemanding
                ? 'خطة قوية تحتاج انضباطاً عالياً'
                : 'خطة ممتازة ومثالية جداً للنجاح'}
            </span>
            <p className="leading-relaxed opacity-90">
              إجمالي الساعات المطلوبة لإنهاء المتراكم:~<strong>{totalEffectiveHours} ساعة</strong>،
              موزعة على <strong>{preferences.totalDays} أيام</strong> بمعدل مطلوب حوالي{' '}
              <strong className="underline">~{hoursPerDayNeeded} ساعة يومياً</strong>.
              {isTooHeavy &&
                ' نقترح زيادة عدد الأيام (مثلاً أسبوعين أو 20 يوماً) لتجنب الإجهاد الذهني.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-[#17284f] flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBackToSubjects}
            className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white font-bold text-sm bg-[#101c38] hover:bg-[#15254b] border border-[#1f3463] transition-all cursor-pointer flex items-center gap-2"
          >
            <span>رجوع لتعديل المواد</span>
          </button>

          <button
            onClick={onGenerate}
            className="px-8 py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>توليد الجدول والصورة الآن</span>
            <span aria-hidden="true">←</span>
          </button>
        </div>
      </div>
    </div>
  );
};
