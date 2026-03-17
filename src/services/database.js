import Dexie from 'dexie';

export const db = new Dexie('TalentFlowDB');

db.version(1).stores({
  jobs: '++id, title, slug, status, tags, order, createdAt',
  candidates: '++id, name, email, stage, jobId, createdAt, updatedAt',
  candidateTimeline: '++id, candidateId, stage, timestamp, notes',
  assessments: '++id, jobId, title, sections, createdAt',
  assessmentResponses: '++id, assessmentId, candidateId, responses, submittedAt',
  users: '++id, email, password, role, name'
});

// Seed data generation
export const generateSeedData = async () => {
  try {
    const existingJobs = await db.jobs.count();
    if (existingJobs > 0) return;

    console.log('Generating seed data...');

    // Generate users with demo credentials
    const users = [
      { email: 'admin@talentflow.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      { email: 'hr@talentflow.com', password: 'hr123', role: 'hr', name: 'HR Manager' },
      { email: 'demo@talentflow.com', password: 'demo123', role: 'hr', name: 'Demo User' }
    ];
    await db.users.bulkAdd(users);

    // Generate jobs
    const jobTitles = [
      'Senior React Developer', 'Backend Node.js Engineer', 'DevOps Specialist', 'UI/UX Designer',
      'Product Manager', 'Data Scientist', 'Mobile Developer', 'QA Automation Engineer',
      'Fullstack JavaScript Developer', 'Machine Learning Engineer', 'Technical Writer',
      'Cybersecurity Engineer', 'Business Analyst', 'Scrum Master', 'Cloud Solutions Architect',
      'Frontend Vue.js Developer', 'Python Backend Developer', 'Java Spring Developer', 
      'Sales Development Representative', 'Digital Marketing Manager', 'Customer Success Manager', 
      'Operations Coordinator', 'Finance Business Analyst', 'HR Business Partner', 'Content Marketing Specialist'
    ];

    const techTags = ['React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'Vue.js', 'MongoDB'];
    const nonTechTags = ['Communication', 'Leadership', 'Project Management', 'Analytics', 'Strategy', 'Sales'];

    const jobs = jobTitles.map((title, index) => ({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: Math.random() > 0.25 ? 'active' : 'archived',
      tags: index < 15 ? 
        techTags.slice(0, Math.floor(Math.random() * 4) + 2) : 
        nonTechTags.slice(0, Math.floor(Math.random() * 3) + 1),
      order: index,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      description: `Exciting opportunity for a ${title} to join our innovative team and work on cutting-edge projects.`
    }));

    const jobIds = await db.jobs.bulkAdd(jobs, { allKeys: true });

    // Generate 1000+ candidates
    const firstNames = ['Aarav', 'Vivaan', 'Reyansh', 'Muhammad', 'Sai', 'Vihaan', 'Aadhya', 'Ananya', 'Diya', 'Ira',
                       'John', 'Emma', 'Liam', 'Olivia', 'William', 'Ava', 'James', 'Isabella', 'Oliver', 'Sophia',
                       'Raj', 'Priya', 'Arjun', 'Kavya', 'Rohan', 'Shreya', 'Kiran', 'Meera', 'Dev', 'Riya'];
    const lastNames = ['Patel', 'Sharma', 'Gupta', 'Singh', 'Kumar', 'Shah', 'Mehta', 'Joshi', 'Agarwal', 'Verma',
                      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                      'Reddy', 'Rao', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Das', 'Ghosh', 'Banerjee', 'Chakraborty'];
    const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

    const candidates = [];
    for (let i = 0; i < 1000; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@email.com`;
      const jobId = jobIds[Math.floor(Math.random() * jobIds.length)];
      const stage = stages[Math.floor(Math.random() * stages.length)];
      const createdAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);

      candidates.push({
        name: `${firstName} ${lastName}`,
        email,
        stage,
        jobId,
        createdAt,
        updatedAt: createdAt,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        experience: Math.floor(Math.random() * 10) + 1
      });
    }

    const candidateIds = await db.candidates.bulkAdd(candidates, { allKeys: true });

    // Generate candidate timelines
    const timelines = [];
    candidateIds.forEach((candidateId, index) => {
      const candidate = candidates[index];
      const stageIndex = stages.indexOf(candidate.stage);
      
      for (let i = 0; i <= stageIndex; i++) {
        timelines.push({
          candidateId,
          stage: stages[i],
          timestamp: new Date(candidate.createdAt.getTime() + i * 24 * 60 * 60 * 1000),
          notes: i === 0 ? 'Application submitted via careers page' : 
                 i === 1 ? 'Initial screening completed' :
                 i === 2 ? 'Technical interview scheduled' :
                 i === 3 ? 'Final round completed' :
                 i === 4 ? 'Offer extended and accepted' :
                 'Application reviewed and closed'
        });
      }
    });

    await db.candidateTimeline.bulkAdd(timelines);

    // Generate sample assessments
    const questionTypes = ['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric', 'file-upload'];
    
    for (let i = 0; i < Math.min(5, jobIds.length); i++) {
      const jobId = jobIds[i];
      const sections = [];
      
      // Technical Section
      const techQuestions = [
        {
          id: 'tech_1',
          type: 'single-choice',
          question: 'What is the virtual DOM in React?',
          required: true,
          options: [
            'A lightweight copy of the real DOM',
            'A database for storing component state',
            'A CSS framework for styling',
            'A testing library for React'
          ]
        },
        {
          id: 'tech_2',
          type: 'multi-choice',
          question: 'Which of the following are JavaScript ES6 features?',
          required: true,
          options: ['Arrow functions', 'Template literals', 'Destructuring', 'Classes']
        },
        {
          id: 'tech_3',
          type: 'long-text',
          question: 'Explain the concept of closures in JavaScript with an example.',
          required: true,
          validation: { maxLength: 1000 }
        }
      ];

      sections.push({
        id: 'technical',
        title: 'Technical Knowledge',
        questions: techQuestions
      });

      // Experience Section
      const expQuestions = [
        {
          id: 'exp_1',
          type: 'numeric',
          question: 'How many years of professional experience do you have?',
          required: true,
          validation: { min: 0, max: 20 }
        },
        {
          id: 'exp_2',
          type: 'short-text',
          question: 'What is your current role/designation?',
          required: true,
          validation: { maxLength: 100 }
        }
      ];

      sections.push({
        id: 'experience',
        title: 'Professional Experience',
        questions: expQuestions
      });

      await db.assessments.add({
        jobId,
        title: `Technical Assessment - ${jobs[i].title}`,
        sections,
        createdAt: new Date(),
        isActive: true
      });
    }

    console.log('Seed data generated successfully!');
  } catch (error) {
    console.error('Error generating seed data:', error);
  }
};

export const initializeDatabase = async () => {
  try {
    await db.open();
    await generateSeedData();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};