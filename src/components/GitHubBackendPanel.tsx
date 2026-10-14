import React, { useState, useEffect, useRef } from 'react';
import { NoteDetail } from '../types';
import {
  GitHubConfig,
  UploadedFileRecord,
  getGitHubConfig,
  saveGitHubConfig,
  testGitHubConnection,
  pushNotesToGitHub,
  pullNotesFromGitHub,
  uploadFileToGitHub,
  listGitHubFiles,
  getLocalUploadedFiles,
} from '../utils/githubService';
import {
  Github,
  GitBranch,
  Upload,
  Download,
  RefreshCw,
  Check,
  Copy,
  ExternalLink,
  Eye,
  AlertCircle,
  CheckCircle2,
  FileText,
  FileCode,
  FolderGit2,
  HardDrive,
  Globe,
  Lock,
  Layers,
  Sparkles,
  Link2,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface GitHubBackendPanelProps {
  notes: NoteDetail[];
  isUrdu: boolean;
  onNotesUpdated: () => void;
  onAttachUrlToNote: (noteId: string, url: string) => void;
  onPreviewUrl: (url: string) => void;
}

export const GitHubBackendPanel: React.FC<GitHubBackendPanelProps> = ({
  notes,
  isUrdu,
  onNotesUpdated,
  onAttachUrlToNote,
  onPreviewUrl,
}) => {
  // Configuration state
  const [config, setConfig] = useState<GitHubConfig>(getGitHubConfig());
  const [showToken, setShowToken] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Connection test state
  const [connStatus, setConnStatus] = useState<{
    status: 'idle' | 'checking' | 'connected' | 'error';
    message: string;
    repoDetails?: any;
  }>({ status: 'idle', message: '' });

  // Sync state
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [syncAlert, setSyncAlert] = useState<{
    type: 'success' | 'error';
    msg: string;
    url?: string;
  } | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastUploaded, setLastUploaded] = useState<UploadedFileRecord | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileRecord[]>(getLocalUploadedFiles());
  const [selectedFolder, setSelectedFolder] = useState<string>('public/uploads');
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);
  const [attachModalNoteId, setAttachModalNoteId] = useState<string>('');
  const [attachSuccessMsg, setAttachSuccessMsg] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active sub-tab inside GitHub panel
  const [subTab, setSubTab] = useState<'sync' | 'uploader' | 'settings' | 'guide'>('sync');

  // Load uploaded files list from remote/local
  const refreshFiles = async (cfg = config) => {
    const res = await listGitHubFiles(cfg);
    setUploadedFiles(res.files);
  };

  useEffect(() => {
    refreshFiles(config);
    if (config.owner && config.repo && config.token) {
      testConnection(config, false);
    }
  }, []);

  const testConnection = async (targetConfig = config, showToast = true) => {
    setConnStatus({ status: 'checking', message: isUrdu ? 'کنکشن چیک ہو رہا ہے...' : 'Verifying repository...' });
    const res = await testGitHubConnection(targetConfig);
    if (res.success) {
      setConnStatus({
        status: 'connected',
        message: res.message,
        repoDetails: res.repoDetails,
      });
      if (showToast) {
        setSyncAlert({ type: 'success', msg: res.message });
      }
    } else {
      setConnStatus({
        status: 'error',
        message: res.message,
      });
      if (showToast) {
        setSyncAlert({ type: 'error', msg: res.message });
      }
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveGitHubConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    testConnection(config, true);
  };

  const handlePushToGitHub = async () => {
    setIsPushing(true);
    setSyncAlert(null);
    try {
      const res = await pushNotesToGitHub(config, notes);
      if (res.success) {
        setSyncAlert({
          type: 'success',
          msg: res.message,
          url: res.commitUrl,
        });
      } else {
        setSyncAlert({ type: 'error', msg: res.message });
      }
    } finally {
      setIsPushing(false);
    }
  };

  const handlePullFromGitHub = async () => {
    setIsPulling(true);
    setSyncAlert(null);
    try {
      const res = await pullNotesFromGitHub(config);
      if (res.success) {
        onNotesUpdated();
        setSyncAlert({ type: 'success', msg: res.message });
      } else {
        setSyncAlert({ type: 'error', msg: res.message });
      }
    } finally {
      setIsPulling(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(10);
    setSyncAlert(null);

    const res = await uploadFileToGitHub(
      config,
      selectedFile,
      selectedFolder,
      (pct) => setUploadProgress(pct)
    );

    setIsUploading(false);
    if (res.success && res.fileRecord) {
      setLastUploaded(res.fileRecord);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      refreshFiles();
      setSyncAlert({ type: 'success', msg: res.message });
    } else {
      setSyncAlert({ type: 'error', msg: res.message });
    }
  };

  const copyToClipboard = (text: string, typeKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLinkType(typeKey);
    setTimeout(() => setCopiedLinkType(null), 2500);
  };

  const handleAttachLinkToNote = (fileRecord: UploadedFileRecord) => {
    if (!attachModalNoteId) return;
    // Prefer CDN or Raw for universal embedding
    const targetUrl = fileRecord.cdnUrl || fileRecord.rawUrl;
    onAttachUrlToNote(attachModalNoteId, targetUrl);
    setAttachSuccessMsg(
      isUrdu
        ? 'فائل لنک کامیابی سے نوٹ کے ساتھ منسلک کر دیا گیا ہے!'
        : 'File link attached to note successfully!'
    );
    setTimeout(() => {
      setAttachSuccessMsg(null);
      setAttachModalNoteId('');
    }, 2500);
  };

  const isConfigured = Boolean(config.owner && config.repo && config.token);

  return (
    <div className="space-y-6">
      {/* Hero Banner for GitHub Backend */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border border-indigo-800/80 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold">
              <Github className="w-3.5 h-3.5" />
              <span>{isUrdu ? '100% مفت کلاؤڈ بیک اینڈ اور فائل اسٹوریج' : 'GitHub Zero-Server Cloud Backend'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isUrdu
                ? 'گٹ ہب پر مبنی مکمل بیک اینڈ اور فائل اپلوڈر'
                : 'GitHub-Powered Backend & Live Media Storage'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isUrdu
                ? 'کسی فائر بیس یا مہنگے سرور کی ضرورت نہیں! آپ کی گٹ ہب ریپوزٹری بذات خود لائیو ڈیٹا بیس اور فائل ہوسٹنگ کا کام کرتی ہے۔ یہاں سے آپ تمام نوٹس، لنکس اور پی ڈی ایف فائلیں براہ راست گٹ ہب میں محفوظ اور سنک کر سکتے ہیں۔'
                : 'Zero database fees, no Firebase credentials needed! Your GitHub repository acts as a real-time headless CMS and CDN media host. Commit notes, upload chapter PDFs, and manage permanent links right here.'}
            </p>
          </div>

          {/* Quick Status Pill */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shrink-0 flex flex-col gap-2 min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isUrdu ? 'کنکشن سٹیٹس:' : 'Connection Status:'}</span>
              {connStatus.status === 'connected' ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isUrdu ? 'منسلک' : 'Connected'}
                </span>
              ) : connStatus.status === 'checking' ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  {isUrdu ? 'چیکنگ' : 'Checking'}
                </span>
              ) : (
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  {isConfigured ? (isUrdu ? 'غیر مصدقہ' : 'Unverified') : (isUrdu ? 'کنفیگر کریں' : 'Needs Setup')}
                </span>
              )}
            </div>

            {config.owner && config.repo && (
              <div className="text-xs font-mono text-indigo-300 truncate">
                {config.owner}/{config.repo}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>{isUrdu ? 'پورٹل نوٹس:' : 'Total Notes:'}</span>
              <span className="text-white font-bold">{notes.length}</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Inside GitHub Panel */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <button
            onClick={() => setSubTab('sync')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'sync'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ڈیٹا سنک اور پش (Sync & Push)' : 'Database Sync & Push'}</span>
          </button>

          <button
            onClick={() => setSubTab('uploader')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'uploader'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'فائلیں اور پی ڈی ایف اپلوڈر' : 'File & PDF Uploader'}</span>
            <span className="bg-indigo-950 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-full border border-indigo-800">
              {uploadedFiles.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ریپوزٹری سیٹنگز' : 'Repository Settings'}</span>
          </button>

          <button
            onClick={() => setSubTab('guide')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'گٹ ہب پیجز گائیڈ اور ڈومین' : 'GitHub Pages & Domain Guide'}</span>
          </button>
        </div>
      </div>

      {/* Global Alert Notification */}
      {syncAlert && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn ${
            syncAlert.type === 'success'
              ? 'bg-emerald-950/90 border border-emerald-800 text-emerald-200'
              : 'bg-rose-950/90 border border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {syncAlert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <span>{syncAlert.msg}</span>
              {syncAlert.url && (
                <a
                  href={syncAlert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 underline font-bold text-white hover:text-emerald-300 inline-flex items-center gap-1"
                >
                  <span>{isUrdu ? 'گٹ ہب کمٹ دیکھیں' : 'View Commit on GitHub'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <button
            onClick={() => setSyncAlert(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* SUB-TAB 1: SYNC & DATABASE OPERATIONS */}
      {subTab === 'sync' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Action Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-5">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-indigo-400" />
                  <span>
                    {isUrdu
                      ? 'لائیو کلاؤڈ بیک اینڈ سنکرونائزیشن (Live Cloud Sync)'
                      : 'Live Cloud Backend Synchronization'}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu
                    ? 'ایک کلک میں تمام کلاسز (9, 10, 11, 12) کے نوٹس، فارمولے اور لنکس اپنی گٹ ہب ریپوزٹری میں پش یا ڈاؤنلوڈ کریں:'
                    : 'Push all current notes, drive links, and solved questions directly to your GitHub repository database file:'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Push to GitHub */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wide">
                      <Upload className="w-4 h-4" />
                      <span>{isUrdu ? 'گٹ ہب پر محفوظ کریں (Push)' : 'Push to GitHub'}</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {isUrdu
                        ? 'پورٹل کا تمام ڈیٹا آپ کی گٹ ہب ریپو میں `public/data/notes.json` کے طور پر کمٹ کر دیا جائے گا۔'
                        : 'Commits all notes to your repo as public/data/notes.json instantly.'}
                    </p>
                  </div>

                  <button
                    onClick={handlePushToGitHub}
                    disabled={isPushing}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPushing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isUrdu ? 'گٹ ہب پر کمٹ ہو رہا ہے...' : 'Pushing Commit...'}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>
                          {isUrdu
                            ? `تمام نوٹس گٹ ہب پر اپلوڈ کریں (${notes.length})`
                            : `Push All Notes to GitHub (${notes.length})`}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pull from GitHub */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                      <Download className="w-4 h-4" />
                      <span>{isUrdu ? 'گٹ ہب سے ڈیٹا لائیں (Pull)' : 'Pull from GitHub'}</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {isUrdu
                        ? 'اگر آپ نے دوسرے کمپیوٹر سے تبدیلی کی ہو تو گٹ ہب سے تازہ ترین فائل ڈاؤنلوڈ کر کے سنک کریں۔'
                        : 'Downloads latest notes from repo into this browser session.'}
                    </p>
                  </div>

                  <button
                    onClick={handlePullFromGitHub}
                    disabled={isPulling}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPulling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isUrdu ? 'ڈیٹا ڈاؤنلوڈ ہو رہا ہے...' : 'Pulling Notes...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{isUrdu ? 'گٹ ہب سے نوٹس حاصل کریں' : 'Pull from GitHub Repo'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Data Path indicator */}
              <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span>{isUrdu ? 'ڈیٹا بیس فائل پاتھ:' : 'Database File Path:'}</span>
                  <code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">
                    {config.dataPath || 'public/data/notes.json'}
                  </code>
                </span>

                <span className="text-slate-400 text-[11px]">
                  Branch: <strong className="text-white">{config.branch || 'main'}</strong>
                </span>
              </div>
            </div>

            {/* Quick Live Links Showcase */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>
                  {isUrdu ? 'براہ راست عوامی لنکس (Public CDN & API Endpoints)' : 'Public API & CDN Endpoints'}
                </span>
              </h4>

              <div className="space-y-2.5 text-xs">
                {config.owner && config.repo && (
                  <>
                    <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-slate-400 block text-[11px]">GitHub Raw Endpoint:</span>
                        <code className="text-indigo-300 font-mono text-[11px] truncate block">
                          https://raw.githubusercontent.com/{config.owner}/{config.repo}/{config.branch}/{config.dataPath}
                        </code>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${config.dataPath}`,
                            'raw-json'
                          )
                        }
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer shrink-0"
                      >
                        {copiedLinkType === 'raw-json' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-slate-400 block text-[11px]">Global Fast CDN (jsDelivr):</span>
                        <code className="text-emerald-300 font-mono text-[11px] truncate block">
                          https://cdn.jsdelivr.net/gh/{config.owner}/{config.repo}@{config.branch}/{config.dataPath}
                        </code>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `https://cdn.jsdelivr.net/gh/${config.owner}/${config.repo}@{config.branch}/${config.dataPath}`,
                            'cdn-json'
                          )
                        }
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer shrink-0"
                      >
                        {copiedLinkType === 'cdn-json' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Side Info & Checklist */}
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isUrdu ? 'گٹ ہب بیک اینڈ کے فوائد' : 'Why GitHub as Backend?'}</span>
              </h4>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>{isUrdu ? '100% مفت اور لامحدود:' : '100% Free Forever:'}</strong>{' '}
                    {isUrdu
                      ? 'نہ مہینے کا خرچہ، نہ کریڈٹ کارڈ کی ضرورت، نہ ہی ڈیٹا ختم ہونے کا خطرہ۔'
                      : 'Zero monthly hosting costs or credit card requirements.'}
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>{isUrdu ? 'عالمی رفتار (Fast Global CDN):' : 'Ultra Fast Worldwide:'}</strong>{' '}
                    {isUrdu
                      ? 'jsDelivr اور GitHub کے عالمی سرورز سے طلباء کے لیے نوٹس سیکنڈز میں کھلتے ہیں۔'
                      : 'Global CDN serves PDFs and JSON data with high performance.'}
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>{isUrdu ? 'خودکار تاریخ اور بیک اپ:' : 'Version History & Revert:'}</strong>{' '}
                    {isUrdu
                      ? 'ہر تبدیلی کا ریکارڈ گٹ ہب کمٹس میں محفوظ رہتا ہے، پرانا ڈیٹا کبھی ضائع نہیں ہوتا۔'
                      : 'Every change is safely tracked and reversible on GitHub.'}
                  </span>
                </li>
              </ul>

              <div className="pt-3 border-t border-slate-700">
                <button
                  onClick={() => setSubTab('settings')}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-650 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'ریپو اور ٹوکن سیٹ کریں' : 'Configure Repo & Token'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FILE & PDF UPLOADER */}
      {subTab === 'uploader' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>
                    {isUrdu
                      ? 'براہ راست پی ڈی ایف، تصاویر اور نوٹس اپلوڈر'
                      : 'Direct File & PDF Upload to GitHub Repository'}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {isUrdu
                    ? 'کوئی بھی PDF، Word فائل یا تصویر یہاں اپلوڈ کریں، وہ سیدھی آپ کی ریپوزٹری میں اپلوڈ ہو کر فوری لائیو لنک بن جائے گی:'
                    : 'Upload PDF notes, past papers, diagrams directly to your repository folder with instant public link:'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{isUrdu ? 'فولڈر:' : 'Target Folder:'}</span>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-indigo-300 font-mono"
                >
                  <option value="public/uploads">public/uploads (GitHub Pages)</option>
                  <option value="notes-pdf">notes-pdf (Root Folder)</option>
                  <option value="public/past-papers">public/past-papers</option>
                </select>
              </div>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/40 scale-[1.01]'
                  : 'border-slate-700 hover:border-indigo-500/70 bg-slate-900/50 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="p-4 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                  <Upload className="w-8 h-8" />
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>{selectedFile.name}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type || 'Document'}
                    </p>
                    <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                      {isUrdu ? 'فائل منتخب ہو چکی ہے۔ نیچے بٹن دبائیں!' : 'File selected! Click Upload button below.'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1 max-w-md">
                    <p className="text-sm font-bold text-white">
                      {isUrdu
                        ? 'فائل یہاں ڈریگ کر کے لائیں یا کلک کر کے منتخب کریں'
                        : 'Drag & Drop your PDF file here, or click to browse'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isUrdu
                        ? 'سپورٹ شدہ فائلیں: PDF، Word ڈاکومنٹس، اور تصاویر (زیادہ سے زیادہ 25 MB فی فائل)'
                        : 'Supported formats: PDF, DOCX, PNG, JPG (GitHub REST API limit ~25MB)'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Action Row */}
            {selectedFile && (
              <div className="bg-slate-900 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="font-semibold">{selectedFile.name}</span>
                  <span className="text-slate-500">→</span>
                  <span className="font-mono text-indigo-300">{selectedFolder}/</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                  >
                    {isUrdu ? 'منسوخ' : 'Cancel'}
                  </button>

                  <button
                    onClick={handleUploadSubmit}
                    disabled={isUploading}
                    className="flex-1 sm:flex-none px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{isUrdu ? 'اپلوڈ ہو رہا ہے...' : `Uploading (${uploadProgress}%)...`}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'گٹ ہب پر فائل اپلوڈ کریں' : 'Upload to GitHub Now'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Last Uploaded Result Card */}
            {lastUploaded && (
              <div className="bg-slate-900 border border-emerald-600/40 rounded-xl p-4 sm:p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-white">
                        {isUrdu ? 'فائل کامیابی سے اپلوڈ ہو گئی!' : 'File Uploaded Successfully!'}
                      </h5>
                      <span className="text-[11px] text-slate-400">{lastUploaded.name}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onPreviewUrl(lastUploaded.cdnUrl || lastUploaded.rawUrl)}
                    className="px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'پریویو ٹیسٹ' : 'Test Preview'}</span>
                  </button>
                </div>

                {/* Direct Links generated */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        CDN Fast Embed Link (تجویز کردہ):
                      </span>
                      <code className="text-emerald-400 font-mono text-[11px] truncate block">
                        {lastUploaded.cdnUrl}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(lastUploaded.cdnUrl, 'last-cdn')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedLinkType === 'last-cdn' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedLinkType === 'last-cdn' ? 'کاپی ہو گیا' : 'کاپی'}</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        GitHub Raw URL:
                      </span>
                      <code className="text-indigo-300 font-mono text-[11px] truncate block">
                        {lastUploaded.rawUrl}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(lastUploaded.rawUrl, 'last-raw')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedLinkType === 'last-raw' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedLinkType === 'last-raw' ? 'کاپی ہو گیا' : 'کاپی'}</span>
                    </button>
                  </div>
                </div>

                {/* Attach directly to a Note */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-bold">
                      {isUrdu ? 'کسی نوٹ کے ساتھ جوڑیں:' : 'Attach to Note:'}
                    </span>
                    <select
                      value={attachModalNoteId}
                      onChange={(e) => setAttachModalNoteId(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white max-w-xs"
                    >
                      <option value="">{isUrdu ? '-- نوٹ منتخب کریں --' : '-- Select Note --'}</option>
                      {notes.map((n) => (
                        <option key={n.id} value={n.id}>
                          Class {n.grade.replace('th', '')} · {n.subjectName}: {n.chapterTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleAttachLinkToNote(lastUploaded)}
                    disabled={!attachModalNoteId}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    {isUrdu ? 'لنک محفوظ کریں' : 'Save Link to Note'}
                  </button>
                </div>

                {attachSuccessMsg && (
                  <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{attachSuccessMsg}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Uploaded Files Library */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isUrdu ? 'ریپوزٹری میں اپلوڈ شدہ فائلیں' : 'Repository Uploaded Files Library'}
                  </span>
                </h4>
                <span className="text-xs text-slate-400">
                  {isUrdu
                    ? 'یہ تمام فائلیں آپ کی گٹ ہب ریپو میں محفوظ ہیں اور 24/7 لائیو دستیاب ہیں:'
                    : 'Hosted files available in repository:'}
                </span>
              </div>

              <button
                onClick={() => refreshFiles()}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ری فریش کریں' : 'Refresh List'}</span>
              </button>
            </div>

            {uploadedFiles.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {isUrdu
                  ? 'ابھی تک کوئی فائل اپلوڈ نہیں ہوئی۔ اوپر دیے گئے باکس سے پہلی فائل اپلوڈ کریں۔'
                  : 'No files uploaded yet. Upload your first PDF above!'}
              </div>
            ) : (
              <div className="divide-y divide-slate-700/60 max-h-96 overflow-y-auto">
                {uploadedFiles.map((f, idx) => (
                  <div
                    key={f.path || idx}
                    className="p-4 hover:bg-slate-750 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 text-indigo-400 rounded-lg shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate max-w-xs sm:max-w-md">
                          {f.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>{f.size ? `${(f.size / 1024).toFixed(1)} KB` : 'File'}</span>
                          <span>·</span>
                          <span className="font-mono text-slate-500 truncate">{f.path}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onPreviewUrl(f.cdnUrl || f.rawUrl)}
                        className="px-2.5 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'دیکھیں' : 'Preview'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(f.cdnUrl || f.rawUrl, `file-${idx}`)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedLinkType === `file-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedLinkType === `file-${idx}` ? 'کاپی' : 'کاپی لنک'}</span>
                      </button>

                      <a
                        href={f.rawUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                        title="Download / Open Direct"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REPOSITORY SETTINGS */}
      {subTab === 'settings' && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-6">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span>{isUrdu ? 'گٹ ہب ریپوزٹری کی تفصیلات' : 'GitHub Repository Configuration'}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {isUrdu
                ? 'اپنے گٹ ہب اکاؤنٹ کا صارف نام اور Personal Access Token درج کریں تاکہ یہ پینل خودکار طریقے سے فائلیں سنک کر سکے:'
                : 'Connect your GitHub repository to enable automatic commits, file uploads, and continuous database updates:'}
            </p>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isUrdu ? 'گٹ ہب صارف نام (GitHub Username / Owner):' : 'GitHub Username / Owner:'}
                </label>
                <input
                  type="text"
                  required
                  value={config.owner}
                  onChange={(e) => setConfig({ ...config, owner: e.target.value.trim() })}
                  placeholder="e.g. princeshami365 or your-username"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isUrdu ? 'ریپوزٹری کا نام (Repository Name):' : 'Repository Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={config.repo}
                  onChange={(e) => setConfig({ ...config, repo: e.target.value.trim() })}
                  placeholder="e.g. shami-academy or educational-portal"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-indigo-400" />
                    <span>{isUrdu ? 'پرسنل ایکسس ٹوکن (Personal Access Token):' : 'Personal Access Token (PAT):'}</span>
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=Shami+Academy+Backend"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold underline flex items-center gap-0.5"
                  >
                    <span>{isUrdu ? '1-کلک نیا ٹوکن بنائیں' : 'Create Token on GitHub'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    required
                    value={config.token}
                    onChange={(e) => setConfig({ ...config, token: e.target.value.trim() })}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[11px] font-semibold"
                  >
                    {showToken ? 'چھپائیں' : 'دیکھیں'}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {isUrdu
                    ? 'گٹ ہب پر ٹوکن بناتے وقت صرف "repo" کا چیک مارک لگائیں۔ یہ ٹوکن صرف آپ کے براؤزر میں محفوظ رہتا ہے۔'
                    : 'Make sure token has "repo" permission checked. It stays securely in your local browser only.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isUrdu ? 'برانچ (Git Branch):' : 'Branch:'}
                </label>
                <input
                  type="text"
                  value={config.branch}
                  onChange={(e) => setConfig({ ...config, branch: e.target.value.trim() })}
                  placeholder="main"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isUrdu ? 'ڈیٹا بیس فائل پاتھ (Database Path):' : 'Database JSON Path:'}
                </label>
                <input
                  type="text"
                  value={config.dataPath}
                  onChange={(e) => setConfig({ ...config, dataPath: e.target.value.trim() })}
                  placeholder="public/data/notes.json"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {isUrdu ? 'کسٹم ڈومین (اختیاری - Custom Domain):' : 'Custom Domain (Optional):'}
                </label>
                <input
                  type="text"
                  value={config.customDomain || ''}
                  onChange={(e) => setConfig({ ...config, customDomain: e.target.value.trim() })}
                  placeholder="e.g. notes.shamiacademy.com (or leave empty)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-700">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'سیٹنگز محفوظ ہو گئیں!' : 'Saved!'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'سیٹنگز محفوظ کریں' : 'Save Configuration'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => testConnection(config, true)}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'کنکشن ٹیسٹ کریں' : 'Test Connection'}</span>
                </button>
              </div>

              {connStatus.status === 'connected' && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUrdu ? 'کنکشن فعال اور تیار ہے!' : 'Connected & Ready!'}</span>
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 4: GITHUB PAGES DEPLOYMENT GUIDE */}
      {subTab === 'guide' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-6">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>
                  {isUrdu
                    ? 'گٹ ہب پر مکمل پورٹل لائیو کرنے کا طریقہ (GitHub Pages Step-by-Step)'
                    : 'How to Publish Shami Academy on GitHub Pages:'}
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {isUrdu
                  ? 'گٹ ہب آپ کو اپنی مفت ڈومین دیتا ہے (جیسے username.github.io/reponame)۔ درج ذیل 4 آسان مراحل پر عمل کریں:'
                  : 'Publish your complete portal with custom domain or free github.io subdomain in 4 easy steps:'}
              </p>
            </div>

            {/* Step-by-Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>{isUrdu ? 'گٹ ہب پر ریپوزٹری بنائیں' : 'Create GitHub Repository'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUrdu ? (
                    <>
                      1. اپنے گٹ ہب اکاؤنٹ پر جائیں اور{' '}
                      <a
                        href="https://github.com/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 underline font-bold"
                      >
                        github.com/new
                      </a>{' '}
                      پر کلک کریں۔<br />
                      2. ریپوزٹری کا نام رکھیں (مثلاً: <code>shami-academy-portal</code>) اور اسے{' '}
                      <strong>Public</strong> رکھیں۔
                    </>
                  ) : (
                    <>
                      Go to GitHub &gt; New Repository (e.g. <code>shami-academy-portal</code>). Make it Public so GitHub Pages is free.
                    </>
                  )}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>{isUrdu ? 'گٹ ہب ایکشنز ورک فلو موجود ہے' : 'Automated Build Workflow Ready'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUrdu ? (
                    <>
                      آپ کے پراجیکٹ میں <code>.github/workflows/deploy.yml</code> فائل پہلے سے شامل کر دی گئی ہے۔ جیسے ہی آپ کوڈ گٹ ہب پر ڈالیں گے، گٹ ہب خود بخود سائٹ کو بلڈ کر کے لائیو کر دے گا!
                    </>
                  ) : (
                    <>
                      The project already includes <code>.github/workflows/deploy.yml</code>. Whenever you push code, GitHub Actions builds and publishes it automatically.
                    </>
                  )}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase">
                  <span className="w-5 h-5 rounded-full bg-sky-600/30 text-sky-300 flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>{isUrdu ? 'گٹ ہب پیجز فعال کریں' : 'Enable GitHub Pages in Settings'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUrdu ? (
                    <>
                      1. ریپوزٹری کے <strong>Settings &gt; Pages</strong> میں جائیں۔<br />
                      2. <strong>Source</strong> میں <strong>"GitHub Actions"</strong> منتخب کریں۔ بس! چند سیکنڈز میں سائٹ لائیو ہو جائے گی۔
                    </>
                  ) : (
                    <>
                      Go to Repository &gt; Settings &gt; Pages &gt; Under <strong>Build and deployment Source</strong>, select <strong>GitHub Actions</strong>.
                    </>
                  )}
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                  <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>{isUrdu ? 'پرسنل ٹوکن جوڑیں اور پینل چلائیں' : 'Connect Token & Run Anywhere'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUrdu ? (
                    <>
                      جب سائٹ لائیو ہو جائے، تو اس ایڈمن پینل کے <strong>ریپوزٹری سیٹنگز</strong> میں اپنا ٹوکن ڈالیں۔ اب آپ براہ راست لائیو سائٹ سے نئے نوٹس، لنکس اور فائلیں اپلوڈ کر سکتے ہیں!
                    </>
                  ) : (
                    <>
                      On your live deployed site, open this Admin Panel, save your PAT token once, and you have a 100% working live cloud CMS forever!
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
