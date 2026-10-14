import { NoteDetail, GradeLevel } from '../types';
import { FEATURED_NOTES } from '../data/academicData';

const STORAGE_KEY_NOTES = 'shami_academy_notes_v2';
const STORAGE_KEY_PIN = 'shami_admin_pin';

/**
 * Format any Google Drive URL into an embeddable preview URL
 * Handles sharing URLs, uc URLs, open URLs, and standard view URLs
 */
export function formatDriveEmbedUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Already preview
  if (trimmed.includes('/preview') || trimmed.includes('embedded=true')) return trimmed;

  // Pattern: /file/d/ID/view or /file/d/ID/edit
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
  }

  // Pattern: id=ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }

  // Docs, Sheets, Slides
  const docMatch = trimmed.match(/\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch && docMatch[1] && docMatch[2]) {
    return `https://docs.google.com/${docMatch[1]}/d/${docMatch[2]}/preview`;
  }

  // Direct PDF from GitHub, CDN, or Web: use Google Docs Viewer for 100% reliable embed
  if (trimmed.toLowerCase().endsWith('.pdf') || trimmed.includes('raw.githubusercontent.com') || trimmed.includes('cdn.jsdelivr.net')) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true`;
  }

  return trimmed;
}

/**
 * Get all notes from localStorage, with fallback to initial FEATURED_NOTES
 */
export function getStoredNotes(): NoteDetail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    let notes: NoteDetail[] = [];
    if (raw) {
      notes = JSON.parse(raw);
    } else {
      // Seed with default notes
      notes = [...FEATURED_NOTES];
      // Sync any individual legacy drive urls
      notes = notes.map((n) => {
        const legacyDrive = localStorage.getItem(`shami_gdrive_${n.id}`);
        if (legacyDrive) {
          return { ...n, googleDriveUrl: legacyDrive };
        }
        return n;
      });
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    }

    // Ensure all notes have valid IDs and drive urls check
    return notes.map((n) => {
      const perNoteDrive = localStorage.getItem(`shami_gdrive_${n.id}`);
      if (perNoteDrive && !n.googleDriveUrl) {
        return { ...n, googleDriveUrl: perNoteDrive };
      }
      return n;
    });
  } catch (err) {
    console.warn('Failed to load notes from localStorage, using fallback', err);
    return FEATURED_NOTES;
  }
}

/**
 * Save complete array of notes to localStorage
 */
export function saveAllNotes(notes: NoteDetail[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    // Also broadcast custom event for immediate reactive update across components
    window.dispatchEvent(new Event('shami_notes_updated'));
  } catch (err) {
    console.error('Failed to save notes to localStorage', err);
  }
}

/**
 * Save or update a single note
 */
export function saveOrUpdateNote(note: NoteDetail): void {
  const current = getStoredNotes();
  const index = current.findIndex((n) => n.id === note.id);
  let updated: NoteDetail[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = note;
  } else {
    updated = [note, ...current];
  }

  if (note.googleDriveUrl) {
    localStorage.setItem(`shami_gdrive_${note.id}`, note.googleDriveUrl);
  }

  saveAllNotes(updated);
}

/**
 * Delete a note by ID
 */
export function deleteNote(id: string): void {
  const current = getStoredNotes();
  const updated = current.filter((n) => n.id !== id);
  localStorage.removeItem(`shami_gdrive_${id}`);
  saveAllNotes(updated);
}

/**
 * Quick update drive URL for a specific note
 */
export function updateNoteDriveUrl(noteId: string, url: string): void {
  const current = getStoredNotes();
  const updated = current.map((n) => {
    if (n.id === noteId) {
      return { ...n, googleDriveUrl: url.trim() };
    }
    return n;
  });
  localStorage.setItem(`shami_gdrive_${noteId}`, url.trim());
  saveAllNotes(updated);
}

/**
 * Export all notes and settings as JSON
 */
export function exportDataAsJson(): string {
  const notes = getStoredNotes();
  const payload = {
    appName: 'Shami Academy Educational Portal',
    version: '2026.1',
    exportDate: new Date().toISOString(),
    notesCount: notes.length,
    notes,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Import notes from JSON string
 */
export function importDataFromJson(jsonStr: string): { success: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    const notesArray = Array.isArray(parsed) ? parsed : parsed.notes;
    if (!Array.isArray(notesArray) || notesArray.length === 0) {
      return { success: false, error: 'JSON میں درست نوٹس کا ڈیٹا موجود نہیں ہے۔' };
    }

    // Validate minimum required fields
    const validated: NoteDetail[] = notesArray.map((item, idx) => ({
      id: item.id || `custom-note-${Date.now()}-${idx}`,
      grade: (['9th', '10th', '11th', '12th'].includes(item.grade) ? item.grade : '9th') as GradeLevel,
      subjectId: item.subjectId || `${item.grade || '9th'}-gen`,
      subjectName: item.subjectName || 'General Subject',
      subjectNameUrdu: item.subjectNameUrdu || 'مضمون',
      chapterNumber: Number(item.chapterNumber) || 1,
      chapterTitle: item.chapterTitle || 'Chapter',
      chapterTitleUrdu: item.chapterTitleUrdu || 'باب',
      totalMarks: Number(item.totalMarks) || 60,
      pages: Number(item.pages) || 10,
      fileSize: item.fileSize || '2.5 MB',
      downloadCount: Number(item.downloadCount) || 100,
      updatedDate: item.updatedDate || '2026 Edition',
      summary: item.summary || '',
      keyFormulas: Array.isArray(item.keyFormulas) ? item.keyFormulas : [],
      keyDefinitions: Array.isArray(item.keyDefinitions) ? item.keyDefinitions : [],
      solvedQuestions: Array.isArray(item.solvedQuestions) ? item.solvedQuestions : [],
      mcqs: Array.isArray(item.mcqs) ? item.mcqs : [],
      googleDriveUrl: item.googleDriveUrl || '',
    }));

    saveAllNotes(validated);
    return { success: true, count: validated.length };
  } catch (err: any) {
    return { success: false, error: err?.message || 'خراب JSON فائل' };
  }
}

/**
 * Reset all notes to factory defaults
 */
export function resetToDefaultData(): void {
  saveAllNotes([...FEATURED_NOTES]);
}

/**
 * Generate 100% valid Blogger Post HTML containing Google Drive viewer
 */
export function generateBloggerPostHtml(note: NoteDetail, driveUrl?: string): string {
  const activeDriveUrl = driveUrl || note.googleDriveUrl || 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview';
  const embedUrl = formatDriveEmbedUrl(activeDriveUrl);
  const gradeLabel = `Class ${note.grade.replace('th', '')} Notes`;

  return `<!-- Shami Academy Official Blogger Post -->
