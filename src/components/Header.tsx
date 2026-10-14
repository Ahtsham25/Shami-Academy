import React, { useState } from 'react';
import { BookOpen, FileText, Download, Search, Globe, Menu, X, ChevronDown, Sparkles, ShieldCheck } from 'lucide-react';
import { ActiveView, GradeLevel } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  isUrdu: boolean;
  setIsUrdu: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenBloggerCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  selectedGrade,
  setSelectedGrade,
  isUrdu,
  setIsUrdu,
  searchQuery,
  setSearchQuery,
  onOpenBloggerCode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notesDropdownOpen, setNotesDropdownOpen] = useState(false);
  const [schemesDropdownOpen, setSchemesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSelectGradeNotes = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setActiveView('notes');
    setNotesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSelectGradeScheme = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setActiveView('schemes');
    setSchemesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Notice Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded tracking-wider uppercase">
              {isUrdu ? 'تازہ ترین' : 'LATEST'}
            </span>
            <span className="text-slate-300 text-xs truncate">
              {isUrdu
                ? 'سالانہ امتحانات 2026: کلاس 9، 10، 11، اور 12 کی پیرنگ سکیمیں اور نوٹس اپلوڈ ہو چکے ہیں!'
                : 'Annual Exams 2026: Class 9, 10, 11 & 12 Board Pairing Schemes & PDF Notes are now live!'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setIsUrdu(!isUrdu)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer font-medium"
              title="Toggle Urdu/English"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'English Mode' : 'اردو موڈ'}</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              {isUrdu ? 'تعلیمی پورٹل شامی اکیڈمی' : 'Shami Academy Educational Portal'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Brand Zone (Single-line wordmark with logo emblem) */}
        <div
          onClick={() => { setActiveView('home'); }}
          className="flex items-center gap-3 cursor-pointer shrink-0 select-none"
        >
          <img
            src="/src/assets/images/shami_academy_logo_1791941252395.jpg"
            alt="Shami Academy Logo"
            className="w-10 h-10 rounded-full border border-emerald-600/30 object-cover shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              SHAMI <span className="text-emerald-700">ACADEMY</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              {isUrdu ? 'شامی اکیڈمی لرننگ پورٹل' : 'Quality Education · Free Study Bank'}
            </span>
          </div>
        </div>

        {/* Desktop Nav Zone */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
          <button
            onClick={() => setActiveView('home')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 py-1 ${
              activeView === 'home' ? 'text-emerald-700 font-bold border-b-2 border-emerald-700' : ''
            }`}
          >
            {isUrdu ? 'ہوم' : 'Home'}
          </button>

          {/* Notes Mega Dropdown */}
          <div className="relative group">
            <button
              onMouseEnter={() => setNotesDropdownOpen(true)}
              onClick={() => { setActiveView('notes'); setNotesDropdownOpen(!notesDropdownOpen); }}
              className={`flex items-center gap-1 whitespace-nowrap transition-colors hover:text-emerald-700 py-1 ${
                activeView === 'notes' ? 'text-emerald-700 font-bold border-b-2 border-emerald-700' : ''
              }`}
            >
              <span>{isUrdu ? 'نوٹس' : 'Notes'}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform" />
            </button>

            <div
              onMouseLeave={() => setNotesDropdownOpen(false)}
              className="absolute left-0 top-full pt-2 w-64 hidden group-hover:block z-50"
            >
              <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-2 divide-y divide-slate-100">
                <div className="p-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {isUrdu ? 'کلاس کے لحاظ سے نوٹس' : 'Notes by Grade'}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleSelectGradeNotes('9th')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Class 9 Notes (نویں)</span>
                    <span className="text-xs text-slate-400">9 Subjects</span>
                  </button>
                  <button
                    onClick={() => handleSelectGradeNotes('10th')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Class 10 Notes (دسویں)</span>
                    <span className="text-xs text-slate-400">8 Subjects</span>
                  </button>
                  <button
                    onClick={() => handleSelectGradeNotes('11th')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Class 11 Notes (سال اول)</span>
                    <span className="text-xs text-slate-400">1st Year</span>
                  </button>
                  <button
                    onClick={() => handleSelectGradeNotes('12th')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Class 12 Notes (سال دوم)</span>
                    <span className="text-xs text-slate-400">2nd Year</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scheme Mega Dropdown */}
          <div className="relative group">
            <button
              onMouseEnter={() => setSchemesDropdownOpen(true)}
              onClick={() => { setActiveView('schemes'); setSchemesDropdownOpen(!schemesDropdownOpen); }}
              className={`flex items-center gap-1 whitespace-nowrap transition-colors hover:text-emerald-700 py-1 ${
                activeView === 'schemes' ? 'text-emerald-700 font-bold border-b-2 border-emerald-700' : ''
              }`}
            >
              <span>{isUrdu ? 'پیرنگ سکیم' : 'Scheme'}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform" />
            </button>

            <div
              onMouseLeave={() => setSchemesDropdownOpen(false)}
              className="absolute left-0 top-full pt-2 w-68 hidden group-hover:block z-50"
            >
              <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-2 divide-y divide-slate-100">
                <div className="p-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {isUrdu ? 'امتحانی پیرنگ سکیمیں 2026' : 'Pairing Schemes 2026'}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleSelectGradeScheme('9th')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Class 9 Scheme 2026</span>
                    <span className="text-xs text-emerald-600 font-medium">All Boards</span>
                  </button>
                  <button
                    onClick={() => handleSelectGradeScheme('10th')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Class 10 Scheme 2026</span>
                    <span className="text-xs text-emerald-600 font-medium">All Boards</span>
                  </button>
                  <button
                    onClick={() => handleSelectGradeScheme('11th')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Class 11 Scheme 2026</span>
                    <span className="text-xs text-emerald-600 font-medium">FSc / ICS</span>
                  </button>
                  <button
                    onClick={() => handleSelectGradeScheme('12th')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Class 12 Scheme 2026</span>
                    <span className="text-xs text-emerald-600 font-medium">FSc / ICS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('about')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 py-1 ${
              activeView === 'about' ? 'text-emerald-700 font-bold border-b-2 border-emerald-700' : ''
            }`}
          >
            {isUrdu ? 'ہمارے متعلق' : 'About Us'}
          </button>

          <button
            onClick={() => setActiveView('contact')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 py-1 ${
              activeView === 'contact' ? 'text-emerald-700 font-bold border-b-2 border-emerald-700' : ''
            }`}
          >
            {isUrdu ? 'رابطہ کریں' : 'Contact'}
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`flex items-center gap-1 whitespace-nowrap transition-colors hover:text-emerald-700 py-1 font-semibold ${
              activeView === 'admin' ? 'text-emerald-700 font-bold border-b-2 border-emerald-700' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isUrdu ? 'ایڈمن پینل' : 'Admin'}</span>
          </button>
        </nav>

        {/* Primary Action Zone (Admin, Blogger Theme Code & Search) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-300">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder={isUrdu ? 'نوٹس یا سکیم تلاش کریں...' : 'Search notes, schemes...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 focus:outline-hidden w-36 sm:w-48"
                  autoFocus
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-slate-400 hover:text-slate-600 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Search study materials"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* Admin Panel Direct Button */}
          <button
            onClick={() => setActiveView('admin')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
              activeView === 'admin'
                ? 'bg-slate-900 text-emerald-400 border-slate-750 shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}
            title="Open Admin & Drive Manager"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isUrdu ? 'ایڈمن پینل' : 'Admin Panel'}</span>
          </button>

          {/* Primary Action: Blogger Code Exporter Button */}
          <button
            onClick={onOpenBloggerCode}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isUrdu ? 'مکمل بلاگر کوڈ' : 'Blogger Code'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
            {isUrdu ? 'اہم مینو' : 'Main Menu'}
          </div>

          <button
            onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-800 hover:text-emerald-700"
          >
            {isUrdu ? 'ہوم پیج' : 'Home'}
          </button>

          {/* Notes Submenu */}
          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <div className="text-xs font-bold text-emerald-800">
              {isUrdu ? 'نوٹس (Notes):' : 'Class Notes:'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSelectGradeNotes('9th')}
                className="text-left py-1 text-slate-600 hover:text-emerald-700"
              >
                Class 9 Notes
              </button>
              <button
                onClick={() => handleSelectGradeNotes('10th')}
                className="text-left py-1 text-slate-600 hover:text-emerald-700"
              >
                Class 10 Notes
              </button>
              <button
                onClick={() => handleSelectGradeNotes('11th')}
                className="text-left py-1 text-slate-600 hover:text-emerald-700"
              >
                Class 11 Notes
              </button>
              <button
                onClick={() => handleSelectGradeNotes('12th')}
                className="text-left py-1 text-slate-600 hover:text-emerald-700"
              >
                Class 12 Notes
              </button>
            </div>
          </div>

          {/* Scheme Submenu */}
          <div className="bg-slate-50 p-3 rounded-lg space-y-2">
            <div className="text-xs font-bold text-emerald-800">
              {isUrdu ? 'پیرنگ سکیم (Pairing Scheme):' : 'Pairing Schemes 2026:'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSelectGradeScheme('9th')}
                className="text-left py-1 text-slate-600 hover:text-emerald-700"
              >
                Class 9 Scheme
              </button>
              <button
                onClick={() => handleSelectGradeScheme('10th')}
                className="text-left py-1 text-slate-600 hover:text-emerald-700"
              >
                Class 10 Scheme
              </button>
              <button
                onClick={() => handleSelectGradeScheme('11th')}
                className="text-left py-1 text-slate-600 hover:text-emerald-700"
              >
                Class 11 Scheme
              </button>
              <button
                onClick={() => handleSelectGradeScheme('12th')}
                className="text-left py-1 text-slate-600 hover:text-emerald-700"
              >
                Class 12 Scheme
              </button>
            </div>
          </div>

          {/* All Pages */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3 text-xs text-slate-600">
            <button onClick={() => { setActiveView('privacy'); setMobileMenuOpen(false); }}>
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => { setActiveView('disclaimer'); setMobileMenuOpen(false); }}>
              Disclaimer
            </button>
            <span>·</span>
            <button onClick={() => { setActiveView('about'); setMobileMenuOpen(false); }}>
              About Us
            </button>
            <span>·</span>
            <button onClick={() => { setActiveView('contact'); setMobileMenuOpen(false); }}>
              Contact Us
            </button>
          </div>

          {/* Admin Panel Mobile Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 text-emerald-400 font-bold text-xs rounded-xl border border-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isUrdu ? 'ایڈمن پینل (مینجمنٹ اور ڈرائیو لنکس)' : 'Admin Panel & Drive Manager'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
