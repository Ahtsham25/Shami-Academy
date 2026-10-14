import React from 'react';
import { ActiveView, GradeLevel } from '../types';
import { ArrowUp, BookOpen, Shield, Heart } from 'lucide-react';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  setSelectedGrade: (grade: GradeLevel) => void;
  isUrdu: boolean;
  onOpenBloggerCode: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveView,
  setSelectedGrade,
  isUrdu,
  onOpenBloggerCode,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGradeNotes = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setActiveView('notes');
    scrollToTop();
  };

  const handleGradeScheme = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setActiveView('schemes');
    scrollToTop();
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & About Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/shami_academy_logo_1791941252395.jpg"
                alt="Shami Academy Logo"
                className="w-10 h-10 rounded-full border border-emerald-500/40 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-extrabold text-white tracking-tight">
                SHAMI <span className="text-emerald-400">ACADEMY</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {isUrdu
                ? 'شامی اکیڈمی پنجاب اور فیڈرل بورڈز کے طلباء کے لیے ایک مکمل مفت تعلیمی پورٹل ہے۔ یہاں کلاس 9، 10، 11 اور 12 کے تمام مضامین کے نوٹس اور پیرنگ سکیمیں دستیاب ہیں۔'
                : 'Shami Academy is an educational study bank providing Class 9, 10, 11, and 12 students with syllabus-aligned chapter notes, solved past papers, formula sheets, and 2026 board pairing schemes.'}
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenBloggerCode}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 rounded-lg font-bold text-xs transition-colors cursor-pointer"
              >
                <span>{isUrdu ? 'مفت بلاگر تھیم کوڈ حاصل کریں' : 'Get WordPress Blogger Theme Code'}</span>
                &rarr;
              </button>
            </div>
          </div>

          {/* Quick Notes Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">
              {isUrdu ? 'کلاس نوٹس' : 'Class Notes'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => handleGradeNotes('9th')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Class 9 Notes (Matric 1)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGradeNotes('10th')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Class 10 Notes (Matric 2)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGradeNotes('11th')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Class 11 Notes (1st Year)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGradeNotes('12th')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Class 12 Notes (2nd Year)
                </button>
              </li>
            </ul>
          </div>

          {/* Pairing Schemes Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">
              {isUrdu ? 'پیرنگ سکیمیں' : 'Pairing Schemes'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => handleGradeScheme('9th')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Class 9 Scheme 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGradeScheme('10th')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Class 10 Scheme 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGradeScheme('11th')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Class 11 Scheme 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleGradeScheme('12th')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Class 12 Scheme 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Static Pages */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">
              {isUrdu ? 'ضروری صفحات' : 'All Pages'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => { setActiveView('privacy'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveView('disclaimer'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveView('about'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Shami Academy
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveView('contact'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveView('terms'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => { setActiveView('admin'); scrollToTop(); }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>{isUrdu ? '🔐 ایڈمن کنٹرول پینل' : '🔐 Admin Control Panel'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Shami Academy. All rights reserved. Free Educational Portal for Pakistani Students.
          </div>

          <div className="flex items-center gap-4">
            <span>WordPress Aesthetic on Blogger</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