<div style="font-family:'Segoe UI',Roboto,Helvetica,sans-serif;max-width:850px;margin:0 auto;color:#1e293b;line-height:1.7;">
  <div style="background:linear-gradient(135deg,#064e3b,#047857);color:#ffffff;padding:25px 20px;border-radius:14px;margin-bottom:25px;text-align:center;box-shadow:0 4px 15px rgba(6,78,59,0.15);">
    <span style="background:#10b981;color:#ffffff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;display:inline-block;margin-bottom:8px;">
      Shami Academy · 2026 Edition
    </span>
    <h2 style="font-size:24px;font-weight:800;margin:5px 0 8px 0;color:#ffffff;">
      ${note.subjectName} - Chapter ${note.chapterNumber}: ${note.chapterTitle}
    </h2>
    <p style="font-size:17px;color:#a7f3d0;margin:0;font-family:'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',sans-serif;direction:rtl;">
      ${note.subjectNameUrdu} - باب نمبر ${note.chapterNumber}: ${note.chapterTitleUrdu} (کلاس ${note.grade.replace('th', '')})
    </p>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin-bottom:25px;">
    <h3 style="font-size:16px;font-weight:700;color:#0f172a;margin-top:0;margin-bottom:8px;border-bottom:2px solid #10b981;padding-bottom:5px;display:inline-block;">
      📋 Chapter Overview & Summary:
    </h3>
    <p style="font-size:14px;color:#475569;margin:0;">
      ${note.summary || 'Detailed conceptual notes, solved questions, formulas, and past paper MCQs for board exam preparation.'}
    </p>
  </div>

  <!-- Google Drive Interactive PDF Viewer -->
  <div style="background:#ffffff;border:2px solid #cbd5e1;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.06);margin-bottom:25px;">
    <div style="background:#0f172a;color:#ffffff;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
      <span style="font-weight:700;font-size:14px;display:flex;align-items:center;">
        📄 Live PDF Document Reader
      </span>
      <a href="${activeDriveUrl}" target="_blank" rel="noopener noreferrer" style="background:#10b981;color:#ffffff;text-decoration:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:700;display:inline-block;">
        ↗ Full Screen View
      </a>
    </div>
    
    <div style="position:relative;width:100%;height:680px;background:#f1f5f9;">
      <iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="autoplay" loading="lazy"></iframe>
    </div>
  </div>

  <!-- Download & Action Buttons -->
  <div style="text-align:center;margin:30px 0;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="${activeDriveUrl}" target="_blank" rel="noopener noreferrer" style="background:#047857;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:8px;box-shadow:0 4px 12px rgba(4,120,87,0.3);display:inline-block;">
      📥 Download PDF Notes (Direct Drive Link)
    </a>
  </div>

  <div style="border-top:1px dashed #cbd5e1;padding-top:15px;text-align:center;font-size:12px;color:#64748b;">
    Published via <strong>Shami Academy Official Educational Portal</strong> · Labels: <code>${gradeLabel}</code>, <code>${note.subjectName}</code>
  </div>
</div>`;
}

/**
 * Fetch and sync notes from static /data/notes.json if localStorage is empty or on demand
 */
export async function syncNotesFromStaticJson(force = false): Promise<NoteDetail[] | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (raw && !force) {
      return null;
    }
    const res = await fetch('./data/notes.json?_t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.notes;
      if (Array.isArray(list) && list.length > 0) {
        saveAllNotes(list);
        return list;
      }
    }
  } catch (err) {
    console.warn('Could not fetch static notes.json', err);
  }
  return null;
}

