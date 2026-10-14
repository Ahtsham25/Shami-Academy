import React, { useState, useEffect } from 'react';
import { NoteDetail } from '../types';
import { updateNoteDriveUrl } from '../utils/notesStorage';
import {
  X,
  BookOpen,
  Calculator,
  HelpCircle,
  CheckCircle,
  Printer,
  Download,
  Check,
  XCircle,
  FileCode,
  ExternalLink,
  Copy,
  Save,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface NoteReaderModalProps {
  note: NoteDetail | null;
  onClose: () => void;
  isUrdu: boolean;
  initialTab?: 'summary' | 'gdrive' | 'questions' | 'formulas' | 'quiz';
}

type TabType = 'summary' | 'gdrive' | 'questions' | 'formulas' | 'quiz';

export const NoteReaderModal: React.FC<NoteReaderModalProps> = ({
  note,
  onClose,
  isUrdu,
  initialTab = 'summary',
}) => {
  if (!note) return null;

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Default fallback Google Drive preview for high-school notes
  const defaultDriveLink =
    note.googleDriveUrl ||
    'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview';

  const [driveInput, setDriveInput] = useState<string>('');
  const [savedDriveUrl, setSavedDriveUrl] = useState<string>(defaultDriveLink);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);
  const [linkSavedAlert, setLinkSavedAlert] = useState<boolean>(false);

  // Load saved custom drive link from localStorage if user previously entered one for this note
  useEffect(() => {
    const storageKey = `shami_gdrive_${note.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setSavedDriveUrl(stored);
      setDriveInput(stored);
    } else {
      setSavedDriveUrl(defaultDriveLink);
      setDriveInput(defaultDriveLink);
    }
  }, [note.id, defaultDriveLink]);

  // Intelligent converter: converts share link (/view, /open, etc.) to embeddable /preview URL
  const formatDriveEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl || rawUrl.trim() === '') return defaultDriveLink;
    let url = rawUrl.trim();

    // If user pasted full iframe tag, extract the src
    const iframeSrcMatch = url.match(/src=["'](.*?)["']/);
    if (iframeSrcMatch && iframeSrcMatch[1]) {
      url = iframeSrcMatch[1];
    }

    // Google Drive share links format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }

    // Google Drive open?id=FILE_ID format
    const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      return `https://drive.google.com/file/d/${idParamMatch[1]}/preview`;
    }

    return url;
  };

  const currentEmbedUrl = formatDriveEmbedUrl(savedDriveUrl);

  const handleSaveDriveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveInput.trim()) return;
    const formatted = formatDriveEmbedUrl(driveInput);
    setSavedDriveUrl(formatted);
    localStorage.setItem(`shami_gdrive_${note.id}`, formatted);
    updateNoteDriveUrl(note.id, formatted);
    setLinkSavedAlert(true);
    setTimeout(() => setLinkSavedAlert(false), 2500);
  };

  const handleCopyIframeCode = () => {
    const iframeCode = `<iframe src="${currentEmbedUrl}" width="100%" height="680" style="border:none; border-radius:10px;" allow="autoplay"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const handleSelectOption = (mcqId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [mcqId]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    note.mcqs.forEach((mcq) => {
      if (selectedAnswers[mcq.id] === mcq.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `SHAMI ACADEMY - STUDY NOTES\nSubject: ${note.subjectName} (${note.grade})\nChapter ${note.chapterNumber}: ${note.chapterTitle}\n\nSUMMARY:\n${note.summary}\n\nGOOGLE DRIVE LINK:\n${savedDriveUrl}\n\nFORMULAS:\n${note.keyFormulas?.join('\n')}\n\nSOLVED QUESTIONS:\n${note.solvedQuestions.map((q) => `${q.questionNumber}: ${q.question}\nAns: ${q.answer}\n`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ShamiAcademy-${note.grade}-${note.subjectName}-Ch${note.chapterNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header (Mobile & Desktop Responsive) */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-emerald-400 truncate">
              <span className="font-bold">{note.subjectName}</span>
              <span aria-hidden="true">·</span>
              <span>Class {note.grade}</span>
              <span aria-hidden="true">·</span>
              <span>Ch {note.chapterNumber}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 truncate">
              {note.chapterTitle}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Print Note"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Download Note"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Horizontal Scrollable on Mobile) */}
        <div className="px-3 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {/* HTML / Google Drive Viewer Tab Requested by User */}
          <button
            onClick={() => setActiveTab('gdrive')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gdrive'
                ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isUrdu ? 'گوگل ڈرائیو پی ڈی ایف ویور' : 'Google Drive / HTML Viewer'}</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'summary'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'خلاصہ' : 'Summary'}</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'formulas'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'فارمولے' : 'Formulas'}</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              {isUrdu ? 'مشقی سوالات' : 'Solved Qs'} ({note.solvedQuestions.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>
              {isUrdu ? 'کثیر الانتخابی (MCQs)' : 'MCQs'} ({note.mcqs.length})
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {/* TAB: GOOGLE DRIVE / HTML VIEWER (User Requirement) */}
          {activeTab === 'gdrive' && (
            <div className="space-y-4">
              {/* Google Drive Link Manager & Paste Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {isUrdu
                          ? 'گوگل ڈرائیو لنک / ایچ ٹی ایم ایل کوڈ سیٹنگز'
                          : 'Google Drive File Embed & Custom Link'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isUrdu
                        ? 'اپنا کوئی بھی گوگل ڈرائیو لنک یہاں پیسٹ کریں، فائل نیچے فریم میں فوراً کھل جائے گی:'
                        : 'Paste your Google Drive PDF share link or HTML embed code to view it directly:'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyIframeCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                      title="Copy HTML iframe code for Blogger"
                    >
                      {copiedEmbed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied HTML</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy HTML Embed</span>
                        </>
                      )}
                    </button>

                    <a
                      href={currentEmbedUrl.replace('/preview', '/view')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
                    >
                      <span>Drive App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Paste Google Drive Input Form */}
                <form onSubmit={handleSaveDriveLink} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={driveInput}
                    onChange={(e) => setDriveInput(e.target.value)}
                    placeholder="Paste Google Drive URL (e.g. https://drive.google.com/file/d/.../view) or iframe"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'لنک محفوظ کریں' : 'Update & Save Link'}</span>
                  </button>
                </form>

                {linkSavedAlert && (
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {isUrdu
                        ? 'گوگل ڈرائیو فائل کا لنک کامیابی سے محفوظ ہو گیا!'
                        : 'Google Drive file link updated and saved for this chapter!'}
                    </span>
                  </div>
                )}
              </div>

              {/* Embedded Google Drive PDF / HTML Viewer Frame (Mobile & Desktop Responsive) */}
              <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shadow-inner">
                <div className="w-full h-[55vh] sm:h-[65vh] md:h-[70vh]">
                  <iframe
                    src={currentEmbedUrl}
                    title={`${note.subjectName} Chapter ${note.chapterNumber} Drive File`}
                    className="w-full h-full border-none"
                    allow="autoplay"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              {/* Ready Blogger Post Code for User */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-emerald-700" />
                      <span>{isUrdu ? 'بلاگر میں یہ پوسٹ لگانے کا تیار کوڈ:' : 'Ready-to-Paste Blogger Post Code:'}</span>
                    </span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      {isUrdu
                        ? 'بلاگر میں New Post کھول کر HTML View میں یہ کوڈ پیسٹ کریں اور دائیں طرف یہ لیبل لگائیں:'
                        : 'In Blogger New Post, switch to HTML view, paste this code, and add this exact label:'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-white text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-md">
                      Label: <strong>Class {note.grade.replace('th', '')} Notes</strong>
                    </span>
                    <button
                      onClick={() => {
                        const postCode = `<div style="font-family:'Plus Jakarta Sans',sans-serif; line-height:1.7; color:#1e293b;">\n  <p><strong>Shami Academy</strong> - Free study notes and solved textbook exercises for <strong>Class ${note.grade} ${note.subjectName} Chapter ${note.chapterNumber}: ${note.chapterTitle}</strong>.</p>\n\n  <h3 style="color:#047857; margin-top:20px;">Google Drive PDF Viewer:</h3>\n  <div style="position:relative; width:100%; height:620px; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin:16px 0;">\n    <iframe src="${currentEmbedUrl}" width="100%" height="100%" style="border:none;" allow="autoplay"></iframe>\n  </div>\n\n  <div style="text-align:center; margin:20px 0;">\n    <a href="${savedDriveUrl.replace('/preview', '/view')}" target="_blank" style="display:inline-block; background:#047857; color:#ffffff; font-weight:700; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:14px;">\n      Download Full PDF from Google Drive &#8594;\n    </a>\n  </div>\n</div>`;
                        navigator.clipboard.writeText(postCode);
                        setCopiedEmbed(true);
                        setTimeout(() => setCopiedEmbed(false), 2500);
                      }}
                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmbed ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'پوسٹ کوڈ کاپی کریں' : 'Copy Post Code')}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <span>
                  {isUrdu
                    ? 'یہ ویور موبائل، ٹیبلٹ اور کمپیوٹر سب پر 100٪ فٹ اور رسپانسو (Responsive) ہے۔'
                    : 'This Google Drive PDF viewer fits 100% of the screen across mobile phones, laptops, and desktops.'}
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  Class {note.grade} · {note.subjectName}
                </span>
              </div>
            </div>
          )}

          {/* TAB: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                  Chapter Overview
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {note.summary}
                </p>
                {note.chapterTitleUrdu && isUrdu && (
                  <p className="font-urdu text-sm text-emerald-900 mt-3 pt-3 border-t border-emerald-200">
                    یہ باب {note.chapterTitleUrdu} کے تمام کلیدی تصورات کا احاطہ کرتا ہے۔
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Key Definitions ({note.keyDefinitions.length})
                </h4>
                <div className="space-y-3">
                  {note.keyDefinitions.map((def, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="font-bold text-slate-900 text-xs text-emerald-800">
                        {def.term}:
                      </div>
                      <div className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {def.definition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FORMULAS */}
          {activeTab === 'formulas' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Core Mathematical & Scientific Formulas
                </h4>
                {note.keyFormulas && note.keyFormulas.length > 0 ? (
                  <div className="space-y-2.5">
                    {note.keyFormulas.map((form, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 text-emerald-300 font-mono text-xs px-4 py-3 rounded-lg border border-slate-800 tracking-wide"
                      >
                        {form}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No specific formulas for this chapter.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: SOLVED QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {note.solvedQuestions.map((q, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-800 text-xs font-mono">{q.questionNumber}</span>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {q.importance}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900 text-sm">
                    {q.question}
                  </div>

                  {q.questionUrdu && isUrdu && (
                    <div className="font-urdu text-xs text-slate-600 border-t border-slate-200 pt-1">
                      {q.questionUrdu}
                    </div>
                  )}

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Answer:</span>
                    {q.answer}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: PRACTICE MCQS */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">Board MCQs Practice Session</span>
                  <span className="text-xs text-slate-500">
                    Test your understanding with instant feedback.
                  </span>
                </div>
                {showQuizResults ? (
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Your Score:</span>
                    <span className="text-lg font-bold text-emerald-700 font-mono tabular-nums">
                      {calculateScore()} / {note.mcqs.length}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowQuizResults(true)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                  >
                    Check All Answers
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {note.mcqs.map((mcq, idx) => {
                  const userAnswer = selectedAnswers[mcq.id];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === mcq.correctIndex;

                  return (
                    <div key={mcq.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                      <div className="font-semibold text-slate-900 text-xs flex gap-2">
                        <span className="font-mono text-emerald-700 font-bold">Q{idx + 1}.</span>
                        <span>{mcq.question}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {mcq.options.map((opt, optIdx) => {
                          const isOptionSelected = userAnswer === optIdx;
                          const isTheCorrectOption = mcq.correctIndex === optIdx;

                          let btnClasses = 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';
                          if (hasAnswered || showQuizResults) {
                            if (isTheCorrectOption) {
                              btnClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                            } else if (isOptionSelected && !isCorrect) {
                              btnClasses = 'border-rose-400 bg-rose-50 text-rose-900';
                            }
                          } else if (isOptionSelected) {
                            btnClasses = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(mcq.id, optIdx)}
                              className={`p-2.5 text-left rounded-lg border transition-all flex items-center justify-between cursor-pointer ${btnClasses}`}
                            >
                              <span>
                                <strong className="mr-1.5 font-mono">
                                  {String.fromCharCode(65 + optIdx)}.
                                </strong>
                                {opt}
                              </span>
                              {(hasAnswered || showQuizResults) && isTheCorrectOption && (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {(hasAnswered || showQuizResults) && isOptionSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {(hasAnswered || showQuizResults) && (
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                          <span className="font-bold text-slate-800">Explanation:</span> {mcq.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Shami Academy Drive &amp; PDF Study Bank</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
