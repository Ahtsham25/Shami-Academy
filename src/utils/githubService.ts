import { NoteDetail } from '../types';
import { saveAllNotes, getStoredNotes } from './notesStorage';

export interface GitHubConfig {
  owner: string; // e.g. "princeshami365"
  repo: string; // e.g. "shami-academy"
  branch: string; // e.g. "main"
  token: string; // Personal Access Token: "ghp_..." or "github_pat_..."
  dataPath: string; // e.g. "public/data/notes.json"
  uploadsFolder: string; // e.g. "public/uploads"
  autoSync: boolean; // Auto push when notes change
  customDomain?: string; // Optional custom domain e.g. "notes.shamiacademy.com"
}

const STORAGE_KEY_GITHUB_CONFIG = 'shami_github_backend_config';
const STORAGE_KEY_UPLOADED_FILES = 'shami_github_uploaded_files_cache';

export interface UploadedFileRecord {
  name: string;
  size: number;
  type: string;
  path: string;
  rawUrl: string;
  cdnUrl: string;
  pagesUrl: string;
  uploadedAt: string;
  sha?: string;
}

export function getDefaultGitHubConfig(): GitHubConfig {
  return {
    owner: '',
    repo: 'shami-academy-portal',
    branch: 'main',
    token: '',
    dataPath: 'public/data/notes.json',
    uploadsFolder: 'public/uploads',
    autoSync: false,
    customDomain: '',
  };
}

export function getGitHubConfig(): GitHubConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GITHUB_CONFIG);
    if (raw) {
      return { ...getDefaultGitHubConfig(), ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Error reading github config from localStorage', err);
  }
  return getDefaultGitHubConfig();
}

export function saveGitHubConfig(config: GitHubConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_GITHUB_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new Event('shami_github_config_updated'));
  } catch (err) {
    console.error('Error saving github config', err);
  }
}

export function getLocalUploadedFiles(): UploadedFileRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UPLOADED_FILES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading uploaded files cache', err);
  }
  return [];
}

export function saveLocalUploadedFile(fileRecord: UploadedFileRecord): void {
  const existing = getLocalUploadedFiles();
  const filtered = existing.filter((f) => f.path !== fileRecord.path);
  const updated = [fileRecord, ...filtered];
  try {
    localStorage.setItem(STORAGE_KEY_UPLOADED_FILES, JSON.stringify(updated.slice(0, 50)));
  } catch (err) {
    console.warn('Error caching uploaded file record', err);
  }
}

/**
 * Clean & encode UTF-8 string to base64 properly across Unicode / Urdu characters
 */
function toBase64Unicode(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(_match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

/**
 * Decode base64 to Unicode string
 */
function fromBase64Unicode(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Convert File object to raw base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove prefix like "data:application/pdf;base64,"
      const base64 = result.substring(result.indexOf(',') + 1);
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Test connection to GitHub repository
 */
export async function testGitHubConnection(config: GitHubConfig): Promise<{
  success: boolean;
  message: string;
  repoDetails?: {
    full_name: string;
    description: string;
    private: boolean;
    default_branch: string;
    has_pages: boolean;
  };
}> {
  if (!config.owner.trim()) {
    return { success: false, message: 'GitHub صارف نام (Username / Owner) درج کریں' };
  }
  if (!config.repo.trim()) {
    return { success: false, message: 'ریپوزٹری کا نام (Repository Name) درج کریں' };
  }
  if (!config.token.trim()) {
    return { success: false, message: 'GitHub Personal Access Token (PAT) درج کریں' };
  }

  const url = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (res.status === 401) {
      return { success: false, message: 'ٹوکن غلط ہے یا منسوخ ہو چکا ہے۔ نیا Personal Access Token بنائیں۔' };
    }
    if (res.status === 404) {
      return {
        success: false,
        message: `ریپوزٹری '${config.owner}/${config.repo}' نہیں ملی۔ چیک کریں کہ کیا ریپو بنی ہوئی ہے اور ٹوکن میں 'repo' پرمیشن موجود ہے۔`,
      };
    }
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData.message || `خرابی کا کوڈ: ${res.status}` };
    }

    const data = await res.json();
    return {
      success: true,
      message: `کامیابی سے کنکشن قائم ہو گیا! ریپو: ${data.full_name}`,
      repoDetails: {
        full_name: data.full_name,
        description: data.description || '',
        private: data.private,
        default_branch: data.default_branch,
        has_pages: data.has_pages || false,
      },
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'نیٹ ورک کی خرابی یا انٹرنیٹ کنکشن کا مسئلہ' };
  }
}

/**
 * Fetch SHA of existing file on GitHub (if it exists)
 */
