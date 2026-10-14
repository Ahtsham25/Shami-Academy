import { GradeLevel, SubjectItem, NoteDetail, PairingScheme } from '../types';

export const GRADES: { id: GradeLevel; name: string; nameUrdu: string; subtitle: string }[] = [
  { id: '9th', name: 'Class 9', nameUrdu: 'نویں جماعت', subtitle: 'Matric Part 1 Notes & Pairing Scheme' },
  { id: '10th', name: 'Class 10', nameUrdu: 'دسویں جماعت', subtitle: 'Matric Part 2 Notes & Pairing Scheme' },
  { id: '11th', name: 'Class 11', nameUrdu: 'گیارہویں جماعت', subtitle: '1st Year FSc / ICS / FA Notes & Schemes' },
  { id: '12th', name: 'Class 12', nameUrdu: 'بارہویں جماعت', subtitle: '2nd Year FSc / ICS / FA Notes & Schemes' },
];

export const SUBJECTS: SubjectItem[] = [
  // Class 9
  { id: '9-phy', name: 'Physics', nameUrdu: 'طبیعیات', code: 'PHY-9', grade: '9th', iconName: 'Atom', chaptersCount: 9, totalNotes: 18 },
  { id: '9-chem', name: 'Chemistry', nameUrdu: 'کیمسٹری', code: 'CHM-9', grade: '9th', iconName: 'FlaskConical', chaptersCount: 8, totalNotes: 16 },
  { id: '9-bio', name: 'Biology', nameUrdu: 'حیاتیات', code: 'BIO-9', grade: '9th', iconName: 'Dna', chaptersCount: 9, totalNotes: 18 },
  { id: '9-math', name: 'Mathematics', nameUrdu: 'ریاضی', code: 'MTH-9', grade: '9th', iconName: 'Calculator', chaptersCount: 17, totalNotes: 34 },
  { id: '9-cs', name: 'Computer Science', nameUrdu: 'کمپیوٹر سائنس', code: 'CS-9', grade: '9th', iconName: 'Laptop', chaptersCount: 5, totalNotes: 10 },
  { id: '9-eng', name: 'English', nameUrdu: 'انگریزی', code: 'ENG-9', grade: '9th', iconName: 'BookOpen', chaptersCount: 12, totalNotes: 24 },
  { id: '9-urd', name: 'Urdu', nameUrdu: 'اردو', code: 'URD-9', grade: '9th', iconName: 'Feather', chaptersCount: 14, totalNotes: 28 },
  { id: '9-isl', name: 'Islamiat', nameUrdu: 'اسلامیات لازمی', code: 'ISL-9', grade: '9th', iconName: 'Moon', chaptersCount: 6, totalNotes: 12 },

  // Class 10
  { id: '10-phy', name: 'Physics', nameUrdu: 'طبیعیات', code: 'PHY-10', grade: '10th', iconName: 'Atom', chaptersCount: 9, totalNotes: 18 },
  { id: '10-chem', name: 'Chemistry', nameUrdu: 'کیمسٹری', code: 'CHM-10', grade: '10th', iconName: 'FlaskConical', chaptersCount: 8, totalNotes: 16 },
  { id: '10-bio', name: 'Biology', nameUrdu: 'حیاتیات', code: 'BIO-10', grade: '10th', iconName: 'Dna', chaptersCount: 9, totalNotes: 18 },
  { id: '10-math', name: 'Mathematics', nameUrdu: 'ریاضی', code: 'MTH-10', grade: '10th', iconName: 'Calculator', chaptersCount: 13, totalNotes: 26 },
  { id: '10-cs', name: 'Computer Science', nameUrdu: 'کمپیوٹر سائنس', code: 'CS-10', grade: '10th', iconName: 'Laptop', chaptersCount: 5, totalNotes: 10 },
  { id: '10-eng', name: 'English', nameUrdu: 'انگریزی', code: 'ENG-10', grade: '10th', iconName: 'BookOpen', chaptersCount: 13, totalNotes: 26 },
  { id: '10-pak', name: 'Pak Studies', nameUrdu: 'مطالعہ پاکستان', code: 'PAK-10', grade: '10th', iconName: 'Globe', chaptersCount: 4, totalNotes: 8 },

  // Class 11 (1st Year)
  { id: '11-phy', name: 'Physics', nameUrdu: 'طبیعیات (سال اول)', code: 'PHY-11', grade: '11th', iconName: 'Atom', chaptersCount: 11, totalNotes: 22 },
  { id: '11-chem', name: 'Chemistry', nameUrdu: 'کیمسٹری (سال اول)', code: 'CHM-11', grade: '11th', iconName: 'FlaskConical', chaptersCount: 11, totalNotes: 22 },
  { id: '11-bio', name: 'Biology', nameUrdu: 'حیاتیات (سال اول)', code: 'BIO-11', grade: '11th', iconName: 'Dna', chaptersCount: 14, totalNotes: 28 },
  { id: '11-math', name: 'Mathematics', nameUrdu: 'ریاضی (سال اول)', code: 'MTH-11', grade: '11th', iconName: 'Calculator', chaptersCount: 14, totalNotes: 28 },
  { id: '11-cs', name: 'Computer Science', nameUrdu: 'کمپیوٹر (سال اول)', code: 'CS-11', grade: '11th', iconName: 'Laptop', chaptersCount: 10, totalNotes: 20 },
  { id: '11-eng', name: 'English', nameUrdu: 'انگریزی (سال اول)', code: 'ENG-11', grade: '11th', iconName: 'BookOpen', chaptersCount: 15, totalNotes: 30 },

  // Class 12 (2nd Year)
  { id: '12-phy', name: 'Physics', nameUrdu: 'طبیعیات (سال دوم)', code: 'PHY-12', grade: '12th', iconName: 'Atom', chaptersCount: 10, totalNotes: 20 },
  { id: '12-chem', name: 'Chemistry', nameUrdu: 'کیمسٹری (سال دوم)', code: 'CHM-12', grade: '12th', iconName: 'FlaskConical', chaptersCount: 16, totalNotes: 32 },
  { id: '12-bio', name: 'Biology', nameUrdu: 'حیاتیات (سال دوم)', code: 'BIO-12', grade: '12th', iconName: 'Dna', chaptersCount: 13, totalNotes: 26 },
  { id: '12-math', name: 'Mathematics', nameUrdu: 'ریاضی (سال دوم)', code: 'MTH-12', grade: '12th', iconName: 'Calculator', chaptersCount: 7, totalNotes: 14 },
  { id: '12-pak', name: 'Pak Studies', nameUrdu: 'مطالعہ پاکستان', code: 'PAK-12', grade: '12th', iconName: 'Globe', chaptersCount: 5, totalNotes: 10 },
];

