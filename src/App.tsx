import React, { useState, useEffect } from 'react';
import { ActiveView, GradeLevel, NoteDetail } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { NotesSection } from './components/NotesSection';
import { SchemesSection } from './components/SchemesSection';
import { NoteReaderModal } from './components/NoteReaderModal';
import { BloggerCodeModal } from './components/BloggerCodeModal';
import { PolicyPages } from './components/PolicyPages';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { BookOpen, Sparkles, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { syncNotesFromStaticJson } from './utils/notesStorage';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('9th');
  const [isUrdu, setIsUrdu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingNote, setReadingNote] = useState<NoteDetail | null>(null);
  const [readerTab, setReaderTab] = useState<'summary' | 'gdrive' | 'questions' | 'formulas' | 'quiz'>('summary');
  const [isBloggerCodeOpen, setIsBloggerCodeOpen] = useState<boolean>(false);

  useEffect(() => {
    syncNotesFromStaticJson();
  }, []);

  const handleOpenReader = (
    note: NoteDetail,
    initialTab: 'summary' | 'gdrive' | 'questions' | 'formulas' | 'quiz' = 'summary'
  ) => {
    setReadingNote(note);
    setReaderTab(initialTab);
  };

  const handleCloseReader = () => {
    setReadingNote(null);
  };

  if (activeView === 'admin') {
    return (
      <AdminPanel
        onBackToPortal={() => setActiveView('home')}
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Sticky Top Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        isUrdu={isUrdu}
        setIsUrdu={setIsUrdu}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenBloggerCode={() => setIsBloggerCodeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            {/* Hero Section with Grade Selector */}
            <HeroSection
              selectedGrade={selectedGrade}
              setSelectedGrade={setSelectedGrade}
              setActiveView={setActiveView}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isUrdu={isUrdu}
              onOpenBloggerCode={() => setIsBloggerCodeOpen(true)}
            />

            {/* Quick Feature Callout: Blogger Code Banner */}
            <section className="bg-emerald-800 text-white py-4 px-4 sm:px-8 border-y border-emerald-900">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-700 rounded-lg">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <span className="font-bold text-white">
                      {isUrdu
                        ? 'مفت بلاگر ورڈپریس تھیم کوڈ دستیاب ہے:'
                        : 'Free WordPress-Style Blogger Theme Available:'}
                    </span>
                    <span className="text-emerald-200 ml-1.5 hidden md:inline">
                      {isUrdu
                        ? 'اپنے فری بلاگر اکاؤنٹ کے لیے ایچ ٹی ایم ایل، سی ایس ایس اور جاوا اسکرپٹ کا مکمل کوڈ حاصل کریں۔'
                        : 'Get the complete single-file HTML, CSS & Blogger XML code with full responsive navigation & ad units.'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsBloggerCodeOpen(true)}
                  className="px-3.5 py-1.5 bg-white text-emerald-950 font-bold rounded-lg hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span>{isUrdu ? 'کوڈ حاصل کریں' : 'Copy Theme Code'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* Notes Section */}
            <NotesSection
              selectedGrade={selectedGrade}
              setSelectedGrade={setSelectedGrade}
              onOpenReader={handleOpenReader}
              searchQuery={searchQuery}
              isUrdu={isUrdu}
            />

            {/* Pairing Schemes Section */}
            <div className="bg-white border-t border-slate-200">
              <SchemesSection
                selectedGrade={selectedGrade}
                setSelectedGrade={setSelectedGrade}
                isUrdu={isUrdu}
              />
            </div>
          </>
        )}

        {activeView === 'notes' && (
          <NotesSection
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            onOpenReader={handleOpenReader}
            searchQuery={searchQuery}
            isUrdu={isUrdu}
          />
        )}

        {activeView === 'schemes' && (
          <SchemesSection
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            isUrdu={isUrdu}
          />
        )}

        {/* Legal & Information Pages */}
        {(activeView === 'privacy' ||
          activeView === 'disclaimer' ||
          activeView === 'about' ||
          activeView === 'contact' ||
          activeView === 'terms') && (
          <PolicyPages view={activeView} isUrdu={isUrdu} />
        )}
      </main>

      {/* Note Reader Modal */}
      <NoteReaderModal
        note={readingNote}
        initialTab={readerTab}
        onClose={handleCloseReader}
        isUrdu={isUrdu}
      />

      {/* Full Blogger Code Exporter Modal */}
      <BloggerCodeModal
        isOpen={isBloggerCodeOpen}
        onClose={() => setIsBloggerCodeOpen(false)}
        isUrdu={isUrdu}
      />

      {/* Multi-Column Footer */}
      <Footer
        setActiveView={setActiveView}
        setSelectedGrade={setSelectedGrade}
        isUrdu={isUrdu}
        onOpenBloggerCode={() => setIsBloggerCodeOpen(true)}
      />
    </div>
  );
}
