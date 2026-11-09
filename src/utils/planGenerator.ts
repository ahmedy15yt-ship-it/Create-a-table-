import { Chapter, DayTask, GeneratedPlan, Lesson, ScheduleDay, StudentPreferences, Subject } from '../types/curriculum';
import { MOTIVATIONAL_QUOTES, SCI_BIO_SUBJECTS } from '../data/curriculumData';

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function generateStudyPlan(prefs: StudentPreferences): GeneratedPlan {
  const { studentName, totalDays, dailyHours, startDate, strategy, selectedLessons } = prefs;

  interface SelectedLessonItem {
    subject: Subject;
    chapter: Chapter;
    lesson: Lesson;
    adjustedMinutes: number;
  }

  const selectedItems: SelectedLessonItem[] = [];
  const timeMultiplier = strategy === 'intensive' ? 0.8 : strategy === 'deep' ? 1.25 : 1.0;

  Object.entries(selectedLessons).forEach(([subId, lessonIds]) => {
    const subject = SCI_BIO_SUBJECTS.find((s) => s.id === subId);
    if (!subject) return;

    lessonIds.forEach((lId) => {
      // Find which chapter this lesson belongs to
      for (const chapter of subject.chapters) {
        const lesson = chapter.lessons.find((l) => l.id === lId);
        if (lesson) {
          selectedItems.push({
            subject,
            chapter,
            lesson,
            adjustedMinutes: Math.round(lesson.estimatedHours * 60 * timeMultiplier),
          });
          break;
        }
      }
    });
  });

  const totalMinutesToDistribute = selectedItems.reduce((acc, curr) => acc + curr.adjustedMinutes, 0);
  const totalEstimatedHours = Math.round((totalMinutesToDistribute / 60) * 10) / 10;

  // Interleave subjects to balance cognitive energy
  const scienceItems = selectedItems.filter((i) => ['physics', 'chemistry', 'biology'].includes(i.subject.id));
  const generalItems = selectedItems.filter((i) => !['physics', 'chemistry', 'biology'].includes(i.subject.id));

  // Sort science items: hard lessons first
  scienceItems.sort((a, b) => {
    const weightVal = { 'very-high': 3, high: 2, medium: 1 };
    return weightVal[b.lesson.examWeight] - weightVal[a.lesson.examWeight];
  });

  const interleavedQueue: SelectedLessonItem[] = [];
  let sIdx = 0;
  let gIdx = 0;

  while (sIdx < scienceItems.length || gIdx < generalItems.length) {
    if (sIdx < scienceItems.length) {
      interleavedQueue.push(scienceItems[sIdx++]);
    }
    if (sIdx < scienceItems.length && generalItems.length === 0) {
      interleavedQueue.push(scienceItems[sIdx++]);
    }
    if (gIdx < generalItems.length) {
      interleavedQueue.push(generalItems[gIdx++]);
    }
  }

  // Break each lesson into atomic tasks (Study block + Solve/Practice block)
  interface AtomicTask {
    subjectId: string;
    subjectName: string;
    chapterTitle: string;
    lessonId: string;
    lessonTitle: string;
    taskType: 'study' | 'solve' | 'review';
    title: string;
    description: string;
    minutes: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }

  const atomicTasks: AtomicTask[] = [];

  interleavedQueue.forEach((item) => {
    const totalMins = item.adjustedMinutes;
    // 60% theory & concepts, 40% solving & applications
    const studyMins = Math.max(30, Math.round(totalMins * 0.6));
    const solveMins = Math.max(25, totalMins - studyMins);

    atomicTasks.push({
      subjectId: item.subject.id,
      subjectName: item.subject.name,
      chapterTitle: item.chapter.title,
      lessonId: item.lesson.id,
      lessonTitle: item.lesson.title,
      taskType: 'study',
      title: `مذاكرة وتثبيت مفاهيم: ${item.lesson.title}`,
      description: `استيعاب القواعد والرسومات: ${item.lesson.keyTopics.slice(0, 3).join(' • ')}`,
      minutes: studyMins,
      difficulty: item.lesson.difficulty,
    });

    atomicTasks.push({
      subjectId: item.subject.id,
      subjectName: item.subject.name,
      chapterTitle: item.chapter.title,
      lessonId: item.lesson.id,
      lessonTitle: item.lesson.title,
      taskType: 'solve',
      title: `حل أسئلة وتطبيقات: ${item.lesson.title}`,
      description: `حل تدريبات كتاب الامتحان / بابل شيت وتدوين التريكات والملاحظات`,
      minutes: solveMins,
      difficulty: item.lesson.difficulty,
    });
  });

  const targetDailyMinutes = dailyHours * 60;
  const dayBuckets: DayTask[][] = Array.from({ length: totalDays }, () => []);

  let currentDayIdx = 0;
  let currentDayMins = 0;

  atomicTasks.forEach((task, idx) => {
    const periodOrder: Array<'morning' | 'afternoon' | 'evening'> = ['morning', 'afternoon', 'evening'];
    const period = periodOrder[dayBuckets[currentDayIdx].length % 3];

    const dayTask: DayTask = {
      id: `task_${currentDayIdx}_${idx}`,
      subjectId: task.subjectId,
      subjectName: task.subjectName,
      chapterTitle: task.chapterTitle,
      lessonId: task.lessonId,
      lessonTitle: task.lessonTitle,
      taskType: task.taskType,
      title: task.title,
      description: task.description,
      estimatedMinutes: task.minutes,
      period,
      completed: false,
    };

    dayBuckets[currentDayIdx].push(dayTask);
    currentDayMins += task.minutes;

    if (currentDayMins >= targetDailyMinutes && currentDayIdx < totalDays - 1) {
      currentDayIdx++;
      currentDayMins = 0;
    }
  });

  // Final review/exam buffer on the last day if space permits
  const lastBucket = dayBuckets[totalDays - 1];
  if (lastBucket.length < 3) {
    lastBucket.push({
      id: `task_final_mock`,
      subjectId: 'general',
      subjectName: 'مراجعة عامة',
      chapterTitle: 'شامل كل الدروس المختارة',
      lessonId: 'final_mock',
      lessonTitle: 'امتحان محاكاة شامل',
      taskType: 'exam',
      title: 'حل نموذج شامل للربط بين الدروس ومراجعة النقاط الضعيفة',
      description: 'امتحان شامل بابل شيت في وقت قياسي للتأكد من هضم كافة الدروس المتراكمة.',
      estimatedMinutes: 90,
      period: 'evening',
      completed: false,
    });
  }

  const baseDate = startDate ? new Date(startDate) : new Date();
  if (isNaN(baseDate.getTime())) {
    baseDate.setTime(Date.now());
  }

  const days: ScheduleDay[] = [];

  for (let i = 0; i < totalDays; i++) {
    const dayDate = new Date(baseDate);
    dayDate.setDate(dayDate.getDate() + i);

    const dayOfWeek = ARABIC_DAYS[dayDate.getDay()];
    const dateFormatted = `${dayDate.getFullYear()}/${(dayDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${dayDate.getDate().toString().padStart(2, '0')}`;

    const tasks = dayBuckets[i];
    const totalDayMins = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

    const uniqueSubjects = Array.from(new Set(tasks.map((t) => t.subjectName)));
    const focusTitle = uniqueSubjects.length > 0 ? `التركيز: ${uniqueSubjects.join(' و ')}` : 'يوم مراجعة وتثبيت';
    const quote = MOTIVATIONAL_QUOTES[i % MOTIVATIONAL_QUOTES.length];

    days.push({
      dayNumber: i + 1,
      dateStr: dateFormatted,
      dayNameArabic: dayOfWeek,
      tasks,
      totalMinutes: totalDayMins,
      focusTitle,
      quote,
      completedTasksCount: 0,
    });
  }

  return {
    id: `plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    studentName: studentName.trim() || 'بطل الثانوية العامة',
    totalDays,
    dailyHours,
    strategy,
    selectedSubjectCount: Object.keys(selectedLessons).filter((k) => selectedLessons[k].length > 0).length,
    selectedLessonCount: Object.values(selectedLessons).reduce((acc, c) => acc + c.length, 0),
    totalEstimatedHours,
    days,
  };
}