export const FEATURED_NOTES: NoteDetail[] = [
  {
    id: 'note-9-phy-ch1',
    grade: '9th',
    subjectId: '9-phy',
    subjectName: 'Physics',
    subjectNameUrdu: 'طبیعیات',
    chapterNumber: 1,
    chapterTitle: 'Physical Quantities & Measurement',
    chapterTitleUrdu: 'طبعی مقداریں اور پیمائش',
    totalMarks: 60,
    pages: 14,
    fileSize: '3.4 MB',
    downloadCount: 14280,
    updatedDate: 'Latest 2026 Edition',
    summary: 'Comprehensive notes covering base & derived quantities, international system of units (SI), scientific notation, prefixes, vernier calipers, screw gauge, and measuring cylinder with zero error corrections.',
    keyFormulas: [
      'Least Count of Vernier Calipers = 1 MSD - 1 VSD = 0.1 mm or 0.01 cm',
      'Least Count of Screw Gauge = Pitch / Total Head Divisions = 0.5 mm / 50 = 0.01 mm',
      'Density (ρ) = Mass (m) / Volume (V)',
    ],
    keyDefinitions: [
      {
        term: 'Base Quantities',
        definition: 'The fundamental physical quantities which form the foundation for other quantities (e.g., Length, Mass, Time, Electric Current, Temperature, Intensity of Light, Amount of Substance).'
      },
      {
        term: 'Derived Quantities',
        definition: 'Quantities expressed in terms of base quantities (e.g., Velocity, Acceleration, Force, Momentum, Work, Power).'
      },
      {
        term: 'Significant Figures',
        definition: 'All the accurately known digits and the first doubtful digit in any physical measurement.'
      }
    ],
    solvedQuestions: [
      {
        questionNumber: 'Q 1.2',
        question: 'What is the role of SI units in the development of modern science?',
        questionUrdu: 'جدید سائنس کی ترقی میں ایس آئی (SI) یونٹس کا کیا کردار ہے؟',
        answer: 'With the development in the field of science and technology, the need for a universally accepted system of units was seriously felt, particularly to exchange scientific and technical information. The 11th General Conference on Weights and Measures in Paris (1960) adopted a world-wide system called System International d’Unités (SI), which provided standard benchmarks across all nations.',
        importance: 'Very Important'
      },
      {
        questionNumber: 'Q 1.5',
        question: 'Estimate your age in seconds.',
        questionUrdu: 'اپنی عمر سیکنڈز میں شمار کریں۔',
        answer: 'Let age = 15 years. Age in days = 15 × 365 = 5475 days (plus leap days ≈ 3.75 days = 5478.75). Age in hours = 5478.75 × 24 = 131,490 hrs. Age in seconds = 131,490 × 3600 = 4.73 × 10⁸ seconds.',
        importance: 'Past Paper Repeated'
      },
      {
        questionNumber: 'Q 1.8',
        question: 'What do you understand by the zero error of a measuring instrument?',
        questionUrdu: 'پیمائشی آلے کی زیرو ایرر سے کیا مراد ہے؟',
        answer: 'If the zero mark of the vernier scale does not coincide with the zero mark of the main scale when jaws are closed, the instrument has a Zero Error. If vernier zero is to the right, it is Positive (+), and must be subtracted. If to the left, it is Negative (-), and must be added to the final reading.',
        importance: 'Very Important'
      }
    ],
    mcqs: [
      {
        id: 1,
        question: 'Which one of the following is NOT a base quantity?',
        options: ['Mass', 'Electric Current', 'Speed', 'Temperature'],
        correctIndex: 2,
        explanation: 'Speed is a derived quantity (Distance/Time) measured in m/s.'
      },
      {
        id: 2,
        question: 'The least count of standard Vernier Calipers is:',
        options: ['0.1 mm', '0.01 mm', '1 mm', '0.001 mm'],
        correctIndex: 0,
        explanation: 'Standard Vernier Caliper least count is 0.1 mm (or 0.01 cm).'
      },
      {
        id: 3,
        question: 'How many significant figures are in 0.00580 kg?',
        options: ['6', '5', '3', '2'],
        correctIndex: 2,
        explanation: 'Leading zeros are not significant; non-zero digits 5, 8 and trailing zero 0 are significant, giving 3.'
      }
    ]
  },
  {
    id: 'note-9-chem-ch1',
    grade: '9th',
    subjectId: '9-chem',
    subjectName: 'Chemistry',
    subjectNameUrdu: 'کیمسٹری',
    chapterNumber: 1,
    chapterTitle: 'Fundamentals of Chemistry',
    chapterTitleUrdu: 'کیمسٹری کے بنیادی اصول',
    totalMarks: 60,
    pages: 18,
    fileSize: '4.1 MB',
    downloadCount: 16900,
    updatedDate: 'Latest 2026 Edition',
    summary: 'Essential concepts of matter, elements, compounds, mixtures, atomic mass, molecular mass, formula mass, Avogadro’s number, mole calculations, and chemical formulas.',
    keyFormulas: [
      'Number of Moles (n) = Known Mass (m) / Molar Mass (M)',
      'Number of Particles (N) = Number of Moles (n) × Avogadro’s Number (NA = 6.022 × 10²³)',
      'Percentage Composition = (Mass of element in 1 mole / Molar mass of compound) × 100',
    ],
    keyDefinitions: [
      {
        term: 'Mole',
        definition: 'The atomic mass, molecular mass, or formula mass of a substance expressed in grams is called mole (gram atomic/molecular/formula mass).'
      },
      {
        term: 'Empirical Formula',
        definition: 'The simplest whole number ratio of atoms of each element present in a compound.'
      },
      {
        term: 'Molecular Formula',
        definition: 'The chemical formula that gives the actual whole number of atoms of each element in a molecule: Molecular Formula = n × Empirical Formula.'
      }
    ],
    solvedQuestions: [
      {
        questionNumber: 'Q 1.4',
        question: 'Differentiate between Compound and Mixture with at least four points.',
        questionUrdu: 'کمپاؤنڈ اور مکسچر میں کم از کم چار واضح فرق بیان کریں۔',
        answer: '1. Compound is formed by chemical combination of atoms; Mixture is formed by simple physical mixing.\n2. In compound, elements lose their properties; In mixture, components retain their properties.\n3. Compound has fixed composition by mass; Mixture has variable composition.\n4. Compound cannot be separated by physical means; Mixture components can be separated by filtration, distillation, magnet, etc.',
        importance: 'Very Important'
      },
      {
        questionNumber: 'Q 1.7',
        question: 'Calculate the number of molecules present in 9.0 g of water (H₂O).',
        questionUrdu: '9.0 گرام پانی (H₂O) میں موجود مالیکیولز کی تعداد معلوم کریں۔',
        answer: 'Molar mass of H₂O = (2×1) + 16 = 18 g/mol.\nNumber of moles = Mass / Molar mass = 9.0 / 18 = 0.5 moles.\nNumber of molecules = Moles × NA = 0.5 × 6.022 × 10²³ = 3.011 × 10²³ molecules.',
        importance: 'Very Important'
      }
    ],
    mcqs: [
      {
        id: 1,
        question: 'The number of particles in one mole of any pure substance is:',
        options: ['6.022 × 10²²', '6.022 × 10²³', '3.011 × 10²³', '1.66 × 10⁻²⁴'],
        correctIndex: 1,
        explanation: 'Avogadro’s number is precisely 6.022 × 10²³.'
      },
      {
        id: 2,
        question: 'Which of the following is a triatomic molecule?',
        options: ['H₂', 'O₃', 'CH₄', 'He'],
        correctIndex: 1,
        explanation: 'Ozone (O₃) contains three oxygen atoms.'
      }
    ]
  },
  {
    id: 'note-10-phy-ch10',
    grade: '10th',
    subjectId: '10-phy',
    subjectName: 'Physics',
    subjectNameUrdu: 'طبیعیات',
    chapterNumber: 10,
    chapterTitle: 'Simple Harmonic Motion and Waves',
    chapterTitleUrdu: 'سمپل ہارمونک موشن اور ویوز',
    totalMarks: 60,
    pages: 16,
    fileSize: '3.8 MB',
    downloadCount: 22100,
    updatedDate: 'Latest 2026 Edition',
    summary: 'Complete exam notes for motion of mass attached to a spring, simple pendulum, damping, wave motion, mechanical vs electromagnetic waves, wave equation (v = fλ), and ripple tank phenomena.',
    keyFormulas: [
      'Hooke’s Law: F = -kx (Restoring force)',
      'Time period of mass-spring system: T = 2π√(m / k)',
      'Time period of simple pendulum: T = 2π√(l / g)',
      'Wave speed equation: v = fλ',
    ],
    keyDefinitions: [
      {
        term: 'Simple Harmonic Motion (SHM)',
        definition: 'Motion that occurs when the net force is directly proportional to displacement from the mean position and is always directed towards the mean position: a ∝ -x.'
      },
      {
        term: 'Diffraction of Waves',
        definition: 'The bending or spreading of waves around the sharp edges or corners of obstacles or through small slits.'
      }
    ],
    solvedQuestions: [
      {
        questionNumber: 'Q 10.1',
        question: 'Prove that the motion of a mass attached to a spring is Simple Harmonic Motion.',
        questionUrdu: 'ثابت کریں کہ سپرنگ سے بندھے ماس کی موشن سمپل ہارمونک موشن (SHM) ہے۔',
        answer: 'According to Hooke’s Law, Restoring Force F = -kx. By Newton’s Second Law, F = ma. Equating both: ma = -kx => a = -(k/m)x. Since k and m are constants, a ∝ -x. This proves that acceleration is directly proportional to displacement and directed towards mean position, which fulfills the exact criterion for SHM.',
        importance: 'Very Important'
      },
      {
        questionNumber: 'Q 10.4',
        question: 'Find the time period and frequency of a simple pendulum 1 meter long at a location where g = 10 m/s².',
        questionUrdu: 'ایک میٹر لمبے پینڈولم کا ٹائم پیریڈ اور فریکوئنسی معلوم کریں۔',
        answer: 'Given l = 1.0 m, g = 10 m/s². Formula: T = 2π√(l/g) = 2 × 3.1416 × √(1/10) = 6.283 × 0.3162 ≈ 1.99 seconds (approx 2 s). Frequency f = 1/T = 1 / 1.99 ≈ 0.5 Hz.',
        importance: 'Past Paper Repeated'
      }
    ],
    mcqs: [
      {
        id: 1,
        question: 'Which of the following does NOT affect the time period of a simple pendulum?',
        options: ['Length of pendulum', 'Acceleration due to gravity', 'Mass of bob', 'None of these'],
        correctIndex: 2,
        explanation: 'The formula T = 2π√(l/g) contains no mass term; period is independent of bob mass.'
      },
      {
        id: 2,
        question: 'In a ripple tank, water waves pass from deep water into shallow water. Their speed:',
        options: ['Increases', 'Decreases', 'Remains unchanged', 'Becomes zero'],
        correctIndex: 1,
        explanation: 'Wave speed decreases in shallow water because wavelength shortens.'
      }
    ]
  },
  {
    id: 'note-11-phy-ch2',
    grade: '11th',
    subjectId: '11-phy',
    subjectName: 'Physics',
    subjectNameUrdu: 'طبیعیات (سال اول)',
    chapterNumber: 2,
    chapterTitle: 'Vectors and Equilibrium',
    chapterTitleUrdu: 'ویکٹرز اور توازن',
    totalMarks: 85,
    pages: 22,
    fileSize: '5.2 MB',
    downloadCount: 31400,
    updatedDate: 'Latest 2026 Edition',
    summary: 'Vector addition by rectangular components, scalar (dot) product, vector (cross) product, torque, couple, and first and second conditions of equilibrium with complete textbook numericals.',
    keyFormulas: [
      'Dot Product: A · B = |A||B| cos(θ)',
      'Cross Product: A × B = |A||B| sin(θ) n̂',
      'Torque: τ = r × F = r F sin(θ)',
      '1st Condition: ΣFx = 0, ΣFy = 0; 2nd Condition: Στ = 0',
    ],
    keyDefinitions: [
      {
        term: 'Equilibrium',
        definition: 'A state in which no net force and no net torque acts on a body, causing its linear and angular accelerations to remain zero.'
      },
      {
        term: 'Torque',
        definition: 'The turning effect of a force about an axis of rotation, defined as vector product of position vector and applied force.'
      }
    ],
    solvedQuestions: [
      {
        questionNumber: 'Q 2.5',
        question: 'Show that dot product of two mutually perpendicular vectors is zero, while cross product is maximum.',
        answer: 'For perpendicular vectors θ = 90°. Dot product: A · B = AB cos(90°) = AB (0) = 0. Cross product magnitude: |A × B| = AB sin(90°) = AB (1) = AB, which is the maximum possible value.',
        importance: 'Very Important'
      }
    ],
    mcqs: [
      {
        id: 1,
        question: 'If A · B = 0 and A × B = 0, and A ≠ 0, then vector B is:',
        options: ['Parallel to A', 'Perpendicular to A', 'A Null Vector', 'Unit vector'],
        correctIndex: 2,
        explanation: 'Both products can only be simultaneously zero if vector B is the null vector (zero magnitude).'
      }
    ]
  },
  {
    id: 'note-12-phy-ch12',
    grade: '12th',
    subjectId: '12-phy',
    subjectName: 'Physics',
    subjectNameUrdu: 'طبیعیات (سال دوم)',
    chapterNumber: 12,
    chapterTitle: 'Electrostatics',
    chapterTitleUrdu: 'الیکٹرو سٹیٹکس',
    totalMarks: 85,
    pages: 26,
    fileSize: '6.1 MB',
    downloadCount: 38900,
    updatedDate: 'Latest 2026 Edition',
    summary: 'Coulomb’s law in vector form, electric field strength, flux through a closed surface, Gauss’s law and its three applications, electric potential, Millikan’s oil drop experiment, and capacitor dielectrics.',
    keyFormulas: [
      'Coulomb’s Law: F = (1 / 4πε₀) (q₁q₂ / r²)',
      'Electric Field: E = F / q₀',
      'Gauss’s Law: Φ = Q_enclosed / ε₀',
      'Capacitance: C = ε₀ εr A / d',
    ],
    keyDefinitions: [
      {
        term: 'Electric Flux',
        definition: 'The number of electric lines of force passing normally through a given area: Φ = E · A.'
      },
      {
        term: 'Equipotential Surface',
        definition: 'A surface on which all points are at the same electric potential, meaning no work is done moving a charge along it.'
      }
    ],
    solvedQuestions: [
      {
        questionNumber: 'Q 12.3',
        question: 'State Gauss’s Law and calculate the electric intensity due to an infinite sheet of charge.',
        answer: 'Gauss’s Law states that total electric flux through any closed surface is 1/ε₀ times total charge enclosed. For infinite sheet of charge density σ: By symmetry across a cylindrical Gaussian surface with end caps of area A: Total Flux Φ = 2EA. By Gauss’s Law: Φ = Q / ε₀ = (σA) / ε₀. Equating both: 2EA = σA / ε₀ => E = σ / (2ε₀).',
        importance: 'Very Important'
      }
    ],
    mcqs: [
      {
        id: 1,
        question: 'The SI unit of electric flux is:',
        options: ['N / C', 'N m² / C', 'N C / m²', 'J / C'],
        correctIndex: 1,
        explanation: 'Electric flux Φ = E × Area = (N/C) × m² = N m² / C.'
      }
    ]
  }
];