async function getFileSha(config: GitHubConfig, path: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/contents/${path}?ref=${config.branch.trim()}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha || null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Push all Notes into GitHub repository as JSON database
 */
export async function pushNotesToGitHub(
  config: GitHubConfig,
  notesToPush?: NoteDetail[],
  customCommitMsg?: string
): Promise<{ success: boolean; message: string; commitUrl?: string }> {
  const notes = notesToPush || getStoredNotes();
  const test = await testGitHubConnection(config);
  if (!test.success) {
    return { success: false, message: test.message };
  }

  const path = config.dataPath.trim() || 'public/data/notes.json';
  const sha = await getFileSha(config, path);

  const payloadData = {
    appName: 'Shami Academy Educational Portal',
    version: '2026.1',
    lastSync: new Date().toISOString(),
    notesCount: notes.length,
    notes,
  };

  const jsonString = JSON.stringify(payloadData, null, 2);
  const base64Content = toBase64Unicode(jsonString);

  const commitMessage =
    customCommitMsg ||
    `Update notes database (${notes.length} notes) via Shami Admin Panel [${new Date().toLocaleDateString()}]`;

  const url = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/contents/${path}`;

  try {
    const body: Record<string, any> = {
      message: commitMessage,
      content: base64Content,
      branch: config.branch.trim() || 'main',
    };
    if (sha) {
      body.sha = sha;
    }

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.token.trim()}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || `GitHub کمٹ میں خرابی (${res.status})` };
    }

    const resData = await res.json();
    return {
      success: true,
      message: `تمام ${notes.length} نوٹس گٹ ہب ریپوزٹری میں کامیابی سے کمٹ اور اپلوڈ ہو گئے!`,
      commitUrl: resData.commit?.html_url,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'گٹ ہب پر ڈیٹا پش کرتے وقت خرابی' };
  }
}

/**
 * Pull latest Notes from GitHub repository
 */
export async function pullNotesFromGitHub(
  config: GitHubConfig
): Promise<{ success: boolean; message: string; count?: number }> {
  if (!config.owner.trim() || !config.repo.trim()) {
    return { success: false, message: 'GitHub صارف نام اور ریپوزٹری کا نام سیٹ کریں' };
  }

  const path = config.dataPath.trim() || 'public/data/notes.json';
  const branch = config.branch.trim() || 'main';

  // Attempt using raw URL with timestamp for fresh data, or API with auth
  let jsonString = '';

  try {
    if (config.token.trim()) {
      const apiUrl = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/contents/${path}?ref=${branch}&_t=${Date.now()}`;
      const res = await fetch(apiUrl, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${config.token.trim()}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (res.ok) {
        const fileData = await res.json();
        if (fileData.content) {
          jsonString = fromBase64Unicode(fileData.content);
        }
      }
    }

    if (!jsonString) {
      // Fallback to raw user content
      const rawUrl = `https://raw.githubusercontent.com/${config.owner.trim()}/${config.repo.trim()}/${branch}/${path}?_t=${Date.now()}`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        jsonString = await res.text();
      } else {
        // Try local static fallback
        const localRes = await fetch(`/data/notes.json?_t=${Date.now()}`);
        if (localRes.ok) {
          jsonString = await localRes.text();
        }
      }
    }

    if (!jsonString) {
      return {
        success: false,
        message: `گٹ ہب پر '${path}' فائل ابھی نہیں ملی۔ پہلے اوپر دیے گئے بٹن 'Push to GitHub' سے ڈیٹا اپلوڈ کریں۔`,
      };
    }

    const parsed = JSON.parse(jsonString);
    const notesArray = Array.isArray(parsed) ? parsed : parsed.notes;

    if (!Array.isArray(notesArray) || notesArray.length === 0) {
      return { success: false, message: 'فائل میں نوٹس کا ڈیٹا خالی یا نامکمل ہے۔' };
    }

    saveAllNotes(notesArray);
    return {
      success: true,
      message: `گٹ ہب سے کامیابی سے ${notesArray.length} نوٹس ڈاؤنلوڈ اور سنک ہو گئے!`,
      count: notesArray.length,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'گٹ ہب سے ڈیٹا ڈاؤنلوڈ کرنے میں خرابی' };
  }
}

/**
 * Upload any File (PDF, Image, DOCX) directly to GitHub repository
 */
