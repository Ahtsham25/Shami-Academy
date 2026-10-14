import React, { useState } from 'react';
import { GradeLevel, PairingScheme } from '../types';
import { GRADES, PAIRING_SCHEMES } from '../data/academicData';
import { BookCheck, CheckCircle2, AlertCircle, FileSpreadsheet, Sparkles, Printer } from 'lucide-react';

interface SchemesSectionProps {
  selectedGrade: GradeLevel;
  setSelectedGrade: (grade: GradeLevel) => void;
  isUrdu: boolean;
}

export const SchemesSection: React.FC<SchemesSectionProps> = ({
  selectedGrade,
  setSelectedGrade,
  isUrdu,
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    PAIRING_SCHEMES.find((s) => s.grade === selectedGrade)?.id || PAIRING_SCHEMES[0].id
  );

  // Filter schemes for the selected grade
  const schemesForGrade = PAIRING_SCHEMES.filter((s) => s.grade === selectedGrade);
  const activeScheme =
    PAIRING_SCHEMES.find((s) => s.id === selectedSchemeId) ||
    schemesForGrade[0] ||
    PAIRING_SCHEMES[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold text-emerald-700 tracking-wider uppercase mb-1">
            {isUrdu ? 'امتحانی تقسیم اور پیپر پیٹرن' : 'BOARD ASSESSMENT SCHEMES'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isUrdu ? (
              <span className="font-urdu">سالانہ بورڈ پیپر پیرنگ سکیم 2026</span>
            ) : (
              <span>Annual Board Exam Pairing Schemes 2026</span>
            )}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isUrdu
              ? 'کلاس 9، 10، 11 اور 12 کے لیے تمام پنجاب بورڈز اور فیڈرل بورڈ کی مستند امتحانی سکیم۔'
              : 'Authentic subject-wise chapter pairings, marks distributions, and long question combinations.'}
          </p>
        </div>

        {/* Grade Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto shrink-0">
          {GRADES.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setSelectedGrade(g.id);
                const nextScheme = PAIRING_SCHEMES.find((s) => s.grade === g.id);
                if (nextScheme) setSelectedSchemeId(nextScheme.id);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedGrade === g.id
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g.name} Scheme
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Detail Card */}
      {activeScheme ? (
        <div className="mt-8 space-y-8">
          {/* Main Overview Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-bold text-emerald-700 uppercase">Class {activeScheme.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeScheme.academicYear}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeScheme.boardGroup}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {activeScheme.subject} Pairing Scheme
                </h3>
                {isUrdu && (
                  <p className="text-xs text-emerald-800 font-urdu mt-0.5">
                    {activeScheme.subjectUrdu}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isUrdu ? 'پرنٹ کریں' : 'Print Scheme'}</span>
                </button>
              </div>
            </div>

            {/* Marks Distribution Row */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Total Marks</div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                  {activeScheme.totalMarks}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Passing Marks</div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1">
                  {activeScheme.passingMarks}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Objective (MCQs)</div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                  {activeScheme.objectiveMarks} Marks
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Subjective Marks</div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                  {activeScheme.subjectiveMarks} Marks
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-600 leading-relaxed">
              {activeScheme.summary}
            </p>
          </div>

          {/* Section 1: Objective MCQs Chapter Distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Part I: Objective Paper (MCQs Distribution — {activeScheme.objectiveMarks} Marks)</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Chapter / Unit</th>
                    <th className="py-2.5 px-4 text-center">Number of MCQs</th>
                    <th className="py-2.5 px-4 text-right">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeScheme.mcqDistribution.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-medium text-slate-800">{row.chapter}</td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-emerald-800 tabular-nums">
                        {row.mcqsCount} MCQ{row.mcqsCount > 1 ? 's' : ''}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                        {row.mcqsCount} × 1 = {row.mcqsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Short Questions Pairing Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Part II: Subjective Short Questions (Section I)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeScheme.shortQuestionsSections.map((sec, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{sec.title}</div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">{sec.description}</div>
                    <div className="mt-3 space-y-2 text-xs">
                      {sec.breakdown.map((b, bIdx) => (
                        <div key={bIdx} className="bg-white p-3 rounded-lg border border-slate-200/80">
                          <div className="font-semibold text-slate-800">{b.chapters}</div>
                          <div className="text-slate-500 mt-1 flex justify-between">
                            <span>Attempt: {b.choiceInfo}</span>
                            <span className="font-mono font-bold text-emerald-800">{b.marksDistribution}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200 text-right text-xs font-bold text-slate-700">
                    Total: {sec.marks} Marks
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Long Questions Pairing Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Part III: Extensive / Long Questions (Section II)</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {activeScheme.longQuestionsSection.rule}
            </p>
            <div className="space-y-3">
              {activeScheme.longQuestionsSection.pairs.map((pair, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    {pair.questionNumber}
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 mr-1.5">Part (a):</span>
                      <span className="text-slate-900 font-medium">{pair.partA}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 mr-1.5">Part (b):</span>
                      <span className="text-slate-900 font-medium">{pair.partB}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Advice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h4 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'شامی اکیڈمی اساتذہ کی اہم امتحانی ہدایات' : 'Shami Academy Expert Exam Strategy'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-800 list-disc list-inside">
              {activeScheme.preparationTips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
};
