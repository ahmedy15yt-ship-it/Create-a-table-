import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, RefreshCw, Copy, Check, Heart, Award } from 'lucide-react';

export interface WisdomItem {
  id: string;
  type: 'ayah' | 'hadith';
  text: string;
  source: string;
  reflection: string;
  subTheme: string;
}

export const KNOWLEDGE_WISDOM_ITEMS: WisdomItem[] = [
  {
    id: 'w1',
    type: 'hadith',
    text: '«مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ، وَإِنَّ الْمَلَائِكَةَ لَتَضَعُ أَجْنِحَتَهَا رِضًا لِطَالِبِ الْعِلْمِ»',
    source: 'صحيح مسلم • عن أبي هريرة رضي الله عنه',
    reflection: 'كل مسألة تحلها وكل ساعة مذاكرة تقضيها في فهم دروسك الصعبة ليست مجرد درجات في الامتحان، بل هي خطوة مباركة في طريقك إلى الجنة والملائكة تحفك برضاها.',
    subTheme: 'طريق الجنة ورضا الملائكة',
  },
  {
    id: 'w2',
    type: 'ayah',
    text: '﴿ يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ وَاللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ ﴾',
    source: 'سورة المجادلة • الآية 11',
    reflection: 'تعب السهر والاجتهاد اليوم هو رفعتك غداً بين الناس وفي ميزان ربك. الله خبير بجهدك ولن يضيع لحظة تعب واحدة بذلتها بنية طيبة.',
    subTheme: 'رفعة الدرجات والمكانة',
  },
  {
    id: 'w3',
    type: 'hadith',
    text: '«مَنْ خَرَجَ فِي طَلَبِ الْعِلْمِ فَهُوَ فِي سَبِيلِ اللَّهِ حَتَّى يَرْجِعَ»',
    source: 'جامع الترمذي • حديث حسن',
    reflection: 'أنت في ثغر جهاد وبناء؛ جلوسك على مكتبك وصبرك على المتراكم عبادة يثيبك الله عليها بكل نفس وبكل معلومة تتقنها.',
    subTheme: 'طلب العلم جهاد وعبادة',
  },
  {
    id: 'w4',
    type: 'ayah',
    text: '﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾',
    source: 'سورة طه • الآية 114',
    reflection: 'أمر الله نبيه ﷺ بطلب الزيادة من العلم دون سواه؛ فاستفتح كل درس بهذا الدعاء واعلم أن الفهم والفتح والتوفيق هبة من الله يمنحها لمن سأله بيقين.',
    subTheme: 'التوكل والاستفتاح بالدعاء',
  },
  {
    id: 'w5',
    type: 'hadith',
    text: '«إِنَّ الْعَالِمَ لَيَسْتَغْفِرُ لَهُ مَنْ فِي السَّمَاوَاتِ وَمَنْ فِي الْأَرْضِ حَتَّى الْحِيتَانُ فِي جَوْفِ الْمَاءِ، وَإِنَّ فَضْلَ الْعَالِمِ عَلَى الْعَابِدِ كَفَضْلِ الْقَمَرِ لَيْلَةَ الْبَدْرِ عَلَى سَائِرِ الْكَوَاكِبِ»',
    source: 'سنن أبي داود والترمذي • عن أبي الدرداء رضي الله عنه',
    reflection: 'مخلوقات الكون تدعو لطالب العلم بالخير والبركة، وسعيك لكي تصبح طبيباً أو باحثاً ينفع الناس هو من أشرف المقاصد وأعظمها أجراً.',
    subTheme: 'استغفار الكائنات لطالب العلم',
  },
  {
    id: 'w6',
    type: 'ayah',
    text: '﴿ وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ • وَأَنَّ سَعْيَهُ سَوْفَ يُرَىٰ • ثُمَّ يُجْزَاهُ الْجَزَاءَ الْأَوْفَىٰ ﴾',
    source: 'سورة النجم • الآيات 39 - 41',
    reflection: 'قانون إلهي ثابت: سعيك لن يضيع أبداً. ركّز في السعي والمذاكرة، ودع النتائج على رب العباد فهو يعطيك الجزاء الأوفى بما يليق بكرمه.',
    subTheme: 'قانون السعي والجزاء الأوفى',
  },
  {
    id: 'w7',
    type: 'hadith',
    text: '«إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ»',
    source: 'صحيح مسلم • عن أبي هريرة رضي الله عنه',
    reflection: 'العلم الذي تتعلمه اليوم في علم الأحياء والكيمياء والطب غداً سيكون ذخيرة حية تنفع بها أمتك والمرضى، وتترك بها أثراً خالداً لا ينقطع.',
    subTheme: 'الأثر الباقي ونفع الإنسانية',
  },
];

interface DailyWisdomProps {
  onAhmedYehiaDuaaClick?: () => void;
}

