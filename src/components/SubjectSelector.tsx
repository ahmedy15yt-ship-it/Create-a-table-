import React, { useState, useMemo } from 'react';
import {
  Dna,
  FlaskConical,
  Zap,
  Mountain,
  BookOpen,
  Languages,
  Globe,
  CheckCircle2,
  Circle,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FolderOpen,
  X,
} from 'lucide-react';
import { Subject, Chapter, Lesson } from '../types/curriculum';
import { SCI_BIO_SUBJECTS } from '../data/curriculumData';
import { DailyWisdom } from './DailyWisdom';

interface SubjectSelectorProps {
  selectedLessons: { [subjectId: string]: string[] };
  onToggleLesson: (subjectId: string, lessonId: string) => void;
  onSelectAllChapterLessons: (subjectId: string, chapterId: string, selectAll: boolean) => void;
  onSelectAllSubject: (subjectId: string, selectAll: boolean) => void;
  onSelectEntireCurriculum: () => void;
  onClearAll: () => void;
  onProceedToPlan: () => void;
}

const ICON_MAP: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Dna,
  FlaskConical,
  Zap,
  Mountain,
  BookOpen,
  Languages,
  Globe,
};

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedLessons,
  onToggleLesson,
  onSelectAllChapterLessons,
  onSelectAllSubject,
  onSelectEntireCurriculum,
  onClearAll,
  onProceedToPlan,
}) => {
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>('biology');
  const [expandedChapterIds, setExpandedChapterIds] = useState<{ [chId: string]: boolean }>({
    bio_ch_1: true,
    bio_ch_2: true,
    bio_ch_3: true,
    chem_ch_1: true,
    phy_ch_1: true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleChapterExpand = (chId: string) => {
    setExpandedChapterIds((prev) => ({
      ...prev,
      [chId]: !prev[chId],
    }));
  };

  const totalSelectedLessonsCount = useMemo(() => {
    return Object.values(selectedLessons).reduce((sum, list) => sum + (list?.length || 0), 0);
  }, [selectedLessons]);

  const selectedSubjectsCount = useMemo(() => {
    return Object.keys(selectedLessons).filter((k) => selectedLessons[k]?.length > 0).length;
  }, [selectedLessons]);

  const totalEstimatedHours = useMemo(() => {
    let hours = 0;
    SCI_BIO_SUBJECTS.forEach((sub) => {
      const selected = selectedLessons[sub.id] || [];
      sub.chapters.forEach((ch) => {
        ch.lessons.forEach((l) => {
          if (selected.includes(l.id)) {
            hours += l.estimatedHours;
          }
        });
      });
    });
    return Math.round(hours * 10) / 10;
  }, [selectedLessons]);

  const filteredSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SCI_BIO_SUBJECTS;

    return SCI_BIO_SUBJECTS.map((sub) => {
      const matchingChapters = sub.chapters
        .map((ch) => {
          const matchingLessons = ch.lessons.filter(
            (l) =>
              l.title.toLowerCase().includes(q) ||
              (l.subtitle && l.subtitle.toLowerCase().includes(q)) ||
              l.keyTopics.some((t) => t.toLowerCase().includes(q))
          );

          if (matchingLessons.length > 0 || ch.title.toLowerCase().includes(q)) {
            return {
              ...ch,
              lessons: matchingLessons.length > 0 ? matchingLessons : ch.lessons,
            };
          }
          return null;
        })
        .filter(Boolean) as Chapter[];

      return {
        ...sub,
        chapters: matchingChapters,
      };
    }).filter((sub) => sub.chapters.length > 0);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* 1. Daily Hadith / Quranic Verse for Students of Knowledge & Ahmed Yehia Attribution and Duaa */}
      <DailyWisdom />

      {/* Hero Intro - Royal Navy Gradient */}
      <div className="bg-gradient-to-br from-[#0c1630] via-[#112046] to-[#070e22] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-[#1d3363] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-950/70 border border-blue-500/40 px-3.5 py-1 rounded-full mb-4 shadow-sm shadow-blue-500/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>موقع ثانوية عامة علمي علوم (دفعة 2027) • اختيار الدروس بالتفصيل الدقيق</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            اختر كل درس متراكم تريده على حِدة
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            منهج تالتة ثانوي علمي علوم مفصّل بالكامل درس بدرس! اختر الدروس الصعبة التي تحتاج هضمها وتثبيتها،
            وسيقوم النظام الذكي بتوزيعها على خطة متوازنة بأوقات مريحة وتوليد صورة البوستر الملكي للجدول.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSelectEntireCurriculum}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/30 active:scale-95 border border-blue-400/30"
            >
              تحديد جميع دروس المنهج كاملاً
            </button>
            <button
              onClick={onClearAll}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl transition-all cursor-pointer active:scale-95 border border-white/10"
            >
              إلغاء تحديد الكل
            </button>
          </div>
        </div>
      </div>

      {/* Floating Summary Bar */}
      <div className="sticky top-18 z-30 bg-[#091227]/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#192b54] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-slate-400 block text-xs">المواد المتراكمة:</span>
            <span className="font-black text-white text-lg tabular-nums">
              {selectedSubjectsCount} من {SCI_BIO_SUBJECTS.length} مواد
            </span>
          </div>
          <div className="h-8 w-px bg-[#1e3363]" />
          <div>
            <span className="text-slate-400 block text-xs">الدروس المختارة:</span>
            <span className="font-black text-blue-400 text-lg tabular-nums">
              {totalSelectedLessonsCount} درس محدد
            </span>
          </div>
          <div className="h-8 w-px bg-[#1e3363]" />
          <div>
            <span className="text-slate-400 block text-xs">ساعات المذاكرة المقدرة:</span>
            <span className="font-black text-amber-400 text-lg tabular-nums">
              ~{totalEstimatedHours} ساعة
            </span>
          </div>
        </div>

        <button
          onClick={onProceedToPlan}
          disabled={totalSelectedLessonsCount === 0}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
            totalSelectedLessonsCount > 0
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-98'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>المتابعة إلى ضبط عدد الأيام</span>
          <span aria-hidden="true">←</span>
        </button>
      </div>

      {/* Lesson Quick Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-blue-400 absolute right-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن درس معين... (مثال: فاراداي، كيرشوف، العضوية، التكاثر في النبات، المناعة الخلطية، الصخور النارية، المشتقات)"
          className="w-full pr-12 pl-10 py-3.5 bg-[#0a1329] rounded-2xl border border-[#1b2f5b] text-sm font-medium text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subjects & Granular Lessons List */}
      <div className="space-y-5">
        {filteredSubjects.map((subject) => {
          const Icon = ICON_MAP[subject.iconName] || BookOpen;
          const selectedInThisSubject = selectedLessons[subject.id] || [];

          const allSubjectLessons = subject.chapters.flatMap((c) => c.lessons);
          const isAllSubjectSelected =
            allSubjectLessons.length > 0 &&
            allSubjectLessons.every((l) => selectedInThisSubject.includes(l.id));

          const isExpanded = expandedSubjectId === subject.id || Boolean(searchQuery);

          const subjectHours = allSubjectLessons.reduce(
            (sum, l) => (selectedInThisSubject.includes(l.id) ? sum + l.estimatedHours : sum),
            0
          );

          return (
            <div
              key={subject.id}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                selectedInThisSubject.length > 0
                  ? 'border-blue-500/60 bg-[#0a1328] shadow-lg shadow-blue-950/40'
                  : 'border-[#17274c] bg-[#091124] hover:border-[#213768]'
              }`}
            >
              {/* Subject Header */}
              <div
                onClick={() => setExpandedSubjectId(isExpanded && !searchQuery ? null : subject.id)}
                className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-transparent to-[#0e1b38]/70 hover:to-[#122349] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md border border-white/10"
                    style={{ backgroundColor: subject.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white">{subject.name}</h3>
                      <span className="text-xs font-medium text-slate-400">
                        ({subject.englishName})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{allSubjectLessons.length} دروس متاحة</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-blue-400 font-bold">
                        المختار: {selectedInThisSubject.length} درس (~{subjectHours} ساعة)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAllSubject(subject.id, !isAllSubjectSelected);
                    }}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isAllSubjectSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                        : 'bg-[#121f3f] text-slate-200 border-[#233a6e] hover:bg-[#182a55]'
                    }`}
                  >
                    {isAllSubjectSelected ? 'إلغاء دروس المادة' : 'تحديد كل دروس المادة'}
                  </button>
                  <div className="p-1 rounded-lg text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Subject Pro-Tip */}
              {isExpanded && (
                <div className="px-6 py-3 bg-[#060c1c] border-t border-b border-[#142244] flex items-start gap-2.5 text-xs text-slate-300">
                  <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-blue-300">نصيحة المذاكرة: </strong>
                    {subject.proTip}
                  </p>
                </div>
              )}

              {/* Subject Chapters & Lessons */}
              {isExpanded && (
                <div className="p-4 sm:p-6 space-y-4">
                  {subject.chapters.map((chapter) => {
                    const isChapterOpen = expandedChapterIds[chapter.id] !== false || Boolean(searchQuery);
                    const chapterLessonIds = chapter.lessons.map((l) => l.id);
                    const selectedChapterLessonCount = chapterLessonIds.filter((id) =>
                      selectedInThisSubject.includes(id)
                    ).length;
                    const isAllChapterLessonsSelected =
                      chapterLessonIds.length > 0 &&
                      selectedChapterLessonCount === chapterLessonIds.length;

                    return (
                      <div
                        key={chapter.id}
                        className="rounded-2xl border border-[#172952] bg-[#070e20] overflow-hidden"
                      >
                        {/* Chapter Banner */}
                        <div
                          onClick={() => toggleChapterExpand(chapter.id)}
                          className="px-4 py-3.5 bg-[#0d1833] border-b border-[#172952] flex items-center justify-between cursor-pointer select-none hover:bg-[#101d3e] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <FolderOpen className="w-4 h-4 text-blue-400 shrink-0" />
                            <div>
                              <h4 className="text-sm font-bold text-white">{chapter.title}</h4>
                              {chapter.subtitle && (
                                <p className="text-[11px] text-slate-400">{chapter.subtitle}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectAllChapterLessons(
                                  subject.id,
                                  chapter.id,
                                  !isAllChapterLessonsSelected
                                );
                              }}
                              className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                                isAllChapterLessonsSelected
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-[#121f40] text-slate-300 border-[#22396d] hover:bg-[#182952]'
                              }`}
                            >
                              {isAllChapterLessonsSelected ? 'إلغاء الفصل' : 'تحديد كل دروس الفصل'}
                            </button>
                            <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                              ({selectedChapterLessonCount}/{chapter.lessons.length} درس)
                            </span>
                          </div>
                        </div>

                        {/* Individual Lessons List */}
                        {isChapterOpen && (
                          <div className="p-3 divide-y divide-[#132247] bg-[#081024]">
                            {chapter.lessons.map((lesson) => {
                              const isChecked = selectedInThisSubject.includes(lesson.id);

                              const difficultyText =
                                lesson.difficulty === 'hard'
                                  ? 'يحتاج تركيز عالي'
                                  : lesson.difficulty === 'medium'
                                  ? 'متوسط'
                                  : 'مباشر وسلس';

                              const difficultyColor =
                                lesson.difficulty === 'hard'
                                  ? 'text-rose-400'
                                  : lesson.difficulty === 'medium'
                                  ? 'text-amber-400'
                                  : 'text-blue-400';

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => onToggleLesson(subject.id, lesson.id)}
                                  className={`py-3 px-3.5 rounded-xl flex items-start justify-between gap-4 cursor-pointer transition-all ${
                                    isChecked
                                      ? 'bg-blue-950/40 border border-blue-500/30 text-white'
                                      : 'hover:bg-[#0c1630] text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-start gap-3 flex-1">
                                    <button
                                      type="button"
                                      className="mt-1 text-blue-400 hover:text-blue-300 shrink-0 cursor-pointer"
                                      aria-label={isChecked ? 'إلغاء التحديد' : 'تحديد الدرس'}
                                    >
                                      {isChecked ? (
                                        <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-slate-500 hover:text-slate-400" />
                                      )}
                                    </button>

                                    <div>
                                      <h5
                                        className={`text-sm font-bold ${
                                          isChecked ? 'text-white font-black' : 'text-slate-200'
                                        }`}
                                      >
                                        {lesson.title}
                                      </h5>
                                      {lesson.subtitle && (
                                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                          {lesson.subtitle}
                                        </p>
                                      )}

                                      {/* Key topics tags */}
                                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-[11px] text-slate-400">
                                        <span className="font-bold text-slate-300">المحتوى:</span>
                                        {lesson.keyTopics.map((topic, i) => (
                                          <span key={i}>
                                            {topic}
                                            {i < lesson.keyTopics.length - 1 && ' • '}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shrink-0 text-left flex flex-col items-end gap-1 text-xs">
                                    <span className="font-bold text-slate-200 tabular-nums">
                                      ~{lesson.estimatedHours} س
                                    </span>
                                    <span className={`text-[11px] font-semibold ${difficultyColor}`}>
                                      {difficultyText}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {lesson.examWeight === 'very-high'
                                        ? 'مضمون بالامتحان'
                                        : 'وزن أساسي'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#0b152d] rounded-3xl p-6 text-center border border-[#1b2f5d] shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2">
          أنهيت تحديد دروسك المتراكمة؟
        </h3>
        <p className="text-slate-300 text-sm max-w-xl mx-auto mb-4">
          اخترت حتى الآن{' '}
          <strong className="text-blue-400 font-black">{totalSelectedLessonsCount} درس محدد</strong> من{' '}
          <strong className="text-blue-400 font-black">{selectedSubjectsCount} مواد</strong> بإجمالي ~
          <strong className="text-blue-400 font-black">{totalEstimatedHours} ساعة</strong>. سننتقل الآن لتحديد عدد الأيام وإنشاء خطتك وجدولك.
        </p>
        <button
          onClick={onProceedToPlan}
          disabled={totalSelectedLessonsCount === 0}
          className={`px-8 py-3.5 rounded-xl font-bold text-base transition-all inline-flex items-center gap-2 cursor-pointer ${
            totalSelectedLessonsCount > 0
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>تحديد الأيام وتوليد الجدول والصورة</span>
          <span aria-hidden="true">←</span>
        </button>
      </div>
    </div>
  );
};
