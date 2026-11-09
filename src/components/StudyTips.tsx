import React, { useState } from 'react';
import { BookOpen, Dna, FlaskConical, Zap, Mountain, CheckCircle2, Lightbulb, Compass, Award } from 'lucide-react';

export const StudyTips: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<'bio' | 'chem' | 'phy' | 'geo' | 'general'>('general');

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header - Royal Blue Dark Gradient */}
      <div className="bg-gradient-to-br from-[#0c1630] via-[#112146] to-[#070e22] text-white rounded-3xl p-6 sm:p-8 border border-[#1e3363] shadow-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-950/70 border border-blue-500/40 px-3.5 py-1 rounded-full mb-3 shadow-sm shadow-blue-500/10">
          <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
          <span>روشتة إنقاذ وتفوق تالتة ثانوي علمي علوم</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          كيف تلم المتراكم وتضمن أعلى الدرجات؟
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
          أهم تريكات واستراتيجيات كبار أوائل الجمهورية في التعامل مع الفصول والدروس المتراكمة
          دون إحباط أو تسويف.
        </p>

        {/* Tab switch */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: 'general', label: 'طريقة الخطوات الـ 3 الذهبية', icon: Compass },
            { id: 'bio', label: 'الأحياء (الربط والوراثة)', icon: Dna },
            { id: 'chem', label: 'الكيمياء (العضوية والكهربية)', icon: FlaskConical },
            { id: 'phy', label: 'الفيزياء (الحث وكيرشوف)', icon: Zap },
            { id: 'geo', label: 'الجيولوجيا والبيئة', icon: Mountain },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedSubject === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSubject(tab.id as typeof selectedSubject)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on tab */}
      {selectedSubject === 'general' && (
        <div className="space-y-4">
          <div className="bg-[#091226] rounded-3xl p-6 sm:p-7 border border-[#192b52] shadow-xl">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span>قاعدة الـ (30% - 50% - 20%) لفرم أي درس متراكم</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#060c1c] border border-[#17274c] rounded-2xl">
                <span className="text-xs font-black text-blue-400 block mb-1">
                  1. الفهم السريع (30% من الوقت)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  لا تعد قراءة الدرس كلمة كلمة كأنك مبتدئ. افتح ملخص المدرس أو الفيديو السريع (1.5x)
                  لتذكر الخريطة العامة والمصطلحات والقوانين فقط.
                </p>
              </div>

              <div className="p-4 bg-[#060c1c] border border-[#17274c] rounded-2xl">
                <span className="text-xs font-black text-cyan-400 block mb-1">
                  2. الحل الفوري المتدرج (50% من الوقت)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ابدأ بـ 20 سؤال مباشر لتثبيت الثقة، ثم انتقل لأسئلة المستويات العليا وبنك الأسئلة
                  وامتحانات الأعوام السابقة فوراً.
                </p>
              </div>

              <div className="p-4 bg-[#060c1c] border border-[#17274c] rounded-2xl">
                <span className="text-xs font-black text-amber-400 block mb-1">
                  3. كشكول التريكات (20% من الوقت)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  كل فكرة سؤال أخطأت فيه أو وقفت عنده، اكتبها في كشكول خاص في سطرين. هذا الكشكول هو كنزك
                  في ليلة الامتحان!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#091226] rounded-3xl p-6 border border-[#192b52] shadow-xl">
            <h4 className="font-bold text-white mb-2">أكبر خطأ يقع فيه طالب علمي علوم:</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              «التسويف بحجة أن الوقت ضاع». اعلم أن شهري مارس وإبريل ومايو يصنعون الفارق الحقيقي. 70% من
              أوائل الجمهورية كان لديهم متراكم في هذه الفترة ونظموا جدولاً مشابهاً والتزموا به ووصلوا
              لكليات القمة.
            </p>
          </div>
        </div>
      )}

      {selectedSubject === 'bio' && (
        <div className="bg-[#091226] rounded-3xl p-6 sm:p-7 border border-[#192b52] shadow-xl space-y-4">
          <h3 className="text-lg font-black text-blue-300">
            روشتة إنقاذ الأحياء (شعبة علمي علوم)
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">فصل التكاثر:</strong> اهتم برسم مراحل تكوين الحيوانات المنوية والبويضات
                ودورة الطمث (مستويات الهرمونات FSH, LH, الإستروجين، البروجسترون) وارتباطها بالأيام.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">فصل المناعة:</strong> فرق تماماً بين المناعة الخلطية (بالخلايا البائية والأجسام المضادة)
                والمناعة الخلوية (بالخلايا التائية Tc و NK والبلعمية)، وركز على دور السيتوكينات والإنترلوكينات.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">البيولوجيا الجزيئية (DNA & RNA):</strong> تدرب على حسابات عدد الروابط الهيدروجينية،
                عدد القواعد النيتروجينية، مضادات الكودونات، وإنزيمات تضاعف الـ DNA وقصر البكتيريا.
              </span>
            </li>
          </ul>
        </div>
      )}

      {selectedSubject === 'chem' && (
        <div className="bg-[#091226] rounded-3xl p-6 sm:p-7 border border-[#192b52] shadow-xl space-y-4">
          <h3 className="text-lg font-black text-cyan-300">
            روشتة إنقاذ الكيمياء
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">الكيمياء العضوية:</strong> السر يكمن في رسم «شجرة التحويلات» بيدك على لوحة كبيرة
                (كيف تحصل على مركب من مركب آخر). التسمية بنظام الأيوباك تأتي عليها درجات مضمونة.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">الاتزان والكهربية:</strong> حل 5 مسائل يومياً بالورقة والقلم على قوانين فاراداي
                وحساب القوة الدافعة الكهربية EMF وثابت الاتزان Kc وحاصل الإذابة Ksp.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">التحليل الكيميائي والحديد:</strong> جدول الألوان ورواسب أنيونات وكشف الكاتيونات
                يحتاج تكرار مراجعة بصرية لمدة 10 دقائق كل صباح.
              </span>
            </li>
          </ul>
        </div>
      )}

      {selectedSubject === 'phy' && (
        <div className="bg-[#091226] rounded-3xl p-6 sm:p-7 border border-[#192b52] shadow-xl space-y-4">
          <h3 className="text-lg font-black text-amber-300">
            روشتة إنقاذ الفيزياء
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">الفصل الثالث (الحث الكهرومغناطيسي):</strong> هو قلب منهج الفيزياء في ثانوية عامة.
                افهم قاعدة لينز فليمنج لليد اليمنى، ومعادلات الدينامو (اللحظية والفعالة والعظمى)، والمحول والمحرك.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">أجهزة القياس الكهربية:</strong> افهم استنتاج قوانين مجزئ التيار ومضاعف الجهد ومقاومة الأوميتر
                وتدريج الأوميتر العكسي غير المنتظم.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">الفيزياء الحديثة (الفصول 5-8):</strong> درجاتها مضمونة وسهلة التحصيل! راجع ظاهرة كومتون،
                الظاهرة الكهروضوئية، وأشعة الليزر وأشباه الموصلات.
              </span>
            </li>
          </ul>
        </div>
      )}

      {selectedSubject === 'geo' && (
        <div className="bg-[#091226] rounded-3xl p-6 sm:p-7 border border-[#192b52] shadow-xl space-y-4">
          <h3 className="text-lg font-black text-blue-300">
            روشتة إنقاذ الجيولوجيا وعلوم البيئة
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">القطاعات الجيولوجية:</strong> تدرب على استخراج أسطح عدم التوافق (متباين، زاوي، انقطاعي)
                وحساب أعمار الصخور وتحديد نوع الفوالق (عادي أو معكوس أو دسر).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">الصخور ومخطط بوين:</strong> احفظ مخطط تفاعلات بوين ونسيج الصخور (زجاجي، دقيق، خشن، بورفيري).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">علوم البيئة:</strong> سلاسل الغذاء وهرم الطاقة وفقدان 90% من الطاقة عند الانتقال من مستوى غذائي
                لآخر تأتي دائماً في الامتحان.
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
