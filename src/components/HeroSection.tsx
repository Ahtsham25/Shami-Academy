import React from 'react';
import { GradeLevel, ActiveView } from '../types';
import { Search, BookCheck, ShieldCheck, Download, Sparkles, GraduationCap } from 'lucide-react';
import { GRADES } from '../data/academicData';

interface HeroSectionProps {
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  setActiveView: (view: ActiveView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isUrdu: boolean;
  onOpenBloggerCode: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedGrade,
  setSelectedGrade,
  setActiveView,
  searchQuery,
  setSearchQuery,
  isUrdu,
  onOpenBloggerCode,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
        <img
          src="/src/assets/images/hero_shami_academy_1791941254802.jpg"
          alt="Shami Academy Classroom"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Trust Badge / Editorial lead-in (Zero-pill compliant) */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            <span>Punjab & Federal Educational Boards</span>
            <span aria-hidden="true">·</span>
            <span>Matric & Intermediate</span>
            <span aria-hidden="true">·</span>
            <span>2026 Academic Session</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
            {isUrdu ? (
              <span className="font-urdu block">
                شامی اکیڈمی — نوٹس اور امتحانی پیرنگ سکیمیں
              </span>
            ) : (
              <span>
                Shami Academy — Complete Notes & Board Pairing Schemes
              </span>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {isUrdu ? (
              <span className="font-urdu">
                کلاس 9، 10، 11 اور 12 کے تمام مضامین کے جامع نوٹس، حل شدہ مشقی سوالات، معروضی سوالات، اور سالانہ بورڈ پیپر سکیمیں مکمل طور پر مفت حاصل کریں۔
              </span>
            ) : (
              <span>
                Access syllabus-aligned chapter notes, solved exercise questions, numerical formulas, and official board pairing schemes for Classes 9, 10, 11, and 12.
              </span>
            )}
          </p>

          {/* Real-time Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-xl shadow-lg p-1.5 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder={
                  isUrdu
                    ? 'سبق یا مضمون تلاش کریں (مثلاً Physics Ch 1, 10th Scheme)...'
                    : 'Search subjects, chapters, formulas (e.g. 9th Physics Ch 1, 10th Pairing)...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-transparent focus:outline-hidden placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Grade Selector Segmented Controls (Interactive Filter buttons) */}
          <div className="pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              {isUrdu ? 'اپنی کلاس منتخب کریں:' : 'Select Your Grade:'}
            </div>
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800">
              {GRADES.map((grade) => {
                const isActive = selectedGrade === grade.id;
                return (
                  <button
                    key={grade.id}
                    onClick={() => {
                      setSelectedGrade(grade.id);
                      setActiveView('notes');
                    }}
                    className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{grade.name}</span>
                    <span className="hidden sm:inline text-xs text-emerald-200 ml-1">
                      ({isUrdu ? grade.nameUrdu : grade.id})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <button
              onClick={() => setActiveView('schemes')}
              className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <BookCheck className="w-4 h-4 text-emerald-400" />
              <span>{isUrdu ? 'پیرنگ سکیمیں 2026' : 'View 2026 Schemes'}</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenBloggerCode}
              className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isUrdu ? 'بلاگر ورڈپریس کوڈ حاصل کریں' : 'Free Blogger Theme Code'}</span>
            </button>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free Downloads</span>
            </div>
          </div>
        </div>

        {/* 4-Column Academic KPI Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">4</div>
            <div className="text-xs text-slate-400 mt-1">{isUrdu ? 'کلاسز (9 تا 12)' : 'Classes (9th to 12th)'}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">30+</div>
            <div className="text-xs text-slate-400 mt-1">{isUrdu ? 'مضامین' : 'Academic Subjects'}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">250+</div>
            <div className="text-xs text-slate-400 mt-1">{isUrdu ? 'حل شدہ چیپٹرز' : 'Solved Chapters'}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">100%</div>
            <div className="text-xs text-slate-400 mt-1">{isUrdu ? 'مفت پی ڈی ایف' : 'Free PDF Access'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
