import React, { useState, useEffect } from 'react';
import { NoteDetail, GradeLevel } from '../types';
import {
  getStoredNotes,
  saveAllNotes,
  saveOrUpdateNote,
  deleteNote,
  updateNoteDriveUrl,
  exportDataAsJson,
  importDataFromJson,
  resetToDefaultData,
  formatDriveEmbedUrl,
  generateBloggerPostHtml,
} from '../utils/notesStorage';
import { SUBJECTS, GRADES } from '../data/academicData';
import {
  ShieldCheck,
  LayoutDashboard,
  Link2,
  PlusCircle,
  FileCode,
  Database,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Trash2,
  Edit3,
  Search,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Globe,
  X,
  Maximize2,
  Github
} from 'lucide-react';
import { GitHubBackendPanel } from './GitHubBackendPanel';
import { getGitHubConfig, uploadFileToGitHub } from '../utils/githubService';

interface AdminPanelProps {
  onBackToPortal: () => void;
  isUrdu: boolean;
  setIsUrdu: (val: boolean) => void;
}

type AdminTab = 'overview' | 'github-backend' | 'drive-links' | 'add-note' | 'blogger-posts' | 'backup';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToPortal,
  isUrdu,
  setIsUrdu,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [notes, setNotes] = useState<NoteDetail[]>([]);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);
  const [previewDriveUrl, setPreviewDriveUrl] = useState<string | null>(null);

  // New Note Form State
  const [formGrade, setFormGrade] = useState<GradeLevel>('9th');
  const [formSubjectName, setFormSubjectName] = useState<string>('Physics');
  const [formSubjectNameUrdu, setFormSubjectNameUrdu] = useState<string>('طبیعیات');
  const [formChapterNumber, setFormChapterNumber] = useState<number>(1);
  const [formChapterTitle, setFormChapterTitle] = useState<string>('');
  const [formChapterTitleUrdu, setFormChapterTitleUrdu] = useState<string>('');
  const [formDriveUrl, setFormDriveUrl] = useState<string>('');
  const [formSummary, setFormSummary] = useState<string>('');
  const [formEditingId, setFormEditingId] = useState<string | null>(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Blogger Post Tab State
  const [selectedBloggerNoteId, setSelectedBloggerNoteId] = useState<string>('');
  const [copiedBloggerCode, setCopiedBloggerCode] = useState<boolean>(false);

  // Backup Tab State
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [backupAlert, setBackupAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Quick File Upload State for GitHub
  const [quickUploadNoteId, setQuickUploadNoteId] = useState<string | null>(null);
  const [isQuickUploading, setIsQuickUploading] = useState<boolean>(false);
  const [quickUploadSuccess, setQuickUploadSuccess] = useState<string | null>(null);
  const quickFileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerQuickUploadForNote = (noteId: string) => {
    const config = getGitHubConfig();
    if (!config.owner || !config.repo || !config.token) {
      setActiveTab('github-backend');
      setBackupAlert({
        type: 'error',
        msg: isUrdu
          ? 'براہ کرم پہلے گٹ ہب ریپوزٹری اور ٹوکن درج کریں تاکہ فائلیں اپلوڈ ہو سکیں۔'
          : 'Please configure your GitHub repository and token first in the GitHub Backend tab.',
      });
      return;
    }
    setQuickUploadNoteId(noteId);
    quickFileInputRef.current?.click();
  };

  const handleQuickFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !quickUploadNoteId) return;
    const file = e.target.files[0];
    const config = getGitHubConfig();
    setIsQuickUploading(true);
    try {
      const res = await uploadFileToGitHub(config, file, 'public/uploads');
      if (res.success && res.fileRecord) {
        const fileUrl = res.fileRecord.cdnUrl || res.fileRecord.rawUrl;
        if (quickUploadNoteId === 'form-new-note') {
          setFormDriveUrl(fileUrl);
        } else {
          updateNoteDriveUrl(quickUploadNoteId, fileUrl);
          const inputEl = document.getElementById(`input-drive-${quickUploadNoteId}`) as HTMLInputElement;
          if (inputEl) inputEl.value = fileUrl;
        }
        setQuickUploadSuccess(
          isUrdu
            ? `فائل '${file.name}' گٹ ہب پر اپلوڈ ہو کر لنک منسلک ہو گیا!`
            : `Uploaded '${file.name}' to GitHub and linked!`
        );
        setTimeout(() => setQuickUploadSuccess(null), 3500);
      } else {
        setBackupAlert({
          type: 'error',
          msg: res.message || 'فائل اپلوڈ کرنے میں خرابی',
        });
      }
    } finally {
      setIsQuickUploading(false);
      setQuickUploadNoteId(null);
      if (quickFileInputRef.current) quickFileInputRef.current.value = '';
    }
  };

  const handleAttachUrlToNote = (noteId: string, url: string) => {
    updateNoteDriveUrl(noteId, url);
    loadNotes();
  };

  // Load notes on mount and listen to changes
  const loadNotes = () => {
    const list = getStoredNotes();
    setNotes(list);
    if (list.length > 0 && !selectedBloggerNoteId) {
      setSelectedBloggerNoteId(list[0].id);
    }
  };

  useEffect(() => {
    loadNotes();
    const handleStorageUpdate = () => loadNotes();
    window.addEventListener('shami_notes_updated', handleStorageUpdate);
    return () => window.removeEventListener('shami_notes_updated', handleStorageUpdate);
  }, []);

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchGrade = selectedGradeFilter === 'all' || n.grade === selectedGradeFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      n.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subjectNameUrdu.includes(searchQuery) ||
      n.chapterTitleUrdu.includes(searchQuery);
    return matchGrade && matchSearch;
  });

  // Calculate metrics
  const totalNotesCount = notes.length;
  const notesWithDriveCount = notes.filter((n) => !!n.googleDriveUrl && n.googleDriveUrl.trim() !== '').length;
  const notesByGrade = {
    '9th': notes.filter((n) => n.grade === '9th').length,
    '10th': notes.filter((n) => n.grade === '10th').length,
    '11th': notes.filter((n) => n.grade === '11th').length,
    '12th': notes.filter((n) => n.grade === '12th').length,
  };

  // Handle single note drive link update
  const handleQuickDriveSave = (noteId: string, url: string) => {
    updateNoteDriveUrl(noteId, url);
    setSaveSuccessId(noteId);
    setTimeout(() => setSaveSuccessId(null), 2500);
  };

  // Copy blogger code for a single note
  const handleCopySingleBloggerCode = (note: NoteDetail) => {
    const code = generateBloggerPostHtml(note, note.googleDriveUrl);
    navigator.clipboard.writeText(code);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Handle Add / Edit Note Submit
  const handleSaveNoteForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChapterTitle.trim()) {
      alert(isUrdu ? 'براہ کرم باب کا عنوان درج کریں۔' : 'Please enter chapter title');
      return;
    }

    const noteId = formEditingId || `note-${formGrade}-${formSubjectName.toLowerCase().slice(0, 3)}-ch${formChapterNumber}-${Date.now().toString().slice(-4)}`;

    const newNote: NoteDetail = {
      id: noteId,
      grade: formGrade,
      subjectId: `${formGrade}-${formSubjectName.toLowerCase().slice(0, 4)}`,
      subjectName: formSubjectName,
      subjectNameUrdu: formSubjectNameUrdu || formSubjectName,
      chapterNumber: Number(formChapterNumber) || 1,
      chapterTitle: formChapterTitle,
      chapterTitleUrdu: formChapterTitleUrdu || formChapterTitle,
      totalMarks: 60,
      pages: 12,
      fileSize: '3.5 MB',
      downloadCount: 1500,
      updatedDate: 'Latest 2026 Edition',
      summary: formSummary || `${formSubjectName} Chapter ${formChapterNumber} detailed study notes with solved questions.`,
      keyFormulas: [],
      keyDefinitions: [],
      solvedQuestions: [
        {
          questionNumber: 'Q.1',
          question: `Explain fundamental concepts of ${formChapterTitle}.`,
          questionUrdu: `${formChapterTitleUrdu} کے اہم تصورات بیان کریں۔`,
          answer: 'Detailed conceptual explanation verified by Shami Academy academic board.',
          importance: 'Very Important',
        },
      ],
      mcqs: [],
      googleDriveUrl: formDriveUrl.trim(),
    };

    saveOrUpdateNote(newNote);
    loadNotes();
    setFormSuccessMessage(isUrdu ? 'نوٹ کامیابی سے محفوظ ہو گیا!' : 'Note saved successfully to portal!');
    setTimeout(() => setFormSuccessMessage(null), 3000);

    // Reset form
    if (formEditingId) {
      setFormEditingId(null);
    }
    setFormChapterTitle('');
    setFormChapterTitleUrdu('');
    setFormDriveUrl('');
    setFormSummary('');
  };

  const handleEditNoteClick = (note: NoteDetail) => {
    setFormEditingId(note.id);
    setFormGrade(note.grade);
    setFormSubjectName(note.subjectName);
    setFormSubjectNameUrdu(note.subjectNameUrdu);
    setFormChapterNumber(note.chapterNumber);
    setFormChapterTitle(note.chapterTitle);
    setFormChapterTitleUrdu(note.chapterTitleUrdu);
    setFormDriveUrl(note.googleDriveUrl || '');
    setFormSummary(note.summary || '');
    setActiveTab('add-note');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteNoteClick = (noteId: string, title: string) => {
    const confirmMsg = isUrdu
      ? `کیا آپ واقعی اس نوٹ "${title}" کو ڈیلیٹ کرنا چاہتے ہیں؟`
      : `Are you sure you want to delete "${title}"?`;
    if (window.confirm(confirmMsg)) {
      deleteNote(noteId);
      loadNotes();
    }
  };

  // Export JSON
  const handleExportBackup = () => {
    const jsonStr = exportDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shami-academy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setBackupAlert({
      type: 'success',
      msg: isUrdu ? 'بیک اپ فائل کامیابی سے ڈاؤن لوڈ ہو گئی ہے!' : 'Backup JSON downloaded successfully!',
    });
    setTimeout(() => setBackupAlert(null), 3500);
  };

  // Import JSON
  const handleImportBackup = () => {
    if (!importJsonText.trim()) {
      setBackupAlert({
        type: 'error',
        msg: isUrdu ? 'براہ کرم پہلے JSON ٹیکسٹ یا فائل پیسٹ کریں۔' : 'Please paste JSON text first',
      });
      return;
    }
    const res = importDataFromJson(importJsonText);
    if (res.success) {
      loadNotes();
      setImportJsonText('');
      setBackupAlert({
        type: 'success',
        msg: isUrdu
          ? `کامیابی! ${res.count} نوٹس کامیابی سے امپورٹ ہو گئے۔`
          : `Success! ${res.count} notes imported.`,
      });
    } else {
      setBackupAlert({
        type: 'error',
        msg: isUrdu ? `خرابی: ${res.error}` : `Error: ${res.error}`,
      });
    }
    setTimeout(() => setBackupAlert(null), 4000);
  };

  const handleResetDefaults = () => {
    const msg = isUrdu
      ? 'کیا آپ واقعی تمام ڈیٹا کو اصل بنیادی حالت پر ری سیٹ کرنا چاہتے ہیں؟'
      : 'Reset all data back to factory default?';
    if (window.confirm(msg)) {
      resetToDefaultData();
      loadNotes();
      setBackupAlert({
        type: 'success',
        msg: isUrdu ? 'ڈیٹا فیکٹری حالت پر ری سیٹ ہو گیا ہے۔' : 'Data reset to defaults.',
      });
      setTimeout(() => setBackupAlert(null), 3000);
    }
  };

  const selectedBloggerNote = notes.find((n) => n.id === selectedBloggerNoteId) || notes[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPortal}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title={isUrdu ? 'پورٹل پر واپس جائیں' : 'Back to Student Portal'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isUrdu ? 'پورٹل پر واپسی' : 'Back to Portal'}</span>
            </button>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">
                    {isUrdu ? 'شامی اکیڈمی ایڈمن پورٹل' : 'Shami Academy Admin Panel'}
                  </h1>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {isUrdu ? 'بغیر فائر بیس (خودکار اسٹوریج)' : 'Direct Storage (No Firebase Needed)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isUrdu
                    ? 'نوٹس، گوگل ڈرائیو فائلز، اور بلاگر کوڈز کا مکمل کنٹرول'
                    : 'Manage Classes 9-12 notes, Drive links, and Blogger post generator'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setIsUrdu(!isUrdu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-xs font-medium cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isUrdu ? 'English Mode' : 'اردو موڈ'}</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors text-xs font-bold cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'بیک اپ ڈاؤن لوڈ' : 'Backup JSON'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 border-t border-slate-850 flex overflow-x-auto no-scrollbar gap-1 pt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{isUrdu ? 'ڈیش بورڈ (اوور ویو)' : 'Dashboard'}</span>
          </button>

          <button
            onClick={() => setActiveTab('github-backend')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'github-backend'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Github className="w-4 h-4 text-indigo-400" />
            <span>{isUrdu ? 'گٹ ہب کلاؤڈ بیک اینڈ اور فائلز' : 'GitHub Cloud Backend & Files'}</span>
            <span className="bg-indigo-950 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-full border border-indigo-800">
              {isUrdu ? 'مفت کلاؤڈ' : 'Live Cloud'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('drive-links')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'drive-links'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>{isUrdu ? 'گوگل ڈرائیو لنکس مینیجر' : 'Google Drive Links'}</span>
            <span className="bg-emerald-950 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full border border-emerald-800">
              {notesWithDriveCount}/{totalNotesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add-note')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'add-note'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {formEditingId
                ? isUrdu
                  ? 'نوٹ میں ترمیم کریں'
                  : 'Edit Note'
                : isUrdu
                ? 'نیا نوٹ / مضمون شامل کریں'
                : 'Add New Note'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blogger-posts')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'blogger-posts'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>{isUrdu ? 'بلاگر پوسٹ جنریٹر' : 'Blogger Post Generator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{isUrdu ? 'بیک اپ اور ڈیٹا ری سیٹ' : 'Backup & Data'}</span>
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {backupAlert && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center justify-between gap-3 ${
              backupAlert.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                : 'bg-rose-950/80 border border-rose-800 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{backupAlert.msg}</span>
            </div>
            <button onClick={() => setBackupAlert(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hidden quick upload input */}
        <input
          ref={quickFileInputRef}
          type="file"
          onChange={handleQuickFileChosen}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          className="hidden"
        />

        {quickUploadSuccess && (
          <div className="p-4 rounded-xl text-xs sm:text-sm bg-indigo-950/90 border border-indigo-700 text-indigo-200 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{quickUploadSuccess}</span>
            </div>
            <button onClick={() => setQuickUploadSuccess(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* TAB: GITHUB BACKEND & LIVE STORAGE */}
        {activeTab === 'github-backend' && (
          <GitHubBackendPanel
            notes={notes}
            isUrdu={isUrdu}
            onNotesUpdated={loadNotes}
            onAttachUrlToNote={handleAttachUrlToNote}
            onPreviewUrl={(url) => setPreviewDriveUrl(url)}
          />
        )}

        {/* TAB 1: OVERVIEW & DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isUrdu ? 'کل نوٹس' : 'Total Notes'}
                  </span>
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">{totalNotesCount}</div>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu ? 'پورٹل میں موجود تمام مضامین کے نوٹس' : 'Published in portal database'}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isUrdu ? 'ڈرائیو فائلز منسلک' : 'Drive Links Active'}
                  </span>
                  <Link2 className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">
                  {notesWithDriveCount}
                  <span className="text-sm font-normal text-slate-400 ml-1">/ {totalNotesCount}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu ? 'براہ راست پی ڈی ایف ویور کے ساتھ' : 'Embedded with live PDF viewer'}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isUrdu ? 'کلاس 9 اور 10' : 'Matric (9th & 10th)'}
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">
                  {notesByGrade['9th'] + notesByGrade['10th']}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu
                    ? `9ویں: ${notesByGrade['9th']} | 10ویں: ${notesByGrade['10th']}`
                    : `9th: ${notesByGrade['9th']} | 10th: ${notesByGrade['10th']}`}
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isUrdu ? 'کلاس 11 اور 12' : 'Inter (11th & 12th)'}
                  </span>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white mt-2">
                  {notesByGrade['11th'] + notesByGrade['12th']}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu
                    ? `11ویں: ${notesByGrade['11th']} | 12ویں: ${notesByGrade['12th']}`
                    : `11th: ${notesByGrade['11th']} | 12th: ${notesByGrade['12th']}`}
                </p>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isUrdu ? 'فوری کارروائیاں' : 'Quick Actions'}</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                {isUrdu
                  ? 'یہاں سے آپ ڈرائیو لنکس اپڈیٹ کر سکتے ہیں، نیا چیپٹر شامل کر سکتے ہیں یا بلاگر پوسٹ کے لیے تیار کوڈ بنا سکتے ہیں:'
                  : 'Instantly perform common tasks across your educational portal:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => setActiveTab('github-backend')}
                  className="p-3.5 bg-gradient-to-br from-indigo-950/70 to-slate-900 hover:from-indigo-900/80 hover:to-slate-850 border border-indigo-700/60 rounded-xl text-left transition-all hover:border-indigo-400 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {isUrdu ? 'گٹ ہب کلاؤڈ بیک اینڈ' : 'GitHub Cloud Backend'}
                    </span>
                    <Github className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                  </div>
                  <span className="text-[11px] text-indigo-300/80 block">
                    {isUrdu ? 'فائلیں اپلوڈ اور ڈیٹا سنک' : 'Upload PDFs & live sync'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('drive-links')}
                  className="p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-xl text-left transition-all hover:border-emerald-500/50 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {isUrdu ? 'ڈرائیو لنکس اپڈیٹ کریں' : 'Update Drive Links'}
                    </span>
                    <Link2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    {isUrdu ? 'کسی بھی چیپٹر میں گوگل ڈرائیو فائل لگائیں' : 'Attach PDF to any chapter'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('add-note')}
                  className="p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-xl text-left transition-all hover:border-emerald-500/50 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {isUrdu ? 'نیا نوٹ شامل کریں' : 'Add New Note'}
                    </span>
                    <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    {isUrdu ? 'کسی بھی مضمون کا نیا باب داخل کریں' : 'Create chapter in any subject'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('blogger-posts')}
                  className="p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-xl text-left transition-all hover:border-emerald-500/50 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {isUrdu ? 'بلاگر پوسٹ HTML حاصل کریں' : 'Get Blogger Post Code'}
                    </span>
                    <FileCode className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    {isUrdu ? 'بلاگر میں 1-کلک سے پوسٹ لگائیں' : 'Ready HTML for Blogger view'}
                  </span>
                </button>

                <button
                  onClick={handleExportBackup}
                  className="p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-xl text-left transition-all hover:border-emerald-500/50 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {isUrdu ? 'بیک اپ فائل محفوظ کریں' : 'Download JSON Backup'}
                    </span>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    {isUrdu ? 'ڈیٹا محفوظ رکھیں یا دوسرے پی سی پر لے جائیں' : 'Save all notes to computer file'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick List of All Current Notes */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isUrdu ? 'موجودہ نوٹس کی فہرست' : 'Current Published Notes'}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {isUrdu
                      ? 'یہاں سے آپ کسی بھی نوٹ کے ڈرائیو لنک کو براہ راست چیک یا تبدیل کر سکتے ہیں:'
                      : 'Live preview, edit, or copy Blogger HTML for any note:'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('drive-links')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isUrdu ? 'مکمل مینیجر کھولیں' : 'Open Full Manager'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-700/60">
                {notes.slice(0, 6).map((note) => (
                  <div
                    key={note.id}
                    className="p-4 hover:bg-slate-750 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-emerald-950 text-emerald-300 font-mono text-[11px] font-bold rounded-md border border-emerald-800">
                        Class {note.grade.replace('th', '')}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {note.subjectName}: {note.chapterTitle}
                          </span>
                          <span className="text-xs text-slate-400 hidden md:inline">
                            (Ch {note.chapterNumber})
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400 font-urdu block">
                          {note.subjectNameUrdu}: {note.chapterTitleUrdu}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {note.googleDriveUrl ? (
                        <button
                          onClick={() => setPreviewDriveUrl(note.googleDriveUrl!)}
                          className="px-2.5 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Preview Drive PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isUrdu ? 'دیکھیں' : 'Preview'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/60">
                          {isUrdu ? 'کوئی ڈرائیو لنک نہیں' : 'No Drive Link'}
                        </span>
                      )}

                      <button
                        onClick={() => handleCopySingleBloggerCode(note)}
                        className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy Blogger Post Code"
                      >
                        {copiedId === note.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isUrdu ? 'کاپی ہو گیا!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isUrdu ? 'بلاگر کوڈ' : 'Blogger Code'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleEditNoteClick(note)}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="Edit Note"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE DRIVE LINKS MANAGER */}
        {activeTab === 'drive-links' && (
          <div className="space-y-6">
            {/* Explanatory Help Card */}
            <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-600/30 text-emerald-300 rounded-xl shrink-0 mt-0.5">
                  <Link2 className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  <h4 className="text-sm font-bold text-white">
                    {isUrdu
                      ? 'گوگل ڈرائیو لنک شامل کرنے کا طریقہ (How to connect Google Drive)'
                      : 'How to Connect Any Google Drive File:'}
                  </h4>
                  <p>
                    {isUrdu ? (
                      <>
                        1. اپنے گوگل ڈرائیو (Google Drive) میں پی ڈی ایف فائل اپلوڈ کریں۔<br />
                        2. فائل پر رائٹ کلک کر کے <strong>Share</strong> دبائیں اور General Access میں <strong>"Anyone with the link"</strong> منتخب کریں۔<br />
                        3. <strong>Copy Link</strong> کر کے نیچے متعلقہ کلاس اور مضمون کے خانے میں پیسٹ کریں اور <strong>"محفوظ کریں"</strong> کا بٹن دبائیں۔<br />
                        4. یہ پورٹل خود بخود اسے لائیو پی ڈی ایف ویور میں تبدیل کر دے گا اور آپ کو 1-کلک بلاگر پوسٹ کوڈ بھی فراہم کرے گا!
                      </>
                    ) : (
                      <>
                        1. Upload your PDF notes to your Google Drive.<br />
                        2. Right click file &gt; Share &gt; Set General Access to <strong>"Anyone with the link"</strong> (Viewer).<br />
                        3. Click <strong>Copy link</strong> and paste into the box below, then click <strong>"Save"</strong>.<br />
                        4. Our portal automatically transforms it into an embedded live reader and generates ready Blogger HTML!
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['all', '9th', '10th', '11th', '12th'].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGradeFilter(grade)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedGradeFilter === grade
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-750 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {grade === 'all' ? (isUrdu ? 'تمام کلاسیں' : 'All Classes') : `Class ${grade.replace('th', '')}`}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isUrdu ? 'تلاش کریں (مضمون یا باب)...' : 'Search subject or chapter...'}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* List of Notes with Drive Link Inputs */}
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 sm:p-5 transition-all hover:border-slate-600 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 font-bold text-xs rounded-md border border-emerald-800">
                        Class {note.grade.replace('th', '')}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {note.subjectName}: Chapter {note.chapterNumber} — {note.chapterTitle}
                      </h4>
                      <span className="text-xs text-emerald-400 font-urdu">
                        ({note.subjectNameUrdu}: {note.chapterTitleUrdu})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopySingleBloggerCode(note)}
                        className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy ready Blogger Post HTML with Drive file"
                      >
                        {copiedId === note.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isUrdu ? 'کاپی ہو گیا!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isUrdu ? 'بلاگر پوسٹ HTML' : 'Blogger Post HTML'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleEditNoteClick(note)}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="Edit Full Note Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteNoteClick(note.id, note.chapterTitle)}
                        className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Drive URL Input Form Row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        defaultValue={note.googleDriveUrl || ''}
                        id={`input-drive-${note.id}`}
                        placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const el = document.getElementById(`input-drive-${note.id}`) as HTMLInputElement;
                          if (el) handleQuickDriveSave(note.id, el.value);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                      >
                        {saveSuccessId === note.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{isUrdu ? 'محفوظ!' : 'Saved!'}</span>
                          </>
                        ) : (
                          <span>{isUrdu ? 'محفوظ کریں' : 'Save Link'}</span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          const el = document.getElementById(`input-drive-${note.id}`) as HTMLInputElement;
                          const url = el ? el.value : note.googleDriveUrl;
                          if (url) {
                            setPreviewDriveUrl(url);
                          } else {
                            alert(isUrdu ? 'پہلے لنک درج کریں۔' : 'Please enter a URL first');
                          }
                        }}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                        title="Live Test Embed"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>{isUrdu ? 'ٹیسٹ کریں' : 'Test Preview'}</span>
                      </button>

                      <button
                        onClick={() => triggerQuickUploadForNote(note.id)}
                        disabled={isQuickUploading && quickUploadNoteId === note.id}
                        className="px-3 py-2 bg-indigo-950 hover:bg-indigo-900 border border-indigo-750 text-indigo-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                        title={isUrdu ? 'اس نوٹ کے لیے پی ڈی ایف فائل گٹ ہب پر اپلوڈ کریں' : 'Upload PDF directly to GitHub for this note'}
                      >
                        {isQuickUploading && quickUploadNoteId === note.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>{isUrdu ? 'اپلوڈ...' : 'Uploading...'}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{isUrdu ? 'فائل اپلوڈ' : 'Upload PDF'}</span>
                          </>
                        )}
                      </button>

                      {note.googleDriveUrl && (
                        <a
                          href={note.googleDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-colors shrink-0"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredNotes.length === 0 && (
                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-sm font-semibold">
                    {isUrdu ? 'کوئی نوٹ نہیں ملا۔' : 'No notes found for this filter.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ADD / EDIT NOTE FORM */}
        {activeTab === 'add-note' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  <span>
                    {formEditingId
                      ? isUrdu
                        ? 'نوٹ میں ترمیم کریں'
                        : 'Edit Existing Note'
                      : isUrdu
                      ? 'نیا نوٹ اور گوگل ڈرائیو فائل شامل کریں'
                      : 'Add New Note & Google Drive Document'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu
                    ? 'یہاں نئی معلومات داخل کریں۔ یہ فوراً پورٹل اور بلاگر کوڈ کے لیے دستیاب ہو جائے گی۔'
                    : 'Fill details to add or update notes in the portal and Blogger publisher.'}
                </p>
              </div>

              {formEditingId && (
                <button
                  onClick={() => {
                    setFormEditingId(null);
                    setFormChapterTitle('');
                    setFormChapterTitleUrdu('');
                    setFormDriveUrl('');
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {isUrdu ? 'منسوخ کریں (Cancel Edit)' : 'Cancel Edit'}
                </button>
              )}
            </div>

            {formSuccessMessage && (
              <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{formSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveNoteForm} className="space-y-4">
              {/* Row 1: Grade and Pre-fill Subjects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isUrdu ? 'کلاس (Grade Level):' : 'Grade Level:'}
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="9th">Class 9 (نویں جماعت)</option>
                    <option value="10th">Class 10 (دسویں جماعت)</option>
                    <option value="11th">Class 11 (گیارہویں / 1st Year)</option>
                    <option value="12th">Class 12 (بارہویں / 2nd Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isUrdu ? 'مضمون (Subject English):' : 'Subject Name (English):'}
                  </label>
                  <input
                    type="text"
                    value={formSubjectName}
                    onChange={(e) => setFormSubjectName(e.target.value)}
                    required
                    placeholder="e.g. Physics, Chemistry, Biology..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  {/* Quick Select Buttons */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'English', 'Urdu', 'Pak Studies'].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          setFormSubjectName(sub);
                          const matching = SUBJECTS.find((s) => s.name === sub);
                          if (matching) setFormSubjectNameUrdu(matching.nameUrdu);
                        }}
                        className="text-[10px] px-2 py-0.5 bg-slate-750 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isUrdu ? 'مضمون اردو نام (Urdu Name):' : 'Subject Name (Urdu):'}
                  </label>
                  <input
                    type="text"
                    value={formSubjectNameUrdu}
                    onChange={(e) => setFormSubjectNameUrdu(e.target.value)}
                    placeholder="جیسے: طبیعیات، کیمسٹری، ریاضی..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-emerald-300 font-urdu focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: Chapter Number and Titles */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isUrdu ? 'باب نمبر (Chapter #):' : 'Chapter Number:'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formChapterNumber}
                    onChange={(e) => setFormChapterNumber(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isUrdu ? 'باب کا عنوان انگریزی میں (Title English):' : 'Chapter Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={formChapterTitle}
                    onChange={(e) => setFormChapterTitle(e.target.value)}
                    required
                    placeholder="e.g. Physical Quantities & Measurement"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isUrdu ? 'باب کا عنوان اردو میں (Title Urdu):' : 'Chapter Title (Urdu):'}
                  </label>
                  <input
                    type="text"
                    value={formChapterTitleUrdu}
                    onChange={(e) => setFormChapterTitleUrdu(e.target.value)}
                    placeholder="جیسے: طبعی مقداریں اور پیمائش"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-emerald-300 font-urdu focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 3: Google Drive Link */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isUrdu ? 'گوگل ڈرائیو لنک (Google Drive Public View URL):' : 'Google Drive View URL:'}
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={formDriveUrl}
                    onChange={(e) => setFormDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => triggerQuickUploadForNote('form-new-note')}
                    disabled={isQuickUploading && quickUploadNoteId === 'form-new-note'}
                    className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-750 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {isQuickUploading && quickUploadNoteId === 'form-new-note' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{isUrdu ? 'اپلوڈ ہو رہا ہے...' : 'Uploading to GitHub...'}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{isUrdu ? 'یا گٹ ہب پر براہ راست PDF فائل اپلوڈ کریں' : 'Or Upload PDF directly to GitHub'}</span>
                      </>
                    )}
                  </button>

                  {formDriveUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewDriveUrl(formDriveUrl)}
                      className="px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>{isUrdu ? 'پریویو ٹیسٹ' : 'Test Preview'}</span>
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {isUrdu
                    ? 'گوگل ڈرائیو لنک ڈالیں یا براہ راست اوپر دیے گئے بٹن سے پی ڈی ایف فائل اپلوڈ کریں۔'
                    : 'Paste Google Drive link or upload PDF directly to your GitHub repository backend.'}
                </span>
              </div>

              {/* Row 4: Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isUrdu ? 'خلاصہ / تفصیل (Chapter Summary):' : 'Summary / Short Description:'}
                </label>
                <textarea
                  rows={3}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'اس باب کے اہم نکات، نصاب اور امتحانی اہمیت کی مختصر تفصیل...'
                      : 'Detailed conceptual notes, board exam important points, past paper repeat questions...'
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {formEditingId
                      ? isUrdu
                        ? 'تبدیلیاں محفوظ کریں'
                        : 'Update Note'
                      : isUrdu
                      ? 'پورٹل میں شامل کریں'
                      : 'Save Note to Portal'}
                  </span>
                </button>

                {formDriveUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewDriveUrl(formDriveUrl)}
                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span>{isUrdu ? 'ڈرائیو پی ڈی ایف چیک کریں' : 'Test Drive PDF'}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: BLOGGER POST PUBLISHER */}
        {activeTab === 'blogger-posts' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-400" />
                  <span>
                    {isUrdu
                      ? 'بلاگر پوسٹ جنریٹر اور پبلشنگ سینٹر'
                      : 'Blogger Post Publisher & Code Generator'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu
                    ? 'یہاں سے آپ کسی بھی مضمون کا مکمل تیار ایچ ٹی ایم ایل حاصل کر سکتے ہیں جس میں گوگل ڈرائیو کا پی ڈی ایف ویور خود بخود سیٹ ہوتا ہے:'
                    : 'Generate complete ready-to-paste Blogger post HTML code with embedded Drive viewer and download button.'}
                </p>
              </div>

              {/* Select Note dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isUrdu ? 'مضمون اور باب منتخب کریں:' : 'Select Note to Publish:'}
                </label>
                <select
                  value={selectedBloggerNoteId}
                  onChange={(e) => setSelectedBloggerNoteId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {notes.map((n) => (
                    <option key={n.id} value={n.id}>
                      Class {n.grade.replace('th', '')} - {n.subjectName}: Chapter {n.chapterNumber} (
                      {n.chapterTitle})
                    </option>
                  ))}
                </select>
              </div>

              {selectedBloggerNote && (
                <div className="space-y-4">
                  {/* Blogger Metadata Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-750">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {isUrdu ? '1. بلاگر پوسٹ کا عنوان (Title to copy):' : '1. Blogger Post Title:'}
                      </span>
                      <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <code className="text-xs text-emerald-300 font-bold truncate">
                          Class {selectedBloggerNote.grade.replace('th', '')} {selectedBloggerNote.subjectName} Chapter {selectedBloggerNote.chapterNumber} Notes PDF
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Class ${selectedBloggerNote.grade.replace('th', '')} ${selectedBloggerNote.subjectName} Chapter ${selectedBloggerNote.chapterNumber} Notes PDF - Shami Academy`
                            );
                            alert(isUrdu ? 'عنوان کاپی ہو گیا!' : 'Title copied!');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded transition-colors shrink-0 cursor-pointer"
                        >
                          {isUrdu ? 'کاپی' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-750">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {isUrdu ? '2. ضروری لیبلز (Labels to enter in Blogger sidebar):' : '2. Exact Labels for Blogger Sidebar:'}
                      </span>
                      <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <code className="text-xs text-amber-300 font-bold truncate">
                          Class {selectedBloggerNote.grade.replace('th', '')} Notes, {selectedBloggerNote.subjectName}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Class ${selectedBloggerNote.grade.replace('th', '')} Notes, ${selectedBloggerNote.subjectName}`
                            );
                            alert(isUrdu ? 'لیبلز کاپی ہو گئے!' : 'Labels copied!');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded transition-colors shrink-0 cursor-pointer"
                        >
                          {isUrdu ? 'کاپی' : 'Copy'}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {isUrdu
                          ? 'یہ لیبل درج کرنے سے یہ پوسٹ بلاگر کے مینو بٹن میں خود بخود کھل جائے گی!'
                          : 'Adding these exact labels connects this post automatically to your blog navigation menu.'}
                      </span>
                    </div>
                  </div>

                  {/* Ready HTML Code Box */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">
                        {isUrdu
                          ? '3. بلاگر HTML ویو کوڈ (Blogger Post HTML Code):'
                          : '3. Blogger Post Ready HTML (Paste into HTML View):'}
                      </span>

                      <button
                        onClick={() => {
                          const html = generateBloggerPostHtml(selectedBloggerNote, selectedBloggerNote.googleDriveUrl);
                          navigator.clipboard.writeText(html);
                          setCopiedBloggerCode(true);
                          setTimeout(() => setCopiedBloggerCode(false), 2500);
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedBloggerCode ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{isUrdu ? 'کوڈ کاپی ہو گیا!' : 'HTML Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isUrdu ? 'تمام ایچ ٹی ایم ایل کاپی کریں' : 'Copy Post HTML Code'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      readOnly
                      rows={10}
                      value={generateBloggerPostHtml(selectedBloggerNote, selectedBloggerNote.googleDriveUrl)}
                      className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 select-all focus:outline-none"
                    />
                  </div>

                  {/* Quick Instructions */}
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-750 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-white block">
                      {isUrdu ? 'بلاگر میں پوسٹ کیسے لگائیں؟' : 'How to paste this into Blogger:'}
                    </span>
                    <p>
                      {isUrdu
                        ? '1. Blogger ڈیش بورڈ کھولیں اور "New Post" پر کلک کریں۔'
                        : '1. Open Blogger dashboard and click "New Post".'}
                      <br />
                      {isUrdu
                        ? '2. بائیں جانب پینسل آئیکون پر کلک کر کے "HTML View" منتخب کریں۔'
                        : '2. Click the Pencil icon on top-left and switch to "HTML View".'}
                      <br />
                      {isUrdu
                        ? '3. وہاں موجود سارا پرانا ٹیکسٹ ہٹا کر یہ کوڈ پیسٹ کر دیں۔'
                        : '3. Paste this code into the editor.'}
                      <br />
                      {isUrdu
                        ? '4. دائیں جانب Labels میں اوپر دیا گیا لیبل درج کریں اور Publish کر دیں!'
                        : '4. Add the labels in the sidebar and click "Publish"!'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: BACKUP & DATA SETTINGS */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Backup Card */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isUrdu ? 'ڈیٹا بیک اپ ایکسپورٹ کریں' : 'Export Full Data Backup'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isUrdu ? 'تمام نوٹس اور ڈرائیو لنکس کو کمپیوٹر فائل میں محفوظ کریں' : 'Save all notes and links as a JSON file'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUrdu
                    ? 'آپ کو کسی فائر بیس سرور کی ضرورت نہیں ہے۔ یہ بٹن دبانے سے آپ کے پورٹل کا تمام ڈیٹا ایک محفوظ JSON فائل کے طور پر ڈاؤن لوڈ ہو جائے گا جسے آپ جب چاہیں کسی بھی ڈیوائس پر بحال کر سکتے ہیں۔'
                    : 'Download a complete JSON snapshot of all your classes, notes, formulas, and Google Drive links. Keep it safe on your laptop or drive.'}
                </p>

                <button
                  onClick={handleExportBackup}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isUrdu ? 'مکمل بیک اپ فائل ڈاؤن لوڈ کریں' : 'Download Complete Backup JSON'}</span>
                </button>
              </div>

              {/* Import Backup Card */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-600/20 text-sky-400 rounded-xl">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isUrdu ? 'بیک اپ فائل امپورٹ کریں' : 'Import Backup Data'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isUrdu ? 'پہلے سے محفوظ شدہ فائل سے ڈیٹا بحال کریں' : 'Restore from a previously exported JSON backup'}
                    </p>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'یہاں بیک اپ JSON کا ٹیکسٹ پیسٹ کریں یا فائل کا مواد ڈالیں...'
                      : 'Paste exported JSON content here...'
                  }
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />

                <button
                  onClick={handleImportBackup}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isUrdu ? 'ڈیٹا امپورٹ اور بحال کریں' : 'Import & Restore Data'}</span>
                </button>
              </div>
            </div>

            {/* Factory Reset Danger Zone */}
            <div className="bg-rose-950/30 border border-rose-900/60 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{isUrdu ? 'ڈیٹا فیکٹری ری سیٹ' : 'Factory Reset'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu
                    ? 'پورٹل کے تمام نوٹس کو شامی اکیڈمی کے بنیادی 2026 ایڈیشن کے نوٹس پر واپس بحال کریں۔'
                    : 'Reset all modified notes back to official default high-school academic bank.'}
                </p>
              </div>

              <button
                onClick={handleResetDefaults}
                className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {isUrdu ? 'اصل حالت پر ری سیٹ کریں' : 'Reset to Default Notes'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Live Google Drive PDF Preview Modal */}
      {previewDriveUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="p-1 bg-emerald-600/30 text-emerald-400 rounded">
                  <Eye className="w-4 h-4" />
                </span>
                <span className="font-bold text-white truncate max-w-md">
                  {isUrdu ? 'گوگل ڈرائیو لائیو پی ڈی ایف ٹیسٹ' : 'Google Drive PDF Live Embed Test'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'نئی ونڈو' : 'Open Direct'}</span>
                </a>

                <button
                  onClick={() => setPreviewDriveUrl(null)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 relative">
              <iframe
                src={formatDriveEmbedUrl(previewDriveUrl)}
                title="Google Drive Document Preview"
                className="w-full h-full border-none"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
