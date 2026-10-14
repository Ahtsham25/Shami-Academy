export type GradeLevel = '9th' | '10th' | '11th' | '12th';

export type SubjectCategory = 'Science' | 'Arts' | 'Compulsory';

export interface SubjectItem {
  id: string;
  name: string;
  nameUrdu: string;
  code: string;
  grade: GradeLevel;
  iconName: string;
  chaptersCount: number;
  totalNotes: number;
}

export interface SolvedQuestion {
  questionNumber: string;
  question: string;
  questionUrdu?: string;
  answer: string;
  importance: 'Very Important' | 'Important' | 'Past Paper Repeated';
}

export interface MCQItem {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface NoteDetail {
  id: string;
  grade: GradeLevel;
  subjectId: string;
  subjectName: string;
  subjectNameUrdu: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleUrdu: string;
  totalMarks: number;
  pages: number;
  fileSize: string;
  downloadCount: number;
  updatedDate: string;
  summary: string;
  keyFormulas?: string[];
  keyDefinitions: { term: string; definition: string }[];
  solvedQuestions: SolvedQuestion[];
  mcqs: MCQItem[];
  googleDriveUrl?: string;
  customHtmlEmbed?: string;
}

export interface PairingSchemeSection {
  title: string;
  marks: number;
  description: string;
  breakdown: {
    questionLabel: string;
    chapters: string;
    choiceInfo: string;
    marksDistribution: string;
  }[];
}

export interface PairingScheme {
  id: string;
  grade: GradeLevel;
  subject: string;
  subjectUrdu: string;
  academicYear: string;
  boardGroup: string;
  totalMarks: number;
  passingMarks: number;
  objectiveMarks: number;
  subjectiveMarks: number;
  summary: string;
  mcqDistribution: { chapter: string; mcqsCount: number }[];
  shortQuestionsSections: PairingSchemeSection[];
  longQuestionsSection: {
    rule: string;
    pairs: {
      questionNumber: string;
      partA: string;
      partB: string;
    }[];
  };
  preparationTips: string[];
}

export type ActiveView = 
  | 'home'
  | 'notes'
  | 'schemes'
  | 'reader'
  | 'privacy'
  | 'disclaimer'
  | 'about'
  | 'contact'
  | 'terms'
  | 'blogger-code'
  | 'admin';
