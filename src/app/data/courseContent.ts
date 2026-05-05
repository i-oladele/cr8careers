// Comprehensive course content with modules, lessons, and assessments
export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  instructor: string;
  modules: Module[];
  finalAssessment?: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
    passingScore: number;
  };
}

export const coursesData: Course[] = [
  {
    id: 'leadership-excellence',
    title: 'Leadership Excellence',
    description: 'Develop essential leadership skills to inspire and motivate teams in today\'s dynamic workplace.',
    duration: '6 weeks',
    level: 'Intermediate',
    price: '₦75,000',
    category: 'Leadership',
    instructor: 'Dr. Sarah Johnson',
    modules: [
      {
        id: 'mod-1',
        title: 'Foundations of Leadership',
        description: 'Understanding core leadership principles and styles',
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'What Makes a Great Leader?',
            content: `# What Makes a Great Leader?

Leadership is not about titles or positions - it's about influence and impact. Great leaders inspire others to achieve their full potential and work towards a common vision.

## Key Leadership Qualities:

### 1. Vision
- Clear sense of direction and purpose
- Ability to articulate compelling future state
- Strategic thinking and planning

### 2. Communication
- Active listening skills
- Clear and concise messaging
- Ability to inspire through words

### 3. Emotional Intelligence
- Self-awareness and self-regulation
- Empathy and social awareness
- Relationship management

### 4. Decision Making
- Analytical thinking
- Problem-solving skills
- Courage to make tough decisions

## Activity:
Reflect on leaders you admire. What qualities do they demonstrate? How can you develop these qualities in yourself?`,
            duration: '15 min',
            type: 'text'
          },
          {
            id: 'lesson-1-2',
            title: 'Leadership Styles Assessment',
            content: `# Leadership Styles Assessment

Understanding your natural leadership style is the first step toward becoming a more effective leader.

## Common Leadership Styles:

### 1. Democratic Leadership
- Involves team members in decision-making
- Encourages collaboration and feedback
- Builds consensus and commitment

### 2. Transformational Leadership
- Inspires and motivates through vision
- Encourages innovation and creativity
- Focuses on personal development

### 3. Servant Leadership
- Prioritizes team needs first
- Leads by example
- Builds trust through service

### 4. Situational Leadership
- Adapts style to team and circumstances
- Flexible approach to different situations
- Balances direction and support

## Self-Assessment:
Take a moment to identify your default leadership style. Consider past experiences and natural tendencies.`,
            duration: '20 min',
            type: 'text'
          },
          {
            id: 'lesson-1-3',
            title: 'Leadership Principles Quiz',
            content: 'Quiz on leadership fundamentals',
            duration: '10 min',
            type: 'quiz'
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Building High-Performing Teams',
        description: 'Learn to create and lead effective teams',
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'Team Dynamics and Stages',
            content: `# Team Dynamics and Stages

Understanding how teams develop and function is crucial for effective leadership.

## Tuckman's Model of Team Development:

### 1. Forming
- Team members get to know each other
- Uncertainty about roles and responsibilities
- High dependence on leader

### 2. Storming
- Conflict and disagreement emerge
- Different working styles clash
- Challenges to authority

### 3. Norming
- Team establishes rules and values
- Increased cooperation and focus
- Trust begins to build

### 4. Performing
- Team works efficiently and effectively
- High levels of autonomy
- Focus on achieving goals

## Leadership Actions:
- Adapt your approach based on team stage
- Provide appropriate support and guidance
- Facilitate team development`,
            duration: '25 min',
            type: 'text'
          },
          {
            id: 'lesson-2-2',
            title: 'Effective Team Communication',
            content: `# Effective Team Communication

Communication is the lifeblood of successful teams. As a leader, you must establish clear channels and norms.

## Communication Best Practices:

### 1. Regular Check-ins
- Daily stand-ups or weekly meetings
- One-on-one sessions
- Progress updates

### 2. Clear Expectations
- Define roles and responsibilities
- Set clear goals and deadlines
- Establish communication protocols

### 3. Active Listening
- Give full attention to speakers
- Ask clarifying questions
- Provide constructive feedback

### 4. Conflict Resolution
- Address issues early
- Focus on interests, not positions
- Seek win-win solutions

## Tools and Techniques:
- Use collaborative platforms
- Implement feedback systems
- Create open communication culture`,
            duration: '20 min',
            type: 'text'
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Strategic Leadership',
        description: 'Develop strategic thinking and planning skills',
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'Strategic Planning Fundamentals',
            content: `# Strategic Planning Fundamentals

Strategic leaders think beyond daily operations and plan for the future success of their teams and organizations.

## Strategic Planning Process:

### 1. Vision and Mission
- Define long-term vision
- Establish clear mission
- Align with organizational goals

### 2. Situation Analysis
- SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)
- Market and competitive analysis
- Resource assessment

### 3. Goal Setting
- SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- Short-term and long-term objectives
- Key performance indicators

### 4. Implementation
- Action plans and timelines
- Resource allocation
- Risk management

## Strategic Thinking Skills:
- Systems thinking
- Pattern recognition
- Scenario planning
- Innovation mindset`,
            duration: '30 min',
            type: 'text'
          }
        ]
      }
    ],
    finalAssessment: {
      questions: [
        {
          id: 'q1',
          question: 'What is the most important quality of an effective leader?',
          options: ['Technical expertise', 'Vision and communication', 'Strict authority', 'Perfectionism'],
          correctAnswer: 1
        },
        {
          id: 'q2',
          question: 'During the "storming" stage of team development, leaders should:',
          options: ['Avoid all conflict', 'Establish clear rules', 'Facilitate constructive conflict resolution', 'Take over all decisions'],
          correctAnswer: 2
        },
        {
          id: 'q3',
          question: 'SMART goals are:',
          options: ['Simple, Measurable, Achievable, Relevant, Time-bound', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'Strategic, Measurable, Actionable, Relevant, Time-bound', 'Simple, Manageable, Achievable, Relevant, Time-bound'],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'advanced-recruitment',
    title: 'Advanced Recruitment Strategies',
    description: 'Master modern recruitment techniques and talent acquisition strategies for HR professionals.',
    duration: '8 weeks',
    level: 'Advanced',
    price: '₦100,000',
    category: 'Technical',
    instructor: 'Michael Chen, PHR',
    modules: [
      {
        id: 'mod-1',
        title: 'Modern Recruitment Landscape',
        description: 'Understanding current trends and challenges in talent acquisition',
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'The Evolution of Recruitment',
            content: `# The Evolution of Recruitment

Recruitment has transformed dramatically over the past decade. Today's recruiters must be tech-savvy, data-driven, and candidate-centric.

## Key Changes in Recruitment:

### 1. Digital Transformation
- AI-powered sourcing tools
- Automated screening systems
- Virtual recruitment platforms
- Social media recruiting

### 2. Candidate Experience Focus
- Personalized communication
- Mobile-first application processes
- Real-time feedback systems
- Employer branding emphasis

### 3. Data-Driven Decisions
- Recruitment analytics
- Predictive hiring models
- Performance metrics tracking
- ROI measurement

### 4. Diversity and Inclusion
- Unbiased screening processes
- Diverse sourcing strategies
- Inclusive job descriptions
- Accessibility considerations

## Modern Recruiter Skills:
- Digital literacy
- Data analysis
- Marketing knowledge
- Relationship building
- Project management`,
            duration: '25 min',
            type: 'text'
          },
          {
            id: 'lesson-1-2',
            title: 'Building Talent Pipelines',
            content: `# Building Talent Pipelines

Proactive talent pipeline building is essential for reducing time-to-hire and improving quality of hire.

## Pipeline Development Strategy:

### 1. Identify Critical Roles
- High-turnover positions
- Hard-to-fill roles
- Future skill requirements
- Leadership succession needs

### 2. Source Diverse Candidates
- Employee referrals
- Professional networks
- University partnerships
- Industry associations
- Online communities

### 3. Engage Passive Candidates
- Personalized outreach
- Value proposition communication
- Relationship nurturing
- Regular touchpoints

### 4. Maintain Database
- CRM systems
- Regular data updates
- Candidate categorization
- Engagement tracking

## Best Practices:
- Quality over quantity
- Regular communication
- Personalized approach
- Long-term relationship building`,
            duration: '30 min',
            type: 'text'
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Advanced Sourcing Techniques',
        description: 'Master advanced candidate sourcing methods and tools',
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'Boolean Search Mastery',
            content: `# Boolean Search Mastery

Boolean search is a powerful technique for finding qualified candidates quickly and efficiently.

## Basic Boolean Operators:

### 1. AND
- Narrows search results
- All terms must be present
- Example: "software engineer" AND "Python"

### 2. OR
- Broadens search results
- Any term can be present
- Example: "HR" OR "Human Resources"

### 3. NOT
- Excludes specific terms
- Refines search results
- Example: "manager" NOT "sales"

### 4. Parentheses
- Groups search terms
- Controls order of operations
- Example: ("Java" OR "Python") AND "senior"

## Advanced Techniques:

### 1. Quotation Marks
- Exact phrase matching
- Reduces irrelevant results
- Example: "project manager"

### 2. Wildcards
- Partial word matching
- Expands search scope
- Example: develop*

### 3. Site-Specific Search
- Search specific websites
- LinkedIn, GitHub, etc.
- Example: site:linkedin.com "data analyst"

## Platform-Specific Strategies:
- LinkedIn Recruiter
- Indeed Resume Search
- GitHub Talent Search
- Industry job boards`,
            duration: '35 min',
            type: 'text'
          }
        ]
      }
    ],
    finalAssessment: {
      questions: [
        {
          id: 'q1',
          question: 'Which Boolean operator would you use to exclude certain terms from your search?',
          options: ['AND', 'OR', 'NOT', 'XOR'],
          correctAnswer: 2
        },
        {
          id: 'q2',
          question: 'A key focus in modern recruitment is:',
          options: ['Speed over quality', 'Candidate experience', 'Cost reduction only', 'Automation only'],
          correctAnswer: 1
        }
      ],
      passingScore: 75
    }
  }
];

export default coursesData;
