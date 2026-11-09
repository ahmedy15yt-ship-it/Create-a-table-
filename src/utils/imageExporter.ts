import { GeneratedPlan } from '../types/curriculum';
import { SCI_BIO_SUBJECTS } from '../data/curriculumData';

/**
 * Renders a high-resolution, exportable schedule poster image (PNG) on an HTML5 canvas.
 * Designed with high contrast, crisp Arabic typography (Cairo), subject color-coding,
 * and a clean layout suitable for phone lock-screens or physical A4 printing.
 */
export async function generateSchedulePoster(
  plan: GeneratedPlan,
  scale: number = 2
): Promise<string> {
  // Setup canvas dimensions
  // Target width 1200px (x2 = 2400px for retina), height dynamically computed
  const baseWidth = 1200;
  
  // Calculate dynamic height based on number of days and tasks
  const headerHeight = 240;
  const subjectsSectionHeight = 110;
  const dayRowHeight = 140; // average day row height
  const daysTotalHeight = plan.days.length * dayRowHeight;
  const footerHeight = 110;
  const totalBaseHeight = Math.max(1600, headerHeight + subjectsSectionHeight + daysTotalHeight + footerHeight);

  const canvas = document.createElement('canvas');
  canvas.width = baseWidth * scale;
  canvas.height = totalBaseHeight * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.scale(scale, scale);

  // Background gradient: Deep royal midnight sapphire
  const bgGradient = ctx.createLinearGradient(0, 0, baseWidth, totalBaseHeight);
  bgGradient.addColorStop(0, '#070e22');
  bgGradient.addColorStop(0.35, '#0b1738');
  bgGradient.addColorStop(0.7, '#081129');
  bgGradient.addColorStop(1, '#050a18');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, baseWidth, totalBaseHeight);

  // Decorative top aesthetic banner accent - Royal Blue & Azure
  const topAccent = ctx.createLinearGradient(0, 0, baseWidth, 0);
  topAccent.addColorStop(0, '#1e40af'); // blue-800
  topAccent.addColorStop(0.35, '#3b82f6'); // blue-500
  topAccent.addColorStop(0.7, '#60a5fa'); // blue-400
  topAccent.addColorStop(1, '#38bdf8'); // sky-400
  ctx.fillStyle = topAccent;
  ctx.fillRect(0, 0, baseWidth, 8);

  // Ensure Arabic font is loaded or fallback gracefully
  const fontCairo = "'Cairo', 'Tajawal', sans-serif";

  // HEADER CONTAINER
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';

  // Subtitle / Kicker
  ctx.fillStyle = '#60a5fa';
  ctx.font = `bold 16px ${fontCairo}`;
  ctx.fillText('منظومة إنقاذ المتراكم • تالتة ثانوي علمي علوم 2027 (دفعة 2027)', baseWidth - 60, 55);

  // Main Title
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 36px ${fontCairo}`;
  ctx.fillText(`خطة لم المتراكم: ${plan.studentName}`, baseWidth - 60, 105);

  // Secondary sub-info
  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 16px ${fontCairo}`;
  ctx.fillText(`الاستراتيجية: ${plan.strategy === 'intensive' ? 'مكثف وسريع' : plan.strategy === 'deep' ? 'شامل وتأسيسي' : 'متوازن مع حل مكثف'} • تاريخ البدء: ${plan.days[0]?.dateStr || 'اليوم'}`, baseWidth - 60, 140);

  // Metric stat chips (left-aligned in RTL canvas)
  ctx.textAlign = 'left';
  const drawStatBox = (x: number, y: number, label: string, value: string, color: string) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, 120, 75, 12);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.font = `900 24px ${fontCairo}`;
    ctx.fillText(value, x + 60, y + 36);

    ctx.fillStyle = '#94a3b8';
    ctx.font = `bold 12px ${fontCairo}`;
    ctx.fillText(label, x + 60, y + 58);
  };

  drawStatBox(60, 45, 'عدد الأيام', `${plan.totalDays} أيام`, '#38bdf8');
  drawStatBox(195, 45, 'ساعات يومياً', `${plan.dailyHours} س`, '#10b981');
  drawStatBox(330, 45, 'إجمالي الساعات', `${plan.totalEstimatedHours} س`, '#fbbf24');
  drawStatBox(465, 45, 'الدروس المتراكمة', `${plan.selectedLessonCount}`, '#c084fc');

  // Hairline separator
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 175);
  ctx.lineTo(baseWidth - 60, 175);
  ctx.stroke();

  // SUBJECTS BADGE BAR
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `bold 15px ${fontCairo}`;
  ctx.fillText('المواد المختارة في الخطة:', baseWidth - 60, 205);

  // Draw subject pills
  let pillX = baseWidth - 210;
  const pillY = 190;
  const selectedSubIds = Array.from(new Set(plan.days.flatMap((d) => d.tasks.map((t) => t.subjectId))));

  selectedSubIds.forEach((sId) => {
    const sub = SCI_BIO_SUBJECTS.find((s) => s.id === sId);
    if (!sub) return;

    ctx.font = `bold 13px ${fontCairo}`;
    const textWidth = ctx.measureText(sub.name).width;
    const pillWidth = textWidth + 30;

    // Background
    ctx.fillStyle = `${sub.color}22`;
    ctx.strokeStyle = sub.accentColor;
    ctx.lineWidth = 1.2;
    roundRect(ctx, pillX - pillWidth, pillY, pillWidth, 28, 14);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(sub.name, pillX - pillWidth / 2, pillY + 19);

    pillX -= pillWidth + 12;
  });

  // SCHEDULE DAYS GRID / ROWS
  let startY = 250;

  plan.days.forEach((day) => {
    // Container row
    const rowHeight = dayRowHeight - 15;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, 60, startY, baseWidth - 120, rowHeight, 14);
    ctx.fill();
    ctx.stroke();

    // Day Header Pill on right
    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0e1c3e';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    roundRect(ctx, baseWidth - 190, startY + 12, 115, 60, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#60a5fa';
    ctx.font = `900 18px ${fontCairo}`;
    ctx.fillText(`اليوم ${day.dayNumber}`, baseWidth - 190 + 57, startY + 37);

    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 12px ${fontCairo}`;
    ctx.fillText(`${day.dayNameArabic}`, baseWidth - 190 + 57, startY + 57);

    // Focus title & quote
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f8fafc';
    ctx.font = `bold 16px ${fontCairo}`;
    ctx.fillText(day.focusTitle, baseWidth - 215, startY + 32);

    ctx.fillStyle = '#64748b';
    ctx.font = `400 12px ${fontCairo}`;
    const cleanQuote = day.quote.length > 65 ? day.quote.slice(0, 65) + '...' : day.quote;
    ctx.fillText(`💡 ${cleanQuote}`, baseWidth - 215, startY + 54);

    // Tasks list horizontally / 3 columns
    const taskColWidth = (baseWidth - 290) / 3;
    const taskY = startY + 70;

    day.tasks.slice(0, 3).forEach((task, tIdx) => {
      const taskX = baseWidth - 215 - (tIdx + 1) * taskColWidth;

      // Small task card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      roundRect(ctx, taskX, taskY, taskColWidth - 10, 42, 8);
      ctx.fill();
      ctx.stroke();

      // Checkbox circle
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(taskX + taskColWidth - 22, taskY + 21, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Subject indicator dot
      const taskSub = SCI_BIO_SUBJECTS.find((s) => s.id === task.subjectId);
      ctx.fillStyle = taskSub ? taskSub.color : '#38bdf8';
      ctx.beginPath();
      ctx.arc(taskX + taskColWidth - 36, taskY + 21, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Task short text
      ctx.textAlign = 'right';
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `600 12px ${fontCairo}`;
      const taskTitle = task.lessonTitle.length > 26 ? task.lessonTitle.slice(0, 26) + '...' : task.lessonTitle;
      ctx.fillText(taskTitle, taskX + taskColWidth - 46, taskY + 20);

      ctx.fillStyle = '#94a3b8';
      ctx.font = `400 10px ${fontCairo}`;
      ctx.fillText(
        `${task.taskType === 'study' ? 'مذاكرة' : task.taskType === 'solve' ? 'حل مسائل' : 'مراجعة'} (${Math.round(task.estimatedMinutes / 60)}س)`,
        taskX + taskColWidth - 46,
        taskY + 34
      );
    });

    startY += dayRowHeight;
  });

  // FOOTER BANNER
  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = `bold 16px ${fontCairo}`;
  ctx.fillText('«وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ وَأَنَّ سَعْيَهُ سَوْفَ يُرَىٰ»', baseWidth / 2, totalBaseHeight - 62);

  ctx.fillStyle = '#f59e0b'; // amber-400
  ctx.font = `bold 13px ${fontCairo}`;
  ctx.fillText('تم عمل هذا الموقع بواسطة أحمد يحيى • نسألكم الدعاء له بالتوفيق والسداد في الدنيا والآخرة 🤲', baseWidth / 2, totalBaseHeight - 38);

  ctx.fillStyle = '#64748b';
  ctx.font = `500 12px ${fontCairo}`;
  ctx.fillText('موقع منقذ تالتة ثانوي علمي علوم 2027 • دفعة 2027 • احفظ الصورة في هاتفك أو اطبعها للمتابعة اليومية', baseWidth / 2, totalBaseHeight - 16);

  return canvas.toDataURL('image/png');
}

// Utility function to draw rounded rectangles on 2d canvas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Initiates direct download of the image data URL in the user's browser.
 */
export function downloadImage(dataUrl: string, filename: string = 'جدول_لم_المتراكم_تالتة_ثانوي.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
