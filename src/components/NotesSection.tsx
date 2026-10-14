import React, { useState, useEffect } from 'react';
import { GradeLevel, SubjectItem, NoteDetail } from '../types';
import { GRADES, SUBJECTS } from '../data/academicData';
import { getStoredNotes } from '../utils/notesStorage';
import { BookOpen, Download, Eye, FileText, CheckCircle2, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface NotesSectionProps {
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  onOpenReader: (note: NoteDetail, initialTab?: 'summary' | 'gdrive' | 'questions' | 'formulas' | 'quiz') => void;
  searchQuery: string;
  isUrdu: boolean;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  selectedGrade,
  setSelectedGrade,
  onOpenReader,
  searchQuery,
  isUrdu,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [allNotes, setAllNotes] = useState<NoteDetail[]>(getStoredNotes());

  useEffect(() => {
    const handleUpdate = () => {
      setAllNotes(getStoredNotes());
    };
    handleUpdate();
    window.addEventListener('shami_notes_updated', handleUpdate);
    return () => window.removeEventListener('shami_notes_updated', handleUpdate);
  }, []);

  // Filter subjects for the selected grade
  const gradeSubjects = SUBJECTS.filter((s) => s.grade === selectedGrade);

  // Filter notes
  const filteredNotes = allNotes.filter((note) => {
    const matchGrade = note.grade === selectedGrade;
    const matchSubject = selectedSubjectId === 'all' || note.subjectId === selectedSubjectId;
    const matchSearch =
      searchQuery.trim() === '' ||
      note.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSubject && matchSearch;
  });

  const handleDownload = (note: NoteDetail) => {
    setDownloadSuccessId(note.id);
    
    // Simulate real PDF generation/download via Blob
    const content = `SHAMI ACADEMY - OFFICIAL STUDY NOTES\nSubject: ${note.subjectName} (${note.grade})\nChapter ${note.chapterNumber}: ${note.chapterTitle}\n\nSUMMARY:\n${note.summary}\n\nKEY FORMULAS:\n${note.keyFormulas ? note.keyFormulas.join('\n') : 'N/A'}\n\nSOLVED EXERCISE QUESTIONS:\n${note.solvedQuestions.map((q) => `${q.questionNumber}: ${q.question}\nAns: ${q.answer}\n`).join('\n')}\n\nDownloaded from Shami Academy Free Academic Portal.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Shami-Academy-${note.grade}-${note.subjectName}-Ch${note.chapterNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 3000);
  };

  const currentGradeObj = GRADES.find((g) => g.id === selectedGrade);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase mb-1">
            {isUrdu ? 'مضامین اور نوٹس' : 'ACADEMIC RESOURCES'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isUrdu ? (
              <span className="font-urdu">{currentGradeObj?.nameUrdu} — مکمل نوٹس</span>
            ) : (
              <span>{currentGradeObj?.name} Chapter-Wise Solved Notes</span>
            )}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isUrdu
              ? 'بورڈ کے طریقہ کار کے مطابق مکمل حل شدہ مشقیں، کثیر الانتخابی سوالات اور فارمولہ شیٹس۔'
              : 'Complete chapter summaries, definitions, solved past paper questions, and formulas.'}
          </p>
        </div>

        {/* Grade Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto shrink-0">
          {GRADES.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setSelectedGrade(g.id);
                setSelectedSubjectId('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedGrade === g.id
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="py-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            selectedSubjectId === 'all'
              ? 'bg-emerald-800 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isUrdu ? 'تمام مضامین' : 'All Subjects'}
        </button>
        {gradeSubjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{sub.name}</span>
              {isUrdu && <span className="text-[11px] ml-1">({sub.nameUrdu})</span>}
            </button>
          );
        })}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Unboxed Metadata (Zero-pill compliant) */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-bold text-emerald-700 uppercase">{note.subjectName}</span>
                  <span aria-hidden="true">·</span>
                  <span>Class {note.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>Ch {note.chapterNumber}</span>
                </div>

                {/* Chapter Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 leading-snug">
                  {note.chapterTitle}
                </h3>
                {isUrdu && (
                  <p className="text-xs text-emerald-800 font-urdu mt-0.5">
                    {note.chapterTitleUrdu}
                  </p>
                )}

                {/* Summary */}
                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {note.summary}
                </p>

                {/* Highlights */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Solved Exercise Qs:</span>
                    <span className="font-semibold text-slate-800 font-mono tabular-nums">
                      {note.solvedQuestions.length} Questions
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Practice MCQs:</span>
                    <span className="font-semibold text-slate-800 font-mono tabular-nums">
                      {note.mcqs.length} with Answers
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Details:</span>
                    <span className="font-semibold text-slate-800 font-mono tabular-nums">
                      {note.pages} Pages · {note.fileSize}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Fully Mobile & Laptop Responsive */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                {/* Google Drive / HTML Viewer Tab Trigger */}
                <button
                  onClick={() => onOpenReader(note, 'gdrive')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isUrdu ? 'گوگل ڈرائیو پی ڈی ایف (HTML Viewer)' : 'Google Drive / HTML PDF Viewer'}</span>
                </button>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenReader(note, 'summary')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isUrdu ? 'خلاصہ و مشق' : 'Read Notes'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload(note)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      downloadSuccessId === note.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-800 text-white hover:bg-emerald-900'
                    }`}
                  >
                    {downloadSuccessId === note.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isUrdu ? 'مکمل!' : 'Done!'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'ڈاؤنلوڈ' : 'Download'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-8">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {isUrdu ? 'اس تلاش کے مطابق کوئی نوٹس نہیں ملے' : 'No Notes Found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {isUrdu
              ? 'براہ کرم تلاش کا لفظ تبدیل کریں یا دوسرے مضامین چیک کریں۔'
              : 'Try clearing your search query or switching to another grade tab.'}
          </p>
          <button
            onClick={() => {
              setSelectedSubjectId('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100"
          >
            {isUrdu ? 'تمام مضامین دیکھیں' : 'Reset Subject Filter'}
          </button>
        </div>
      )}

      {/* AdSense Placement Area Notice */}
      <div className="mt-12 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-center">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
          Google AdSense In-Feed Ad Slot
        </span>
        <span className="text-xs text-slate-500">
          728x90 Responsive Leaderboard Banner / Content Native Ad
        </span>
      </div>
    </section>
  );
};