export const DailyWisdom: React.FC<DailyWisdomProps> = () => {
  // Pick an index based on day of year to give a daily rotation
  const getDayOfYearIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day % KNOWLEDGE_WISDOM_ITEMS.length;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getDayOfYearIndex);
  const [copied, setCopied] = useState(false);
  const [duaaCount, setDuaaCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ahmed_yehia_duaa_count');
      return saved ? parseInt(saved, 10) : 482;
    } catch {
      return 482;
    }
  });
  const [hasPrayed, setHasPrayed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ahmed_yehia_has_prayed') === 'true';
    } catch {
      return false;
    }
  });

  const currentItem = KNOWLEDGE_WISDOM_ITEMS[currentIndex];

  const handleNextWisdom = () => {
    setCurrentIndex((prev) => (prev + 1) % KNOWLEDGE_WISDOM_ITEMS.length);
  };

  const handleCopy = () => {
    const textToCopy = `${currentItem.type === 'ayah' ? 'آية كريمة' : 'حديث نبوي شريف'} لطلاب العلم:\n${currentItem.text}\n[${currentItem.source}]\n—\n${currentItem.reflection}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrayForAhmed = () => {
    if (!hasPrayed) {
      const newCount = duaaCount + 1;
      setDuaaCount(newCount);
      setHasPrayed(true);
      try {
        localStorage.setItem('ahmed_yehia_duaa_count', newCount.toString());
        localStorage.setItem('ahmed_yehia_has_prayed', 'true');
      } catch {}
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Bar for Developer Attribution with Prayer */}
      <div className="bg-gradient-to-r from-[#0d1c42] via-[#14295e] to-[#0d1c42] border border-[#233f80] rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 shadow-inner">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-blue-300 bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                إهداء وتطوير
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                تم عمل هذا الموقع بواسطة: <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4">أحمد يحيى</span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              نسألكم من قلوبكم خالص الدعاء له بالتوفيق والسداد والتيسير في حياته وعلمه 🤲
            </p>
          </div>
        </div>

        {/* Interactive Duaa Button */}
        <button
          onClick={handlePrayForAhmed}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-md ${
            hasPrayed
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/40 shadow-blue-600/30'
          }`}
          title="اضغط هنا للدعاء لأحمد يحيى بالتوفيق"
        >
          <Heart className={`w-4 h-4 ${hasPrayed ? 'fill-emerald-400 text-emerald-400' : 'text-rose-300 fill-rose-300/40 animate-pulse'}`} />
          <span>{hasPrayed ? 'جزاك الله خيراً ودعواتك مستجابة 🤲' : 'اللهم وفّق أحمد يحيى واجزهِ خيراً 🤲'}</span>
          <span className="bg-black/30 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold text-blue-200">
            {duaaCount} دعوة
          </span>
        </button>
      </div>

      {/* 2. Today's Quranic Verse or Hadith for Students of Knowledge (واجهة التطبيق) */}
      <div className="bg-gradient-to-br from-[#0c1633] via-[#0f1d44] to-[#081024] border border-[#21396e] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow & Islamic decorative patterns */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-blue-400/20 rounded-tl-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-blue-400/20 rounded-br-3xl pointer-events-none" />

        {/* Header of Wisdom Card */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4 pb-3.5 border-b border-[#1b2f5b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-amber-300 uppercase">
                  {currentItem.type === 'ayah' ? '📖 آية اليوم لطالب العلم' : '✨ حديث اليوم لطالب العلم'}
                </span>
                <span className="text-[11px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  {currentItem.subTheme}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                بشارة نبوية وقرآنية تشحذ همتك وتملأ قلبك طمأنينة قبل المذاكرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-xs font-medium text-slate-300 hover:text-white bg-[#13234d] hover:bg-[#1a3068] border border-[#233d79] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="نسخ الآية أو الحديث"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-xs hidden sm:inline">نسخ</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextWisdom}
              className="px-3 py-2 text-xs font-bold text-blue-300 hover:text-white bg-blue-900/50 hover:bg-blue-800/60 border border-blue-600/40 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
              title="عرض آية أو حديث آخر عن طلب العلم"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>آية أو حديث آخر</span>
            </button>
          </div>
        </div>

        {/* The Quranic Verse / Prophetic Hadith Quote */}
        <div className="relative z-10 my-4 text-center px-2 sm:px-6">
          <p className="text-base sm:text-xl md:text-2xl font-black text-amber-200/95 leading-relaxed tracking-wide font-serif py-2 drop-shadow-sm selection:bg-amber-500/30">
            {currentItem.text}
          </p>

          <div className="inline-block mt-2.5 text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-500/30 px-3 py-1 rounded-full shadow-inner">
            {currentItem.source}
          </div>
        </div>

        {/* Reflection / Message for 3rd Secondary Student */}
        <div className="relative z-10 mt-4 bg-[#081024]/80 border border-[#192c57] rounded-2xl p-3.5 sm:p-4 text-right">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-blue-300 font-bold ml-1">رسالة وتذكرة لطالب تالتة ثانوي:</strong>
              {currentItem.reflection}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