export async function uploadFileToGitHub(
  config: GitHubConfig,
  file: File,
  customFolder?: string,
  onProgress?: (percent: number) => void
): Promise<{
  success: boolean;
  message: string;
  fileRecord?: UploadedFileRecord;
}> {
  const test = await testGitHubConnection(config);
  if (!test.success) {
    return { success: false, message: test.message };
  }

  onProgress?.(20);

  // Clean filename: alphanumeric and hyphens/underscores
  const extension = file.name.split('.').pop() || 'pdf';
  const rawBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'file';
  const cleanBaseName = rawBaseName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  const timestamp = Date.now().toString().slice(-6);
  const targetFileName = `${cleanBaseName}-${timestamp}.${extension}`;

  const folder = (customFolder || config.uploadsFolder || 'public/uploads')
    .replace(/^\/+|\/+$/g, '');
  const fullPath = `${folder}/${targetFileName}`;

  onProgress?.(40);

  try {
    const base64Data = await fileToBase64(file);
    onProgress?.(60);

    const sha = await getFileSha(config, fullPath);

    const url = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/contents/${fullPath}`;
    const branch = config.branch.trim() || 'main';

    const commitMessage = `Upload academic file: ${file.name} (${(file.size / 1024).toFixed(1)} KB) via Shami Admin`;

    const body: Record<string, any> = {
      message: commitMessage,
      content: base64Data,
      branch,
    };
    if (sha) {
      body.sha = sha;
    }

    onProgress?.(80);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.token.trim()}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || `اپلوڈ میں خرابی (${res.status})` };
    }

    const data = await res.json();
    onProgress?.(100);

    const rawUrl = `https://raw.githubusercontent.com/${config.owner.trim()}/${config.repo.trim()}/${branch}/${fullPath}`;
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${config.owner.trim()}/${config.repo.trim()}@${branch}/${fullPath}`;
    
    // GitHub Pages standard url path
    const pagesSubPath = fullPath.startsWith('public/') ? fullPath.replace(/^public\//, '') : fullPath;
    const pagesUrl = config.customDomain
      ? `https://${config.customDomain.replace(/^https?:\/\//, '')}/${pagesSubPath}`
      : `https://${config.owner.trim()}.github.io/${config.repo.trim()}/${pagesSubPath}`;

    const record: UploadedFileRecord = {
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      path: fullPath,
      rawUrl,
      cdnUrl,
      pagesUrl,
      uploadedAt: new Date().toISOString(),
      sha: data.content?.sha,
    };

    saveLocalUploadedFile(record);

    return {
      success: true,
      message: `فائل '${file.name}' گٹ ہب ریپو میں کامیابی سے اپلوڈ ہو گئی!`,
      fileRecord: record,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'فائل اپلوڈ کرنے کے دوران تکنیکی خرابی' };
  }
}

/**
 * List files in GitHub uploads directory
 */
export async function listGitHubFiles(
  config: GitHubConfig
): Promise<{ success: boolean; files: UploadedFileRecord[]; message?: string }> {
  if (!config.owner.trim() || !config.repo.trim()) {
    return { success: false, files: getLocalUploadedFiles(), message: 'GitHub ریپو کنفیگر نہیں ہے' };
  }

  const folder = (config.uploadsFolder || 'public/uploads').replace(/^\/+|\/+$/g, '');
  const branch = config.branch.trim() || 'main';
  const url = `https://api.github.com/repos/${config.owner.trim()}/${config.repo.trim()}/contents/${folder}?ref=${branch}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(config.token ? { Authorization: `Bearer ${config.token.trim()}` } : {}),
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!res.ok) {
      return { success: false, files: getLocalUploadedFiles(), message: 'کوئی آن لائن فائلیں نہیں ملیں' };
    }

    const items = await res.json();
    if (!Array.isArray(items)) {
      return { success: true, files: getLocalUploadedFiles() };
    }

    const remoteFiles: UploadedFileRecord[] = items
      .filter((item) => item.type === 'file')
      .map((item) => {
        const fullPath = item.path;
        const pagesSubPath = fullPath.startsWith('public/') ? fullPath.replace(/^public\//, '') : fullPath;
        const pagesUrl = config.customDomain
          ? `https://${config.customDomain.replace(/^https?:\/\//, '')}/${pagesSubPath}`
          : `https://${config.owner.trim()}.github.io/${config.repo.trim()}/${pagesSubPath}`;

        return {
          name: item.name,
          size: item.size || 0,
          type: item.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
          path: item.path,
          rawUrl: item.download_url || `https://raw.githubusercontent.com/${config.owner.trim()}/${config.repo.trim()}/${branch}/${item.path}`,
          cdnUrl: `https://cdn.jsdelivr.net/gh/${config.owner.trim()}/${config.repo.trim()}@${branch}/${item.path}`,
          pagesUrl,
          uploadedAt: new Date().toISOString(),
          sha: item.sha,
        };
      });

    // Merge with local records
    const local = getLocalUploadedFiles();
    const mergedMap = new Map<string, UploadedFileRecord>();
    remoteFiles.forEach((f) => mergedMap.set(f.path, f));
    local.forEach((f) => {
      if (!mergedMap.has(f.path)) mergedMap.set(f.path, f);
    });

    return { success: true, files: Array.from(mergedMap.values()) };
  } catch (err: any) {
    return { success: false, files: getLocalUploadedFiles(), message: err.message };
  }
}
