import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { GeneratedPlan } from '../types/curriculum';
import { CheckCircle2, TrendingUp, BarChart3, PieChart as PieIcon, Award, Sparkles, Clock } from 'lucide-react';

interface ProgressChartsProps {
  plan: GeneratedPlan;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ plan }) => {
  const [activeChartTab, setActiveChartTab] = useState<'days' | 'subjects'>('days');

  // 1. Overall task stats
  const totalTasks = useMemo(() => {
    return plan.days.reduce((acc, d) => acc + d.tasks.length, 0);
  }, [plan]);

  const completedTasks = useMemo(() => {
    return plan.days.reduce((acc, d) => acc + d.tasks.filter((t) => t.completed).length, 0);
  }, [plan]);

  const remainingTasks = Math.max(0, totalTasks - completedTasks);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Completed hours
  const completedMinutes = useMemo(() => {
    return plan.days.reduce(
      (acc, d) =>
        acc +
        d.tasks.filter((t) => t.completed).reduce((sum, t) => sum + (t.estimatedMinutes || 60), 0),
      0
    );
  }, [plan]);
  const completedHours = Math.round((completedMinutes / 60) * 10) / 10;

  // 2. Donut Pie Data (Completed vs Remaining)
  const pieData = useMemo(() => {
    if (totalTasks === 0) {
      return [{ name: 'لا توجد مهام', value: 1, color: '#1e293b' }];
    }
    return [
      { name: 'المهام المكتملة', value: completedTasks, color: '#3b82f6' }, // blue-500
      { name: 'المهام المتبقية', value: remainingTasks, color: '#131e38' }, // deep slate-blue
    ];
  }, [totalTasks, completedTasks, remainingTasks]);

  // 3. Daily Breakdown Data for BarChart
  const dailyData = useMemo(() => {
    return plan.days.map((day) => {
      const done = day.tasks.filter((t) => t.completed).length;
      const total = day.tasks.length;
      const pending = Math.max(0, total - done);
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        name: `يوم ${day.dayNumber}`,
        dayNumber: day.dayNumber,
        'المهام المنجزة': done,
        'المهام المتبقية': pending,
        إجمالي: total,
        نسبة_الإنجاز: pct,
      };
    });
  }, [plan]);

  // 4. Subject Breakdown Data
  const subjectData = useMemo(() => {
    const map: { [subName: string]: { completed: number; total: number } } = {};

    plan.days.forEach((day) => {
      day.tasks.forEach((task) => {
        const name = task.subjectName || 'مادة';
        if (!map[name]) {
          map[name] = { completed: 0, total: 0 };
        }
        map[name].total += 1;
        if (task.completed) {
          map[name].completed += 1;
        }
      });
    });

    return Object.entries(map).map(([subject, stats]) => ({
      subject,
      'المهام المنجزة': stats.completed,
      'المهام المتبقية': Math.max(0, stats.total - stats.completed),
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }));
  }, [plan]);

  // Motivational message
  const motivationalMessage = useMemo(() => {
    if (progressPercent === 0) {
      return {
        title: 'بداية مشوار التميز 🎯',
        desc: 'كل خطوة تبدأ بدرس واحد. اضغط على المهام المنجزة بعد مذاكرتها لتشاهد الرسم البياني يرتفع!',
        badgeColor: 'text-blue-300 bg-blue-950/60 border-blue-500/30',
      };
    }
    if (progressPercent < 30) {
      return {
        title: 'انطلاقة موفقة ومبشرة 🚀',
        desc: 'أحسنت البدء! الاستمرارية اليومية هي السر الذي يفصل أوائل الجمهورية عن الباقين.',
        badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-500/30',
      };
    }
    if (progressPercent < 65) {
      return {
        title: 'تقدم باهر.. أكثر من ثلث الطريق! ⚡',
        desc: 'أنت الآن في منطقة الثبات والسيطرة على المتراكم. حافظ على نفس وتيرة التركيز!',
        badgeColor: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30',
      };
    }
    if (progressPercent < 100) {
      return {
        title: 'اقتربت جداً من إنهاء المتراكم كاملاً 🔥',
        desc: 'لم يتبق سوى القليل! هانت وبإذن الله تفتخر بنفسك وبنتيجة تعبك وسهرك.',
        badgeColor: 'text-indigo-300 bg-indigo-950/60 border-indigo-500/30',
      };
    }
    return {
      title: 'إنجاز تاريخي! أنهيت الخطة بنسبة 100% 🏆',
      desc: 'ما شاء الله تبارك الله! أنجزت كل متراكمك بجدارة، فالك التفوق وكلية الطب بإذن الله!',
      badgeColor: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30',
    };
  }, [progressPercent]);

  return (
    <div className="bg-[#091226] border border-[#192b52] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#142347]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 border border-blue-400/30">
            <TrendingUp className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                لوحة إحصائيات ونسبة تقدم المذاكرة (Recharts)
              </h3>
              <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 border border-blue-500/40 px-2.5 py-0.5 rounded-full">
                مباشر
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة دقيقة لنسبة المهام المنجزة مقابل الكلية ومعدل إنهاء كل مادة ويوم
            </p>
          </div>
        </div>

        {/* Chart View Toggle Tabs */}
        <div className="flex items-center bg-[#070e1f] p-1 rounded-xl border border-[#16274e] self-stretch md:self-auto justify-center">
          <button
            onClick={() => setActiveChartTab('days')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChartTab === 'days'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>التقدم حسب الأيام</span>
          </button>
          <button
            onClick={() => setActiveChartTab('subjects')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChartTab === 'subjects'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>التقدم حسب المواد</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* KPI 1: Percentage */}
        <div className="bg-[#0b1633] border border-[#1a3061] rounded-2xl p-3.5 sm:p-4 text-right">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">
            نسبة الإنجاز الكلية
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tabular-nums">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-[#070e22] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Completed Tasks */}
        <div className="bg-[#0b1633] border border-[#1a3061] rounded-2xl p-3.5 sm:p-4 text-right">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">
            المهام المكتملة
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-400">من {totalTasks}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-medium mt-1 block">
            ✓ تم وضع علامة الإنجاز
          </span>
        </div>

        {/* KPI 3: Remaining Tasks */}
        <div className="bg-[#0b1633] border border-[#1a3061] rounded-2xl p-3.5 sm:p-4 text-right">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">
            المهام المتبقية
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
              {remainingTasks}
            </span>
            <span className="text-xs text-slate-400">مهمة</span>
          </div>
          <span className="text-[10px] text-amber-400/80 font-medium mt-1 block">
            ⏳ قيد التنفيذ والمراجعة
          </span>
        </div>

        {/* KPI 4: Completed Hours */}
        <div className="bg-[#0b1633] border border-[#1a3061] rounded-2xl p-3.5 sm:p-4 text-right">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">
            ساعات المذاكرة المنجزة
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-blue-300 tabular-nums">
              ~{completedHours}
            </span>
            <span className="text-xs text-slate-400">من {plan.totalEstimatedHours} س</span>
          </div>
          <span className="text-[10px] text-blue-400/80 font-medium mt-1 block">
            ⏱️ جهد حقيقي مبذول
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Donut Pie Chart (Completed vs Remaining) - 4 cols on lg */}
        <div className="lg:col-span-4 bg-[#070e22] border border-[#152750] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-300 mb-2">
            مؤشر الإنجاز الكلي (Completed Tasks)
          </span>

          <div className="relative w-full max-w-[220px] h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={completedTasks > 0 && remainingTasks > 0 ? 4 : 0}
                  stroke="#070e22"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-[#091226] border border-[#1f3769] p-2.5 rounded-xl text-right shadow-xl text-xs">
                          <p className="font-bold text-white mb-1">{data.name}</p>
                          <p className="text-blue-400 font-semibold tabular-nums">
                            {data.value} مهمة (
                            {totalTasks > 0 ? Math.round(((data.value as number) / totalTasks) * 100) : 0}
                            %)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label inside the Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white tabular-nums tracking-tight">
                {progressPercent}%
              </span>
              <span className="text-[10px] font-bold text-slate-400">إنجاز الخطة</span>
            </div>
          </div>

          {/* Legend items */}
          <div className="flex items-center justify-center gap-4 text-xs font-semibold mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-blue-500 shrink-0" />
              <span className="text-slate-300">منجز ({completedTasks})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#131e38] border border-slate-700 shrink-0" />
              <span className="text-slate-400">متبقي ({remainingTasks})</span>
            </div>
          </div>
        </div>

        {/* Right: Recharts Bar Chart - 8 cols on lg */}
        <div className="lg:col-span-8 bg-[#070e22] border border-[#152750] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-300">
              {activeChartTab === 'days'
                ? 'توزيع المهام المكتملة والمتبقية لكل يوم (Daily Task Breakdown)'
                : 'نسبة تقدم الطالب حسب المواد (Subject Breakdown)'}
            </span>
            <span className="text-[11px] text-slate-400">
              {activeChartTab === 'days' ? `${plan.totalDays} أيام مجدولة` : `${subjectData.length} مواد`}
            </span>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              {activeChartTab === 'days' ? (
                <BarChart
                  data={dailyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={dailyData.length > 10 ? 14 : 24}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#142347" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1a2e5c' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1a2e5c' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const done = payload.find((p) => p.dataKey === 'المهام المنجزة')?.value || 0;
                        const pending = payload.find((p) => p.dataKey === 'المهام المتبقية')?.value || 0;
                        const total = (done as number) + (pending as number);
                        const pct = total > 0 ? Math.round(((done as number) / total) * 100) : 0;
                        return (
                          <div className="bg-[#091226] border border-[#1f3769] p-3 rounded-xl text-right shadow-xl text-xs space-y-1">
                            <p className="font-extrabold text-white">{label}</p>
                            <p className="text-blue-400 font-semibold">
                              ✓ المهام المنجزة: {done} مهمة
                            </p>
                            <p className="text-slate-400 font-medium">
                              ⏳ المهام المتبقية: {pending} مهمة
                            </p>
                            <div className="pt-1 border-t border-[#192b52] text-[11px] text-emerald-400 font-bold">
                              نسبة إنجاز اليوم: {pct}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="المهام المنجزة"
                    stackId="a"
                    fill="#3b82f6"
                    radius={[0, 0, 4, 4]}
                    name="المهام المنجزة"
                  />
                  <Bar
                    dataKey="المهام المتبقية"
                    stackId="a"
                    fill="#1e293b"
                    radius={[4, 4, 0, 0]}
                    name="المهام المتبقية"
                  />
                </BarChart>
              ) : (
                <BarChart
                  data={subjectData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={24}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#142347" vertical={false} />
                  <XAxis
                    dataKey="subject"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1a2e5c' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#1a2e5c' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const done = payload.find((p) => p.dataKey === 'المهام المنجزة')?.value || 0;
                        const pending = payload.find((p) => p.dataKey === 'المهام المتبقية')?.value || 0;
                        const total = (done as number) + (pending as number);
                        const pct = total > 0 ? Math.round(((done as number) / total) * 100) : 0;
                        return (
                          <div className="bg-[#091226] border border-[#1f3769] p-3 rounded-xl text-right shadow-xl text-xs space-y-1">
                            <p className="font-extrabold text-white">{label}</p>
                            <p className="text-blue-400 font-semibold">
                              ✓ المنجز: {done} مهمة
                            </p>
                            <p className="text-slate-400 font-medium">
                              ⏳ المتبقي: {pending} مهمة
                            </p>
                            <div className="pt-1 border-t border-[#192b52] text-[11px] text-cyan-300 font-bold">
                              نسبة إتقان المادة: {pct}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="المهام المنجزة"
                    stackId="a"
                    fill="#3b82f6"
                    radius={[0, 0, 4, 4]}
                    name="المهام المنجزة"
                  />
                  <Bar
                    dataKey="المهام المتبقية"
                    stackId="a"
                    fill="#1e293b"
                    radius={[4, 4, 0, 0]}
                    name="المهام المتبقية"
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Motivational Status Footer */}
      <div className="mt-5 bg-gradient-to-r from-[#0d1c42] to-[#102352] border border-[#213a73] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${motivationalMessage.badgeColor}`}>
                {motivationalMessage.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {motivationalMessage.desc}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-500/40 px-3 py-1.5 rounded-xl">
          🎯 الهدف: {totalTasks} مهمة لم المتراكم
        </div>
      </div>
    </div>
  );
};
