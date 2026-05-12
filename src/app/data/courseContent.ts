// Comprehensive course content with modules, lessons, and assessments
export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi';
  options: QuizOption[];
  correctAnswers: string[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  videoUrl?: string;
  videoDescription?: string;
  attachedFileName?: string;
  quizQuestions?: QuizQuestion[];
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
  thumbnailUrl?: string;
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
  },
  {
    id: 'time-management-fundamentals',
    title: 'Time Management Fundamentals',
    description: 'Master essential time management techniques to boost productivity and achieve work-life balance.',
    duration: '3 weeks',
    level: 'Beginner',
    price: 'Free',
    category: 'Soft Skills',
    instructor: 'Alex Thompson',
    modules: [
      {
        id: 'tm-mod1',
        title: 'Understanding Time Management',
        description: 'Learn the core principles of effective time management',
        lessons: [
          {
            id: 'tm-lesson1',
            title: 'Introduction to Time Management',
            content: `# Introduction to Time Management

Time management is the process of planning and exercising conscious control over the amount of time spent on specific activities, especially to increase effectiveness, efficiency, and productivity.

## Key Concepts:
- Setting clear goals and priorities
- Breaking down large tasks into smaller, manageable chunks
- Using tools and techniques to stay organized
- Eliminating time-wasting activities
- Creating a balanced schedule

## Benefits:
- Reduced stress and anxiety
- Increased productivity
- Better work-life balance
- More time for personal activities
- Improved decision-making skills`,
            duration: '15 min',
            type: 'text'
          },
          {
            id: 'tm-lesson2',
            title: 'Setting SMART Goals',
            content: `# Setting SMART Goals

SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound objectives that help you focus your efforts and increase your chances of success.

## SMART Framework:
- **Specific**: Clearly define what you want to accomplish
- **Measurable**: Establish criteria to track progress
- **Achievable**: Set realistic and attainable goals
- **Relevant**: Ensure goals align with your values and objectives
- **Time-bound**: Set deadlines for completion

## Examples:
- Bad: "I want to be better at time management"
- Good: "I will use the Pomodoro Technique for 25 minutes daily for the next 30 days to improve my focus"`,
            duration: '20 min',
            type: 'text'
          }
        ]
      },
      {
        id: 'tm-mod2',
        title: 'Productivity Techniques',
        description: 'Explore proven methods to enhance your productivity',
        lessons: [
          {
            id: 'tm-lesson3',
            title: 'The Pomodoro Technique',
            content: `# The Pomodoro Technique

The Pomodoro Technique is a time management method that uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks.

## How It Works:
1. Choose a task to focus on
2. Set a timer for 25 minutes
3. Work on the task until the timer rings
4. Take a 5-minute short break
5. After four pomodoros, take a longer break (15-30 minutes)

## Benefits:
- Improves focus and concentration
- Prevents burnout and mental fatigue
- Creates a sense of urgency
- Helps track time spent on tasks`,
            duration: '25 min',
            type: 'text'
          }
        ]
      }
    ],
    finalAssessment: {
      questions: [
        {
          id: 'tm-q1',
          question: 'What does the "M" stand for in SMART goals?',
          options: ['Motivating', 'Measurable', 'Manageable', 'Meaningful'],
          correctAnswer: 1
        },
        {
          id: 'tm-q2',
          question: 'How long is a typical Pomodoro work interval?',
          options: ['15 minutes', '25 minutes', '30 minutes', '45 minutes'],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'digital-literacy-basics',
    title: 'Digital Literacy Basics',
    description: 'Essential digital skills for navigating the modern workplace and online environment safely and effectively.',
    duration: '4 weeks',
    level: 'Beginner',
    price: 'Free',
    category: 'Technical',
    instructor: 'Maria Garcia',
    modules: [
      {
        id: 'dl-mod1',
        title: 'Digital Fundamentals',
        description: 'Learn basic digital concepts and tools',
        lessons: [
          {
            id: 'dl-lesson1',
            title: 'Introduction to Digital Literacy',
            content: `# Introduction to Digital Literacy

Digital literacy is the ability to find, evaluate, utilize, share, and create content using digital technologies and the internet.

## Core Components:
- Basic computer skills
- Internet navigation and safety
- Email communication
- Online research skills
- Digital etiquette and responsibility

## Why It Matters:
- Essential for modern workplace success
- Enables lifelong learning
- Facilitates global communication
- Improves access to information and services`,
            duration: '20 min',
            type: 'text'
          },
          {
            id: 'dl-lesson2',
            title: 'Online Safety and Security',
            content: `# Online Safety and Security

Protecting yourself online is crucial in today's digital world. Learn essential security practices to keep your information safe.

## Security Best Practices:
- Use strong, unique passwords
- Enable two-factor authentication
- Recognize phishing attempts
- Keep software updated
- Use secure Wi-Fi connections
- Backup important data regularly

## Red Flags:
- Unsolicited emails asking for personal information
- Links from unknown senders
- Poor grammar and spelling in official-looking messages
- Urgent requests for immediate action`,
            duration: '25 min',
            type: 'text'
          }
        ]
      }
    ],
    finalAssessment: {
      questions: [
        {
          id: 'dl-q1',
          question: 'What is two-factor authentication?',
          options: ['Using two passwords', 'A security method requiring two forms of verification', 'Double encryption', 'Using two different email accounts'],
          correctAnswer: 1
        },
        {
          id: 'dl-q2',
          question: 'Which is a sign of a phishing attempt?',
          options: ['Official company logo', 'Grammar errors and urgency', 'Personalized greeting', 'Familiar sender email'],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'communication-skills',
    title: 'Effective Communication Skills',
    description: 'Develop powerful communication abilities to enhance personal and professional relationships.',
    duration: '2 weeks',
    level: 'Beginner',
    price: 'Free',
    category: 'Soft Skills',
    instructor: 'James Wilson',
    modules: [
      {
        id: 'cs-mod1',
        title: 'Communication Foundations',
        description: 'Master the basics of effective communication',
        lessons: [
          {
            id: 'cs-lesson1',
            title: 'The Art of Listening',
            content: `# The Art of Listening

Effective listening is a cornerstone of good communication. It's not just about hearing words, but understanding the complete message being sent.

## Active Listening Techniques:
- Maintain eye contact
- Show genuine interest
- Avoid interrupting
- Ask clarifying questions
- Provide feedback and paraphrase
- Pay attention to non-verbal cues

## Benefits:
- Builds stronger relationships
- Reduces misunderstandings
- Increases trust and respect
- Improves problem-solving
- Enhances team collaboration`,
            duration: '18 min',
            type: 'text'
          },
          {
            id: 'cs-lesson2',
            title: 'Non-Verbal Communication',
            content: `# Non-Verbal Communication

Your body language, facial expressions, and tone of voice often communicate more than your words.

## Key Elements:
- **Body Language**: Posture, gestures, and movement
- **Facial Expressions**: Convey emotions and attitudes
- **Eye Contact**: Shows interest and confidence
- **Tone of Voice**: Affects message interpretation
- **Personal Space**: Cultural variations in comfort zones

## Tips:
- Maintain open, relaxed posture
- Use appropriate facial expressions
- Match tone to message content
- Respect cultural differences
- Be aware of nervous habits`,
            duration: '22 min',
            type: 'text'
          }
        ]
      }
    ],
    finalAssessment: {
      questions: [
        {
          id: 'cs-q1',
          question: 'What is the most important aspect of active listening?',
          options: ['Speaking clearly', 'Understanding the complete message', 'Taking notes', 'Responding quickly'],
          correctAnswer: 1
        },
        {
          id: 'cs-q2',
          question: 'Which of these is NOT a form of non-verbal communication?',
          options: ['Body language', 'Tone of voice', 'Written words', 'Facial expressions'],
          correctAnswer: 2
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'resume-writing-workshop',
    title: 'Resume Writing Workshop',
    description: 'Create a compelling resume that stands out to recruiters and lands you interviews.',
    duration: '1 week',
    level: 'Beginner',
    price: 'Free',
    category: 'Career',
    instructor: 'Patricia Chen',
    modules: [
      {
        id: 'rw-mod1',
        title: 'Resume Essentials',
        description: 'Learn the fundamentals of effective resume writing',
        lessons: [
          {
            id: 'rw-lesson1',
            title: 'Resume Structure and Format',
            content: `# Resume Structure and Format

A well-structured resume is crucial for making a strong first impression on potential employers.

## Essential Sections:
1. **Contact Information**: Name, phone, email, LinkedIn
2. **Professional Summary**: 2-3 sentence overview
3. **Work Experience**: Reverse chronological order
4. **Education**: Degrees, certifications, relevant coursework
5. **Skills**: Technical and soft skills
6. **Optional**: Projects, volunteer work, awards

## Formatting Best Practices:
- Keep it to 1-2 pages maximum
- Use clean, professional fonts (Arial, Calibri, Times New Roman)
- Maintain consistent formatting
- Use bullet points for readability
- Include white space to avoid clutter
- Save as PDF unless specified otherwise`,
            duration: '15 min',
            type: 'text'
          },
          {
            id: 'rw-lesson2',
            title: 'Writing Achievement Statements',
            content: `# Writing Achievement Statements

Transform your job descriptions into powerful achievement statements that showcase your value.

## STAR Method:
- **Situation**: Context or challenge
- **Task**: Your responsibility
- **Action**: Steps you took
- **Result**: Quantifiable outcome

## Examples:
- Weak: "Responsible for managing social media accounts"
- Strong: "Increased social media engagement by 45% over 6 months by implementing a content calendar and engaging with followers daily"

- Weak: "Helped with customer service"
- Strong: "Resolved 95% of customer inquiries on first contact, reducing response time by 30%"

## Action Verbs:
- Managed, Led, Developed, Created, Implemented
- Increased, Reduced, Improved, Streamlined, Optimized
- Collaborated, Coordinated, Mentored, Trained, Supervised`,
            duration: '20 min',
            type: 'text'
          }
        ]
      }
    ],
    finalAssessment: {
      questions: [
        {
          id: 'rw-q1',
          question: 'What does the "R" stand for in the STAR method?',
          options: ['Responsibility', 'Reference', 'Result', 'Role'],
          correctAnswer: 2
        },
        {
          id: 'rw-q2',
          question: 'What is the maximum recommended length for a resume?',
          options: ['1 page', '2 pages', '3 pages', 'No limit'],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'hospitality-fundamentals',
    title: 'Hospitality Fundamentals',
    description: 'Master the essential skills and principles for exceptional service in the hospitality industry.',
    duration: '4 weeks',
    level: 'Beginner',
    price: 'Free',
    category: 'Core Hospitality',
    instructor: 'Michael Roberts',
    modules: [
      {
        id: 'hf-mod1',
        title: 'Introduction to Hospitality',
        description: 'Learn the foundations of hospitality service excellence',
        lessons: [
          {
            id: 'hf-lesson1',
            title: 'Understanding Hospitality Industry',
            content: `# Understanding Hospitality Industry

The hospitality industry encompasses businesses that provide services to guests, including hotels, restaurants, tourism, and entertainment.

## Key Sectors:
- **Accommodation**: Hotels, resorts, motels, vacation rentals
- **Food & Beverage**: Restaurants, bars, catering, room service
- **Travel & Tourism**: Airlines, tour operators, travel agencies
- **Recreation**: Theme parks, casinos, sports facilities

## Core Principles:
- Customer service excellence
- Attention to detail
- Cultural awareness
- Problem-solving skills
- Team collaboration

## Industry Trends:
- Technology integration
- Sustainability focus
- Personalized experiences
- Health and safety protocols`,
            duration: '25 min',
            type: 'text'
          },
          {
            id: 'hf-lesson2',
            title: 'Service Excellence Standards',
            content: `# Service Excellence Standards

Delivering exceptional service is the cornerstone of hospitality success. Learn the standards that set leading establishments apart.

## Service Standards:
- **Greeting**: Warm, professional welcome within 30 seconds
- **Communication**: Clear, respectful, and attentive listening
- **Efficiency**: Prompt service without rushing guests
- **Problem Resolution**: Address issues quickly and professionally
- **Personalization**: Remember guest preferences and special requests

## Key Skills:
- Active listening
- Non-verbal communication
- Cultural sensitivity
- Time management
- Conflict resolution

## Measuring Excellence:
- Guest satisfaction scores
- Repeat business rates
- Online reviews and ratings
- Employee performance metrics`,
            duration: '30 min',
            type: 'text'
          }
        ]
      }
    ],
    finalAssessment: {
      questions: [
        {
          id: 'hf-q1',
          question: 'What is the recommended maximum time to greet a guest?',
          options: ['15 seconds', '30 seconds', '1 minute', '2 minutes'],
          correctAnswer: 1
        },
        {
          id: 'hf-q2',
          question: 'Which is NOT a key sector of hospitality?',
          options: ['Accommodation', 'Manufacturing', 'Food & Beverage', 'Travel & Tourism'],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    }
  },
  {
    id: 'front-office-management',
    title: 'Front Office Management',
    description: 'Develop expertise in managing hotel front office operations, guest relations, and administrative excellence.',
    duration: '6 weeks',
    level: 'Intermediate',
    price: '₦85,000',
    category: 'Core Hospitality',
    instructor: 'Sarah Mitchell',
    modules: [
      {
        id: 'fo-mod1',
        title: 'Front Office Operations',
        description: 'Master the core functions of hotel front office management',
        lessons: [
          {
            id: 'fo-lesson1',
            title: 'Check-in and Check-out Procedures',
            content: `# Check-in and Check-out Procedures

Efficient check-in and check-out processes are critical for guest satisfaction and hotel operations.

## Check-in Process:
1. **Greeting**: Welcome guests warmly
2. **Verification**: Confirm reservation and identity
3. **Registration**: Complete necessary paperwork
4. **Payment**: Secure payment method
5. **Room Assignment**: Provide room keys and information
6. **Orientation**: Explain hotel facilities and services

## Check-out Process:
1. **Billing Review**: Present final bill
2. **Payment Settlement**: Process final payment
3. **Feedback**: Request guest feedback
4. **Luggage Assistance**: Help with luggage if needed
5. **Farewell**: Warm goodbye and invitation to return

## Best Practices:
- Use guest name consistently
- Offer upselling opportunities
- Handle special requests efficiently
- Maintain accuracy in all transactions
- Ensure privacy and security`,
            duration: '35 min',
            type: 'text'
          }
        ]
      }
    ],
    finalAssessment: {
      questions: [
        {
          id: 'fo-q1',
          question: 'What is the first step in the check-in process?',
          options: ['Payment', 'Greeting', 'Room Assignment', 'Registration'],
          correctAnswer: 1
        },
        {
          id: 'fo-q2',
          question: 'Why is guest feedback important during check-out?',
          options: ['Marketing research', 'Service improvement', 'Legal requirement', 'Company policy'],
          correctAnswer: 1
        }
      ],
      passingScore: 75
    }
  }
];

export default coursesData;
