import React, { useState } from 'react';
import { getBloggerXmlCode, getStandaloneHtmlCode } from '../data/bloggerTemplate';
import { X, Copy, Check, Download, Code2, FileCode, HelpCircle, Sparkles } from 'lucide-react';

interface BloggerCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUrdu: boolean;
}

export const BloggerCodeModal: React.FC<BloggerCodeModalProps> = ({
  isOpen,
  onClose,
  isUrdu,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'xml' | 'html' | 'guide' | 'post-guide'>('xml');
  const [copied, setCopied] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Interactive Post Generator States
  const [genGrade, setGenGrade] = useState<'9' | '10' | '11' | '12'>('9');
  const [genType, setGenType] = useState<'Notes' | 'Scheme'>('Notes');
  const [genSubject, setGenSubject] = useState<string>('Physics');
  const [genChapter, setGenChapter] = useState<string>('Chapter 1 Physical Quantities');
  const [genDriveUrl, setGenDriveUrl] = useState<string>(
    'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view'
  );
  const [copiedGenPost, setCopiedGenPost] = useState(false);

  // Format Drive URL to /preview
  const formatEmbed = (raw: string) => {
    let clean = raw.trim();
    const matchIframe = clean.match(/src=["'](.*?)["']/);
    if (matchIframe && matchIframe[1]) clean = matchIframe[1];
    const matchId = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) return `https://drive.google.com/file/d/${matchId[1]}/preview`;
    return clean;
  };

  const calculatedEmbed = formatEmbed(genDriveUrl);
  const calculatedLabel = `Class ${genGrade} ${genType}`;

  const generatedPostHtml = `<div style="font-family:'Plus Jakarta Sans',sans-serif; line-height:1.7; color:#1e293b; max-width:800px; margin:0 auto;">
  <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:10px; padding:16px; margin-bottom:20px;">
    <h2 style="color:#065f46; margin:0 0 8px 0; font-size:20px;">Class ${genGrade} ${genSubject} - ${genChapter}</h2>
    <p style="margin:0; font-size:13px; color:#047857;">Official study material &amp; textbook solved preparation by <strong>Shami Academy</strong>.</p>
  </div>

  <h3 style="color:#0f172a; margin:20px 0 10px 0; font-size:16px;">Embedded Google Drive PDF Viewer:</h3>
  <div style="position:relative; width:100%; height:620px; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden; margin:14px 0; background:#0f172a;">
    <iframe src="${calculatedEmbed}" width="100%" height="100%" style="border:none;" allow="autoplay"></iframe>
  </div>

  <div style="text-align:center; margin:24px 0;">
    <a href="${genDriveUrl.replace('/preview', '/view')}" target="_blank" style="display:inline-block; background:#047857; color:#ffffff; font-weight:700; padding:12px 26px; border-radius:8px; text-decoration:none; font-size:14px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
      Download Full PDF from Google Drive &#8594;
    </a>
  </div>
</div>`;

  const xmlCode = getBloggerXmlCode();
  const htmlCode = getStandaloneHtmlCode();

  const currentCode = activeTab === 'xml' ? xmlCode : htmlCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyGenPost = () => {
    navigator.clipboard.writeText(generatedPostHtml);
    setCopiedGenPost(true);
    setTimeout(() => setCopiedGenPost(false), 2500);
  };

  const handleDownload = () => {
    const filename =
      activeTab === 'xml'
        ? 'Shami-Academy-Blogger-Theme.xml'
        : 'Shami-Academy-WordPress-Style.html';
    const type = activeTab === 'xml' ? 'text/xml;charset=utf-8' : 'text/html;charset=utf-8';
    const blob = new Blob([currentCode], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isUrdu ? 'بلاگر مکمل کوڈ (ورڈپریس لک)' : 'Full Blogger Theme Code (WordPress Style)'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isUrdu
                  ? 'شامی اکیڈمی کا تیار شدہ ایچ ٹی ایم ایل، سی ایس ایس اور جاوا اسکرپٹ کوڈ'
                  : 'Ready-to-use HTML, CSS & JavaScript theme for free Blogger and web hosting'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('xml')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'xml'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Blogger XML Theme (.xml)</span>
            </button>

            <button
              onClick={() => setActiveTab('html')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'html'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Standalone HTML/CSS (.html)</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'تھیم انسٹال گائیڈ' : 'Theme Install Guide'}</span>
            </button>

            <button
              onClick={() => setActiveTab('post-guide')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'post-guide'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isUrdu ? 'پوسٹ اور لنکس کا طریقہ' : 'Post & Labels Guide'}</span>
            </button>
          </div>

          {activeTab !== 'guide' && (
            <div className="flex items-center gap-2 py-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isUrdu ? 'کوڈ کاپی ہو گیا!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'کوڈ کاپی کریں' : 'Copy Code'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'فائل ڈاؤنلوڈ کریں' : 'Download File'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs">
          {activeTab === 'guide' ? (
            <div className="font-sans text-slate-800 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>{isUrdu ? 'تھیم لگانے کا 100٪ پکا اور کامیاب طریقہ:' : '100% Reliable Blogger Installation Guide:'}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isUrdu
                    ? 'شامی اکیڈمی کا نیا تھیم کوڈ گوگل بلاگر کے تمام اصولوں کے مطابق درست کر دیا گیا ہے۔'
                    : 'The Shami Academy theme XML is 100% compliant with Blogger XML specifications.'}
                </p>
              </div>

              {/* Update fail explanation and fix */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <span>⚠️</span>
                  <span>{isUrdu ? 'پہلے "Update failed" کیوں کہہ رہا تھا؟' : 'Why did "Update failed" happen earlier?'}</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {isUrdu
                    ? 'گوگل بلاگر کا قانون ہے کہ تھیم میں کوئی بھی `<b:section>` خالی نہیں ہو سکتی، ہر سیکشن کے اندر کم از کم ایک `<b:widget>` ہونا لازمی ہے۔ پچھلے کوڈ میں سائڈبار سیکشن خالی تھا جس پر بلاگر ایرر 400 دیتا تھا۔ اب ہم نے تمام وجٹس کو سیکشن کے اندر باقاعدہ بند کر کے مکمل ٹھیک کر دیا ہے!'
                    : 'Blogger requires every `<b:section>` to contain at least one widget. The sidebar section was previously empty, causing Error 400. All widgets are now properly nested inside `<b:section>` tags.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Method 1: Restore / Upload (Recommended) */}
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-700 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {isUrdu ? 'طریقہ نمبر 1 (سب سے آسان اور 100٪ بغیر کسی غلطی کے)' : 'Method 1 (Recommended - 100% Success)'}
                    </span>
                    <span className="text-xs font-bold text-emerald-950">Restore / Upload</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {isUrdu
                      ? 'اگر کبھی بلاگر کا ایڈیٹر براؤزر کیشے کی وجہ سے سیو نہ کرے، تو فائل سیدھی اپلوڈ کرنے سے بلاگر 1 سیکنڈ میں تھیم لگا دیتا ہے:'
                      : 'Uploading the XML file directly avoids any browser editor glitch:'}
                  </p>
                  <ol className="text-xs text-emerald-950 list-decimal list-inside space-y-1.5 font-medium leading-relaxed bg-white/70 p-3 rounded-lg border border-emerald-200">
                    <li>اوپر موجود بٹن <strong>"فائل ڈاؤنلوڈ کریں" (Download File)</strong> پر کلک کر کے <code>Shami-Academy-Blogger-Theme.xml</code> ڈاؤنلوڈ کریں۔</li>
                    <li>اپنے بلاگر اکاؤنٹ میں جائیں اور بائیں مینو سے <strong>Theme</strong> پر کلک کریں۔</li>
                    <li><strong>Customize</strong> بٹن کے ساتھ بنے چھوٹے تیر (ڈراپ ڈاؤن ▾) پر کلک کریں۔</li>
                    <li>وہاں <strong>"Restore"</strong> منتخب کریں اور پھر <strong>"Upload"</strong> بٹن دبائیں۔</li>
                    <li>ڈاؤنلوڈ شدہ <code>Shami-Academy-Blogger-Theme.xml</code> فائل منتخب کریں۔ بلاگر فوراً تھیم اپلائی کر دے گا!</li>
                  </ol>
                </div>

                {/* Method 2: Edit HTML */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {isUrdu ? 'طریقہ نمبر 2' : 'Method 2'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">Edit HTML (کاپی پیسٹ)</span>
                  </div>
                  <ol className="text-xs text-slate-700 list-decimal list-inside space-y-1 leading-relaxed">
                    <li>اوپر موجود <strong>"کوڈ کاپی کریں" (Copy Code)</strong> کا بٹن دبائیں۔</li>
                    <li>بلاگر میں <strong>Theme ➔ Customize کے ساتھ تیر ➔ Edit HTML</strong> پر کلک کریں۔</li>
                    <li>سارا پرانا کوڈ منتخب کریں (Ctrl + A) اور ڈیلیٹ کریں۔</li>
                    <li>نیا کاپی شدہ کوڈ پیسٹ (Ctrl + V) کر کے اوپر دائیں جانب <strong>Save</strong> آئیکن دبائیں۔</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : activeTab === 'post-guide' ? (
            <div className="font-sans text-slate-800 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  {isUrdu ? 'پوسٹ ڈالنے اور مینو لنکس سے جوڑنے کا مکمل طریقہ:' : 'How Posts Automatically Connect to Menu Links:'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isUrdu
                    ? 'آپ نے پوچھا تھا کہ مینو کے لنکس (Class 9, Class 10 وغیرہ) پوسٹوں کو کیسے تلاش کرتے ہیں۔ بلاگر میں یہ کام "Labels" (لیبلز) کے ذریعے ہوتا ہے! جب آپ پوسٹ لکھتے ہیں تو دائیں طرف لیبل لکھتے ہیں، مینو خودبخود اسی لیبل کی تمام پوسٹیں دکھاتا ہے۔'
                    : 'Blogger menu links connect through "Labels". When publishing a post, assign the exact matching label in the right sidebar. Blogger will automatically route and list that post under that specific menu!'}
                </p>
              </div>

              {/* Interactive Live Post Generator */}
              <div className="bg-emerald-50/80 border-2 border-emerald-500 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>{isUrdu ? 'پوسٹ کوڈ اور گوگل ڈرائیو جنریٹر (Live Post Generator)' : 'Interactive Post & Drive Embed Generator'}</span>
                    </span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      {isUrdu
                        ? 'یہاں کلاس اور مضمون منتخب کریں اور اپنی گوگل ڈرائیو کا لنک ڈالیں، مکمل پوسٹ کا کوڈ نیچے تیار ہو جائے گا:'
                        : 'Select class, subject, and paste your Google Drive link to generate the exact Blogger post HTML:'}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyGenPost}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    {copiedGenPost ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedGenPost ? (isUrdu ? 'کوڈ کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'پوسٹ کوڈ کاپی کریں' : 'Copy Post Code')}</span>
                  </button>
                </div>

                {/* Generator Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-emerald-200 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Class / جماعت:</label>
                    <select
                      value={genGrade}
                      onChange={(e) => setGenGrade(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-600"
                    >
                      <option value="9">Class 9 (نویں)</option>
                      <option value="10">Class 10 (دسویں)</option>
                      <option value="11">Class 11 (فرسٹ ایئر)</option>
                      <option value="12">Class 12 (سیکنڈ ایئر)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Category / قسم:</label>
                    <select
                      value={genType}
                      onChange={(e) => setGenType(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-600"
                    >
                      <option value="Notes">Notes (مکمل نوٹس)</option>
                      <option value="Scheme">Scheme (پیرنگ سکیم)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Subject / مضمون:</label>
                    <input
                      type="text"
                      value={genSubject}
                      onChange={(e) => setGenSubject(e.target.value)}
                      placeholder="e.g. Physics, Math"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Chapter / عنوان:</label>
                    <input
                      type="text"
                      value={genChapter}
                      onChange={(e) => setGenChapter(e.target.value)}
                      placeholder="e.g. Chapter 1"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Drive URL Input */}
                <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1.5 text-xs">
                  <label className="block text-slate-700 font-bold">
                    {isUrdu ? 'اپنی گوگل ڈرائیو کا شیئر لنک یہاں پیسٹ کریں:' : 'Paste your Google Drive PDF Share URL:'}
                  </label>
                  <input
                    type="text"
                    value={genDriveUrl}
                    onChange={(e) => setGenDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                {/* Crucial Instructions Banner */}
                <div className="bg-emerald-950 text-white p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-amber-300 uppercase tracking-wide block">
                      {isUrdu ? 'لازمی قدم: بلاگر میں دائیں طرف یہ لیبل لگائیں:' : 'REQUIRED: In Blogger right sidebar, type this exact Label:'}
                    </span>
                    <span className="text-slate-200 text-xs">
                      {isUrdu
                        ? `پوسٹ لکھتے وقت Labels میں لکھیں: `
                        : `When creating this post, under Labels write: `}
                      <code className="bg-emerald-800 text-amber-200 px-2 py-0.5 rounded font-bold font-mono text-xs">
                        {calculatedLabel}
                      </code>
                    </span>
                  </div>

                  <button
                    onClick={handleCopyGenPost}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-md shadow-xs cursor-pointer shrink-0"
                  >
                    {copiedGenPost ? 'کاپی ہو گیا!' : 'مکمل پوسٹ کوڈ کاپی کریں'}
                  </button>
                </div>

                {/* Generated Code Preview */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600 uppercase">
                    {isUrdu ? 'بلاگر پوسٹ کے لیے تیار HTML کوڈ:' : 'Generated Post HTML Preview:'}
                  </span>
                  <pre className="text-[11px] font-mono bg-slate-900 text-emerald-300 p-3 rounded-lg overflow-x-auto max-h-48 border border-slate-800">
                    <code>{generatedPostHtml}</code>
                  </pre>
                </div>
              </div>

              {/* Labels Mapping Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800">
                  {isUrdu ? 'لیبلز اور مینو لنکس کا جدول (Labels to Menu Connections)' : 'Menu Links to Labels Mapping'}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[500px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">پوسٹ کا موضوع / کلاس</th>
                        <th className="py-2.5 px-4 font-semibold">دائیں طرف Labels میں یہ لکھیں</th>
                        <th className="py-2.5 px-4 font-semibold">مینو میں کہاں نظر آئے گی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-4 font-medium text-slate-900">نویں کے نوٹس (Class 9)</td>
                        <td className="py-2 px-4"><code className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">Class 9 Notes</code></td>
                        <td className="py-2 px-4 text-slate-600">Notes ➔ Class 9 Notes</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-slate-900">دسویں کے نوٹس (Class 10)</td>
                        <td className="py-2 px-4"><code className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">Class 10 Notes</code></td>
                        <td className="py-2 px-4 text-slate-600">Notes ➔ Class 10 Notes</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-slate-900">سال اول (Class 11)</td>
                        <td className="py-2 px-4"><code className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">Class 11 Notes</code></td>
                        <td className="py-2 px-4 text-slate-600">Notes ➔ Class 11 Notes</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-slate-900">سال دوم (Class 12)</td>
                        <td className="py-2 px-4"><code className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">Class 12 Notes</code></td>
                        <td className="py-2 px-4 text-slate-600">Notes ➔ Class 12 Notes</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-slate-900">نویں کی پیرنگ سکیم</td>
                        <td className="py-2 px-4"><code className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold font-mono">Class 9 Scheme</code></td>
                        <td className="py-2 px-4 text-slate-600">Scheme ➔ Class 9 Scheme</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-slate-900">دسویں کی پیرنگ سکیم</td>
                        <td className="py-2 px-4"><code className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold font-mono">Class 10 Scheme</code></td>
                        <td className="py-2 px-4 text-slate-600">Scheme ➔ Class 10 Scheme</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-slate-900">11ویں کی پیرنگ سکیم</td>
                        <td className="py-2 px-4"><code className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold font-mono">Class 11 Scheme</code></td>
                        <td className="py-2 px-4 text-slate-600">Scheme ➔ Class 11 Scheme</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium text-slate-900">12ویں کی پیرنگ سکیم</td>
                        <td className="py-2 px-4"><code className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold font-mono">Class 12 Scheme</code></td>
                        <td className="py-2 px-4 text-slate-600">Scheme ➔ Class 12 Scheme</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4 Simple Steps */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">
                  {isUrdu ? 'پوسٹ پبلش کرنے کے 4 سادہ مراحل:' : '4 Simple Steps to Publish on Blogger:'}
                </h5>
                <ol className="text-xs text-slate-700 list-decimal list-inside space-y-1.5 leading-relaxed font-medium">
                  <li><strong>Blogger.com</strong> پر جائیں ➔ بائیں جانب <strong>"+ New Post"</strong> دبائیں۔</li>
                  <li>ٹائٹل کے نیچے بائیں جانب بنے پنسل (✏️) کے آئیکن پر کلک کر کے <strong>"HTML view"</strong> منتخب کریں۔</li>
                  <li>اوپر سے کاپی شدہ کوڈ پیسٹ کریں۔</li>
                  <li>دائیں جانب <strong>Labels</strong> پر کلک کر کے کلاس کا لیبل (جیسے <code>Class 9 Notes</code>) لکھیں اور <strong>Publish</strong> کا بٹن دبا دیں!</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="overflow-x-auto whitespace-pre p-2 text-[11px] leading-relaxed text-emerald-300">
                <code>{currentCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {isUrdu
              ? 'شامی اکیڈمی 100٪ موبائل اور کمپیوٹر رسپانسو تھیم'
              : 'Shami Academy 100% Mobile & Computer Responsive Theme'}
          </span>
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