export const PAIRING_SCHEMES: PairingScheme[] = [
  {
    id: 'scheme-9-phy',
    grade: '9th',
    subject: 'Physics',
    subjectUrdu: 'طبیعیات (نویں جماعت)',
    academicYear: '2026 Board Exam Pattern',
    boardGroup: 'Punjab Boards (BISE Lahore, RWP, Multan, FSD, GRW, SWL, BWP, SGD, DGK) & FBISE',
    totalMarks: 60,
    passingMarks: 20,
    objectiveMarks: 12,
    subjectiveMarks: 48,
    summary: 'Official Punjab Board assessment scheme for 9th class Physics. Comprises Question 1 (12 MCQs), Section I (Short Questions - Attempt 15 out of 24), and Section II (Long Questions - Attempt 2 out of 3).',
    mcqDistribution: [
      { chapter: 'Chapter 1: Physical Quantities & Measurement', mcqsCount: 1 },
      { chapter: 'Chapter 2: Kinematics', mcqsCount: 1 },
      { chapter: 'Chapter 3: Dynamics', mcqsCount: 2 },
      { chapter: 'Chapter 4: Turning Effect of Forces', mcqsCount: 1 },
      { chapter: 'Chapter 5: Gravitation', mcqsCount: 1 },
      { chapter: 'Chapter 6: Work & Energy', mcqsCount: 2 },
      { chapter: 'Chapter 7: Properties of Matter', mcqsCount: 1 },
      { chapter: 'Chapter 8: Thermal Properties of Matter', mcqsCount: 2 },
      { chapter: 'Chapter 9: Transfer of Heat', mcqsCount: 1 },
    ],
    shortQuestionsSections: [
      {
        title: 'Question No. 2 (Short Questions)',
        marks: 10,
        description: 'Attempt any 5 questions out of 8 (2 marks each)',
        breakdown: [
          { questionLabel: 'Part 1–8', chapters: 'Chapter 1 (3 Qs), Chapter 3 (2 Qs), Chapter 5 (3 Qs)', choiceInfo: '5 out of 8', marksDistribution: '5 × 2 = 10 Marks' }
        ]
      },
      {
        title: 'Question No. 3 (Short Questions)',
        marks: 10,
        description: 'Attempt any 5 questions out of 8 (2 marks each)',
        breakdown: [
          { questionLabel: 'Part 1–8', chapters: 'Chapter 2 (3 Qs), Chapter 7 (3 Qs), Chapter 9 (2 Qs)', choiceInfo: '5 out of 8', marksDistribution: '5 × 2 = 10 Marks' }
        ]
      },
      {
        title: 'Question No. 4 (Short Questions)',
        marks: 10,
        description: 'Attempt any 5 questions out of 8 (2 marks each)',
        breakdown: [
          { questionLabel: 'Part 1–8', chapters: 'Chapter 4 (3 Qs), Chapter 6 (3 Qs), Chapter 8 (2 Qs)', choiceInfo: '5 out of 8', marksDistribution: '5 × 2 = 10 Marks' }
        ]
      }
    ],
    longQuestionsSection: {
      rule: 'Attempt any TWO (2) Long Questions out of Three (3). Each question carries 9 marks (Part a = Theory [4/5 marks], Part b = Numerical [5/4 marks]).',
      pairs: [
        {
          questionNumber: 'Question No. 5',
          partA: 'Theory / Numerical from Chapter 2 (Kinematics) OR Chapter 3 (Dynamics)',
          partB: 'Theory / Numerical from Chapter 1 OR Chapter 5 (Gravitation)'
        },
        {
          questionNumber: 'Question No. 6',
          partA: 'Theory / Numerical from Chapter 4 (Turning Effect of Forces)',
          partB: 'Theory / Numerical from Chapter 6 (Work and Energy)'
        },
        {
          questionNumber: 'Question No. 7',
          partA: 'Theory / Numerical from Chapter 7 (Properties of Matter)',
          partB: 'Theory / Numerical from Chapter 8 (Thermal Properties) OR Chapter 9'
        }
      ]
    },
    preparationTips: [
      'Focus intensely on Chapter 3 & Chapter 6 for guaranteed numerical problems.',
      'Prepare all exercise MCQs thoroughly; 10 out of 12 MCQs are directly from textbook exercises.',
      'Practice definitions of base & derived units, equilibrium conditions, and Pascal’s law.'
    ]
  },
  {
    id: 'scheme-10-phy',
    grade: '10th',
    subject: 'Physics',
    subjectUrdu: 'طبیعیات (دسویں جماعت)',
    academicYear: '2026 Board Exam Pattern',
    boardGroup: 'All Punjab Educational Boards (BISEs)',
    totalMarks: 60,
    passingMarks: 20,
    objectiveMarks: 12,
    subjectiveMarks: 48,
    summary: 'Standard Board Pairing Scheme for Matric Part 2 Physics. Questions Q5, Q6, and Q7 long pairings strictly pair theory and numericals.',
    mcqDistribution: [
      { chapter: 'Chapter 10: Simple Harmonic Motion', mcqsCount: 1 },
      { chapter: 'Chapter 11: Sound', mcqsCount: 1 },
      { chapter: 'Chapter 12: Geometrical Optics', mcqsCount: 2 },
      { chapter: 'Chapter 13: Electrostatics', mcqsCount: 1 },
      { chapter: 'Chapter 14: Current Electricity', mcqsCount: 2 },
      { chapter: 'Chapter 15: Electromagnetism', mcqsCount: 1 },
      { chapter: 'Chapter 16: Basic Electronics', mcqsCount: 1 },
      { chapter: 'Chapter 17: Information & Comm. Tech', mcqsCount: 1 },
      { chapter: 'Chapter 18: Atomic & Nuclear Physics', mcqsCount: 2 },
    ],
    shortQuestionsSections: [
      {
        title: 'Question No. 2 (Short Questions)',
        marks: 10,
        description: 'Attempt any 5 out of 8',
        breakdown: [
          { questionLabel: 'Q2', chapters: 'Chapter 10 (3 Qs), Chapter 11 (2 Qs), Chapter 15 (3 Qs)', choiceInfo: '5 out of 8', marksDistribution: '10 Marks' }
        ]
      },
      {
        title: 'Question No. 3 (Short Questions)',
        marks: 10,
        description: 'Attempt any 5 out of 8',
        breakdown: [
          { questionLabel: 'Q3', chapters: 'Chapter 13 (3 Qs), Chapter 14 (3 Qs), Chapter 16 (2 Qs)', choiceInfo: '5 out of 8', marksDistribution: '10 Marks' }
        ]
      },
      {
        title: 'Question No. 4 (Short Questions)',
        marks: 10,
        description: 'Attempt any 5 out of 8',
        breakdown: [
          { questionLabel: 'Q4', chapters: 'Chapter 12 (3 Qs), Chapter 17 (2 Qs), Chapter 18 (3 Qs)', choiceInfo: '5 out of 8', marksDistribution: '10 Marks' }
        ]
      }
    ],
    longQuestionsSection: {
      rule: 'Attempt any TWO (2) questions. Each carries 9 marks (Part a = Theory 4/5 marks, Part b = Numerical 5/4 marks).',
      pairs: [
        {
          questionNumber: 'Question No. 5',
          partA: 'Theory / Problem from Chapter 10 (SHM) or Chapter 11 (Sound)',
          partB: 'Theory / Problem from Chapter 15 (Electromagnetism)'
        },
        {
          questionNumber: 'Question No. 6',
          partA: 'Theory / Problem from Chapter 12 (Geometrical Optics)',
          partB: 'Theory / Problem from Chapter 13 (Electrostatics) or Chapter 14'
        },
        {
          questionNumber: 'Question No. 7',
          partA: 'Theory / Problem from Chapter 16 (Basic Electronics)',
          partB: 'Theory / Problem from Chapter 18 (Atomic & Nuclear Physics)'
        }
      ]
    },
    preparationTips: [
      'Optics (Ch 12) mirror and lens numericals are almost guaranteed in Q6.',
      'Half-life formula and nuclear decay equations from Ch 18 are high-yield.',
      'Logic gates (AND, OR, NOT, NAND, NOR) truth tables from Ch 16 are frequently asked.'
    ]
  },
  {
    id: 'scheme-11-phy',
    grade: '11th',
    subject: 'Physics',
    subjectUrdu: 'طبیعیات (سال اول)',
    academicYear: '2026 Intermediate Part 1',
    boardGroup: 'Punjab Boards & AJK Board',
    totalMarks: 85,
    passingMarks: 28,
    objectiveMarks: 17,
    subjectiveMarks: 68,
    summary: 'FSc Pre-Engineering & Pre-Medical Class 11 Physics Board Pairing Scheme with 17 MCQs, 22 Short Questions (44 marks), and 3 Long Questions (24 marks).',
    mcqDistribution: [
      { chapter: 'Chapter 1: Measurements', mcqsCount: 2 },
      { chapter: 'Chapter 2: Vectors & Equilibrium', mcqsCount: 2 },
      { chapter: 'Chapter 3: Motion & Force', mcqsCount: 2 },
      { chapter: 'Chapter 4: Work & Energy', mcqsCount: 1 },
      { chapter: 'Chapter 5: Circular Motion', mcqsCount: 2 },
      { chapter: 'Chapter 6: Fluid Dynamics', mcqsCount: 1 },
      { chapter: 'Chapter 7: Oscillations', mcqsCount: 1 },
      { chapter: 'Chapter 8: Waves', mcqsCount: 2 },
      { chapter: 'Chapter 9: Physical Optics', mcqsCount: 1 },
      { chapter: 'Chapter 10: Optical Instruments', mcqsCount: 1 },
      { chapter: 'Chapter 11: Heat & Thermodynamics', mcqsCount: 2 },
    ],
    shortQuestionsSections: [
      {
        title: 'Question No. 2 (Short Questions)',
        marks: 16,
        description: 'Attempt any 8 out of 12',
        breakdown: [
          { questionLabel: 'Q2', chapters: 'Ch 1 (4 Qs), Ch 2 (3 Qs), Ch 3 (3 Qs), Ch 6 (2 Qs)', choiceInfo: '8 out of 12', marksDistribution: '16 Marks' }
        ]
      },
      {
        title: 'Question No. 3 (Short Questions)',
        marks: 16,
        description: 'Attempt any 8 out of 12',
        breakdown: [
          { questionLabel: 'Q3', chapters: 'Ch 4 (2 Qs), Ch 5 (4 Qs), Ch 7 (3 Qs), Ch 8 (3 Qs)', choiceInfo: '8 out of 12', marksDistribution: '16 Marks' }
        ]
      },
      {
        title: 'Question No. 4 (Short Questions)',
        marks: 12,
        description: 'Attempt any 6 out of 9',
        breakdown: [
          { questionLabel: 'Q4', chapters: 'Ch 9 (3 Qs), Ch 10 (2 Qs), Ch 11 (4 Qs)', choiceInfo: '6 out of 9', marksDistribution: '12 Marks' }
        ]
      }
    ],
    longQuestionsSection: {
      rule: 'Attempt any THREE (3) out of 5 Questions. Each question has 8 marks (Part a = Theory 5 marks, Part b = Numerical 3 marks).',
      pairs: [
        { questionNumber: 'Question No. 5', partA: 'Chapter 2 (Theory)', partB: 'Chapter 3 (Numerical)' },
        { questionNumber: 'Question No. 6', partA: 'Chapter 4 (Theory)', partB: 'Chapter 5 (Numerical)' },
        { questionNumber: 'Question No. 7', partA: 'Chapter 6 (Theory)', partB: 'Chapter 7 (Numerical)' },
        { questionNumber: 'Question No. 8', partA: 'Chapter 8 (Theory)', partB: 'Chapter 9 / 10 (Numerical)' },
        { questionNumber: 'Question No. 9', partA: 'Chapter 11 (Theory)', partB: 'Chapter 11 (Numerical)' }
      ]
    },
    preparationTips: [
      'Mastering Ch 2, 3, 4, 5 secures 2 full long questions easily.',
      'Carnot Engine and 1st Law of Thermodynamics from Ch 11 are top theory favorites.',
      'Bernoulli’s theorem and Terminal Velocity from Ch 6 carry high weightage.'
    ]
  },
  {
    id: 'scheme-12-phy',
    grade: '12th',
    subject: 'Physics',
    subjectUrdu: 'طبیعیات (سال دوم)',
    academicYear: '2026 Intermediate Part 2',
    boardGroup: 'Punjab Educational Boards & Federal Board',
    totalMarks: 85,
    passingMarks: 28,
    objectiveMarks: 17,
    subjectiveMarks: 68,
    summary: 'Class 12 FSc 2nd Year Physics scheme. 17 Objective MCQs + 44 Short Questions marks + 24 Long Questions marks.',
    mcqDistribution: [
      { chapter: 'Chapter 12: Electrostatics', mcqsCount: 2 },
      { chapter: 'Chapter 13: Current Electricity', mcqsCount: 1 },
      { chapter: 'Chapter 14: Electromagnetism', mcqsCount: 2 },
      { chapter: 'Chapter 15: Electromagnetic Induction', mcqsCount: 2 },
      { chapter: 'Chapter 16: Alternating Current', mcqsCount: 2 },
      { chapter: 'Chapter 17: Physics of Solids', mcqsCount: 1 },
      { chapter: 'Chapter 18: Electronics', mcqsCount: 2 },
      { chapter: 'Chapter 19: Dawn of Modern Physics', mcqsCount: 2 },
      { chapter: 'Chapter 20: Atomic Spectra', mcqsCount: 1 },
      { chapter: 'Chapter 21: Nuclear Physics', mcqsCount: 2 },
    ],
    shortQuestionsSections: [
      {
        title: 'Question No. 2 (Short Questions)',
        marks: 16,
        description: 'Attempt any 8 out of 12',
        breakdown: [
          { questionLabel: 'Q2', chapters: 'Ch 12 (4 Qs), Ch 14 (4 Qs), Ch 21 (4 Qs)', choiceInfo: '8 out of 12', marksDistribution: '16 Marks' }
        ]
      },
      {
        title: 'Question No. 3 (Short Questions)',
        marks: 16,
        description: 'Attempt any 8 out of 12',
        breakdown: [
          { questionLabel: 'Q3', chapters: 'Ch 13 (3 Qs), Ch 16 (3 Qs), Ch 17 (3 Qs), Ch 18 (3 Qs)', choiceInfo: '8 out of 12', marksDistribution: '16 Marks' }
        ]
      },
      {
        title: 'Question No. 4 (Short Questions)',
        marks: 12,
        description: 'Attempt any 6 out of 9',
        breakdown: [
          { questionLabel: 'Q4', chapters: 'Ch 15 (4 Qs), Ch 19 (3 Qs), Ch 20 (2 Qs)', choiceInfo: '6 out of 9', marksDistribution: '12 Marks' }
        ]
      }
    ],
    longQuestionsSection: {
      rule: 'Attempt any THREE (3) out of 5 Questions. (Part a = Theory 5 marks, Part b = Numerical 3 marks).',
      pairs: [
        { questionNumber: 'Question No. 5', partA: 'Chapter 12 (Theory)', partB: 'Chapter 13 (Numerical)' },
        { questionNumber: 'Question No. 6', partA: 'Chapter 14 (Theory)', partB: 'Chapter 15 (Numerical)' },
        { questionNumber: 'Question No. 7', partA: 'Chapter 16 (Theory)', partB: 'Chapter 18 (Numerical)' },
        { questionNumber: 'Question No. 8', partA: 'Chapter 17 (Theory)', partB: 'Chapter 19 (Numerical)' },
        { questionNumber: 'Question No. 9', partA: 'Chapter 20 (Theory)', partB: 'Chapter 21 (Numerical)' }
      ]
    },
    preparationTips: [
      'Ch 12 and Ch 13 pairing is classic and predictable for high score.',
      'Electromagnetic Induction (Ch 15) generator and transformer questions.',
      'Photoelectric effect (Ch 19) and Mass defect/binding energy (Ch 21) are essential.'
    ]
  }
];

export const NOTICE_ALERTS = [
  '📢 New: Punjab Board Annual 2026 Pairing Schemes for Class 9, 10, 11, 12 uploaded!',
  '📘 Class 9 Physics & Chemistry Chapter-Wise Solved Exercise Notes now available in PDF.',
  '🎯 10th Class Guess Papers & Most Important Past Paper Questions added to study bank.',
  '⚡ Free Blogger & WordPress Theme XML code available for Shami Academy students and bloggers.'
];
