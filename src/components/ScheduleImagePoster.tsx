import React, { useState, useEffect } from 'react';
import { Download, Printer, Share2, Sparkles, RefreshCw, Smartphone } from 'lucide-react';
import { GeneratedPlan } from '../types/curriculum';
import { generateSchedulePoster, downloadImage } from '../utils/imageExporter';
import { SCI_BIO_SUBJECTS } from '../data/curriculumData';

interface ScheduleImagePosterProps {
  plan: GeneratedPlan;
  onModifyPlan: () => void;
  onGoToInteractiveSchedule: () => void;
}

export const ScheduleImagePoster: React.FC<ScheduleImagePosterProps> = ({
  plan,
  onModifyPlan,
  onGoToInteractiveSchedule,
}) => {
  const [posterDataUrl, setPosterDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);

    generateSchedulePoster(plan, 2)
      .then((url) => {
        if (isMounted) {
          setPosterDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate poster', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [plan]);

  const handleDownload = () => {
    if (!posterDataUrl) return;
    const filename = `جدول_تالتة_ثانوي_${plan.studentName.replace(/\s+/g, '_')}_${plan.totalDays}_أيام.png`;
    downloadImage(posterDataUrl, filename);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && posterDataUrl) {
      try {
        const blob = await (await fetch(posterDataUrl)).blob();
        const file = new File([blob], `جدول_تالتة_ثانوي_${plan.totalDays}_أيام.png`, {
          type: 'image/png',
        });
        await navigator.share({
          title: `خطة لم المتراكم - تالتة ثانوي علمي علوم`,
          text: `أنهيت تصميم خطتي للم المتراكم في ${plan.totalDays} أيام! جدول منظم جداً.`,
          files: [file],
        });
        return;
      } catch (e) {}
    }

    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const selectedSubIds = Array.from(
    new Set(plan.days.flatMap((d) => d.tasks.map((t) => t.subjectId)))
  );

  return (
    <div className="space-y-8">
      {/* Action Header Card - Royal Blue Dark */}
      <div className="bg-[#091226] rounded-3xl p-6 sm:p-8 border border-[#192b52] shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 bg-blue-950/70 border border-blue-500/40 px-3.5 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>تم توليد الصورة والجدول بنجاح</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              صورة جدول لم المتراكم جاهزة للتحميل والطباعة!
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              تم إعداد بوستر عالي الدقة يضم كافة المواد والدروس التي اخترتها مع تقسيم يومي واضح.
              يمكنك تحميله كصورة PNG لحفظه في هاتفك، وضعه كخلفية قفل (Lock Screen)، أو طباعته على ورقة A4.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleDownload}
              disabled={isGenerating || !posterDataUrl}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الصورة PNG للموبايل</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-3 rounded-xl font-bold text-sm bg-[#101b38] hover:bg-[#16254d] border border-[#1e3260] text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="طباعة A4"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>طباعة</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-3 rounded-xl font-bold text-sm bg-[#101b38] hover:bg-[#16254d] border border-[#1e3260] text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer relative"
              title="مشاركة"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>مشاركة</span>
              {copiedNotification && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  تم النسخ!
                </span>
              )}
            </button>

            <button
              onClick={onModifyPlan}
              className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تعديل الأيام</span>
            </button>
          </div>
        </div>

        {/* Quick Meta Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#16274b] text-xs">
          <div className="p-3.5 bg-[#070e20] rounded-2xl border border-[#142345]">
            <span className="text-slate-400 block text-[11px]">اسم الطالب / الطبيب:</span>
            <span className="font-black text-white text-sm">{plan.studentName}</span>
          </div>
          <div className="p-3.5 bg-[#070e20] rounded-2xl border border-[#142345]">
            <span className="text-slate-400 block text-[11px]">مدة إنجاز المتراكم:</span>
            <span className="font-black text-blue-400 text-sm">{plan.totalDays} أيام متواصلة</span>
          </div>
          <div className="p-3.5 bg-[#070e20] rounded-2xl border border-[#142345]">
            <span className="text-slate-400 block text-[11px]">الدروس المتراكمة:</span>
            <span className="font-black text-white text-sm">{plan.selectedLessonCount} دروس</span>
          </div>
          <div className="p-3.5 bg-[#070e20] rounded-2xl border border-[#142345]">
            <span className="text-slate-400 block text-[11px]">إجمالي الساعات المقدرة:</span>
            <span className="font-black text-amber-400 text-sm">~{plan.totalEstimatedHours} ساعة</span>
          </div>
        </div>
      </div>

      {/* Selected Subjects Visual Badges */}
      <div className="bg-[#091226] rounded-3xl p-5 border border-[#192b52] shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 mb-3">المواد المضمنة في هذا البوستر:</h3>
        <div className="flex flex-wrap gap-2.5">
          {selectedSubIds.map((sId) => {
            const sub = SCI_BIO_SUBJECTS.find((s) => s.id === sId);
            if (!sub) return null;
            return (
              <span
                key={sub.id}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border"
                style={{
                  backgroundColor: `${sub.color}25`,
                  borderColor: `${sub.accentColor}60`,
                  color: '#ffffff',
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }} />
                <span>{sub.name}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Poster Image Preview Box */}
      <div className="bg-[#050914] rounded-3xl p-4 sm:p-8 shadow-2xl border border-[#192a54] relative">
        <div className="flex items-center justify-between text-slate-300 text-xs mb-4 px-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>معاينة الصورة عالية الدقة (High DPI 2x):</span>
          </div>
          <button
            onClick={handleDownload}
            className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
          >
            تحميل الصورة الأصلية
          </button>
        </div>

        {isGenerating ? (
          <div className="min-h-[500px] flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-slate-300">جارٍ رسم البوستر الملكي بجودة فائقة...</span>
          </div>
        ) : posterDataUrl ? (
          <div className="flex justify-center overflow-x-auto p-2">
            <img
              src={posterDataUrl}
              alt="بوستر جدول المذاكرة لطلاب تالتة ثانوي علمي علوم"
              className="max-w-full h-auto rounded-2xl shadow-2xl border border-[#1d315f]"
            />
          </div>
        ) : null}
      </div>

      {/* Jump to Interactive Daily Checklist CTA */}
      <div className="bg-gradient-to-r from-[#0d1b3d] to-[#12234f] rounded-3xl p-6 border border-[#22396d] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-base font-bold text-white">
            تريد متابعة إنجازك اليومي ووضع علامات صح على المهام؟
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            انتقل إلى الجدول التفاعلي لليوم بيومه، مع مؤقت بومودورو وصوت الاحتفال عند إنهاء كل درس!
          </p>
        </div>
        <button
          onClick={onGoToInteractiveSchedule}
          className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 whitespace-nowrap cursor-pointer"
        >
          فتح الجدول التفاعلي الآن ←
        </button>
      </div>
    </div>
  );
};
