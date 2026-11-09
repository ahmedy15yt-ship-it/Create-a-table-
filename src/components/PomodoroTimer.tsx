import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  initialTaskName?: string;
  initialMinutes?: number;
  onBackToSchedule: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  initialTaskName,
  initialMinutes = 25,
  onBackToSchedule,
}) => {
  const [mode, setMode] = useState<'study' | 'shortBreak' | 'longBreak'>('study');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [taskName, setTaskName] = useState<string>(
    initialTaskName || 'مذاكرة وحل أسئلة متراكمة'
  );

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playChime();

            if (mode === 'study') {
              setCompletedSessions((c) => c + 1);
              try {
                confetti({ particleCount: 50, spread: 70, colors: ['#3b82f6', '#60a5fa', '#93c5fd'] });
              } catch (e) {}
              setMode('shortBreak');
              return 5 * 60;
            } else {
              setMode('study');
              return durationMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, durationMinutes, soundEnabled]);

  const switchMode = (newMode: 'study' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'study') {
      setSecondsLeft(durationMinutes * 60);
    } else if (newMode === 'shortBreak') {
      setSecondsLeft(5 * 60);
    } else {
      setSecondsLeft(15 * 60);
    }
  };

  const handleStudyPreset = (mins: number) => {
    setDurationMinutes(mins);
    if (mode === 'study') {
      setIsRunning(false);
      setSecondsLeft(mins * 60);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'study') {
      setSecondsLeft(durationMinutes * 60);
    } else if (mode === 'shortBreak') {
      setSecondsLeft(5 * 60);
    } else {
      setSecondsLeft(15 * 60);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const currentTotal =
    mode === 'study' ? durationMinutes * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progressPercent = Math.min(100, Math.max(0, ((currentTotal - secondsLeft) / currentTotal) * 100));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[#091226] rounded-3xl p-6 sm:p-8 border border-[#192b52] shadow-2xl text-center text-white">
        {/* Navigation back */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToSchedule}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>← العودة لجدول اليوم</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-[#0e1936] border border-[#1b2f5b] cursor-pointer"
            title={soundEnabled ? 'كتم الصوت' : 'تفعيل رنين الانتهاء'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Task Name Input */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-400 block mb-1">
            المهمة التي تركز عليها الآن:
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full text-center text-lg sm:text-xl font-black text-white border-b-2 border-[#1c3260] focus:border-blue-500 outline-none pb-1 bg-transparent placeholder-slate-500"
            placeholder="اكتب اسم الفصل أو المسائل..."
          />
        </div>

        {/* Mode Tabs */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-[#060b18] rounded-2xl mb-8 border border-[#132247]">
          <button
            onClick={() => switchMode('study')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'study' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            جلسة تركيز ({durationMinutes} د)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'shortBreak' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            استراحة قصيرة (5 د)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'longBreak' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            استراحة طويلة (15 د)
          </button>
        </div>

        {/* Digital Clock Display */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-[#0e1a38]"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={mode === 'study' ? 'text-blue-500' : 'text-cyan-400'}
              strokeWidth="6"
              strokeDasharray={282.7}
              strokeDashoffset={282.7 - (282.7 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-white tracking-tight font-mono tabular-nums">
              {timeFormatted}
            </span>
            <span className="text-xs font-bold text-slate-400 mt-2">
              {mode === 'study' ? 'وقت المذاكرة والحل' : 'وقت الاستراحة والتنفس'}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-black text-base text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>ابدأ المذاكرة</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl text-slate-300 hover:text-white bg-[#0e1936] hover:bg-[#15254c] border border-[#1b2f5b] transition-all cursor-pointer"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Quick study length selector */}
        {mode === 'study' && (
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-slate-400">مدة الجلسة:</span>
            {[25, 45, 50, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => handleStudyPreset(mins)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  durationMinutes === mins
                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm shadow-blue-600/30'
                    : 'bg-[#0e1936] text-slate-300 border-[#1b2f5b] hover:bg-[#132247]'
                }`}
              >
                {mins} د
              </button>
            ))}
          </div>
        )}

        {/* Sessions Counter */}
        <div className="mt-8 pt-6 border-t border-[#16274b] flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>أنجزت اليوم:</span>
          <span className="font-black text-blue-400 text-sm tabular-nums">
            {completedSessions} جلسات تركيز
          </span>
        </div>
      </div>
    </div>
  );
};
