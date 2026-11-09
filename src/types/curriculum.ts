export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  estimatedHours: number;
  difficulty: 'easy' | 'medium' | 'hard';
  examWeight: 'high' | 'very-high' | 'medium';
  keyTopics: string[];
}

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  lessons: Lesson[];
}

export interface Subject {
  id: string;
  name: string;
  englishName: string;
  iconName: string;
  color: string;
  accentColor: string;
  chapters: Chapter[];
  proTip: string;
}

export interface StudentPreferences {
  studentName: string;
  totalDays: number;
  dailyHours: number;
  startDate: string; // YYYY-MM-DD
  strategy: 'intensive' | 'balanced' | 'deep';
  selectedLessons: { [subjectId: string]: string[] }; // subjectId -> lessonIds
  wakeUpTime?: string;
}

export interface DayTask {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
  taskType: 'study' | 'solve' | 'review' | 'exam';
  title: string;
  description: string;
  estimatedMinutes: number;
  period: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  notes?: string;
}

export interface ScheduleDay {
  dayNumber: number;
  dateStr: string;
  dayNameArabic: string;
  tasks: DayTask[];
  totalMinutes: number;
  focusTitle: string;
  quote: string;
  completedTasksCount: number;
}

export interface GeneratedPlan {
  id: string;
  createdAt: string;
  studentName: string;
  totalDays: number;
  dailyHours: number;
  strategy: 'intensive' | 'balanced' | 'deep';
  selectedSubjectCount: number;
  selectedLessonCount: number;
  totalEstimatedHours: number;
  days: ScheduleDay[];
}
