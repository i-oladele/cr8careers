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
,
  {
    id: 'front-desk-excellence',
    title: 'Front Desk Excellence: Mastering Guest Experience from First Contact to Check-Out',
    description: 'Equip hospitality professionals with the practical skills and knowledge required to deliver exceptional customer experiences — from first impression to check-out and beyond.',
    duration: '4 weeks',
    level: 'Beginner',
    price: 'Free',
    category: 'Hospitality',
    instructor: 'CR8Careers',
    modules: [
      {
        id: 'fde-intro',
        title: 'Course Introduction',
        description: 'Overview of the course and its objectives',
        lessons: [
          {
            id: 'fde-intro-l1',
            title: 'Welcome to Front Desk Excellence',
            duration: '10 min',
            type: 'text',
            content: `<h2>Welcome to Front Desk Excellence</h2>
<p>In today's highly competitive hospitality industry, delivering good service is no longer enough. Guests are no longer just looking for a place to stay — they are seeking experiences that make them feel valued, respected, and remembered. From the moment a guest makes an inquiry to the point of check-out and even beyond, every interaction shapes their perception of your brand.</p>
<p>Over time, working with and training diverse teams across multiple locations, one recurring pattern stands out clearly: the gap between average-performing organisations and exceptional ones is not defined by infrastructure, but by <strong>people, processes, and consistency</strong>. Businesses that thrive are those that understand that every staff member — especially those at the front line — plays a critical role in shaping customer perception and driving long-term loyalty.</p>
<p>The front desk, in particular, serves as the <strong>heartbeat of the customer experience</strong>. It is the first point of physical contact and often the last interaction a guest has before leaving. A warm, professional welcome can instantly build trust and set a positive tone, while a poor interaction — no matter how small — can completely diminish the value of every other service offered.</p>
<h3>What You Will Learn</h3>
<ul>
  <li>The core principles of customer experience in hospitality</li>
  <li>How to understand guest expectations and behaviour</li>
  <li>Effective communication and professional conduct</li>
  <li>How to handle challenges in a way that strengthens relationships</li>
  <li>Service standards, emotional intelligence, and structured processes</li>
</ul>
<blockquote><em>"Guests may forget the details of their stay — but they will never forget how they were made to feel."</em></blockquote>
<p>By the end of this course, you will not only understand what great service looks like, but also how to deliver it confidently and consistently in your daily role.</p>`
          }
        ]
      },
      {
        id: 'fde-mod1',
        title: 'Module 1: Understanding Customer Experience in Hospitality',
        description: 'Learn what customer experience means and the key stages that shape guest perception',
        lessons: [
          {
            id: 'fde-m1-l1',
            title: 'What is Customer Experience?',
            duration: '20 min',
            type: 'text',
            content: `<h2>Understanding Customer Experience in Hospitality</h2>
<p>Customer Experience (CX) in hospitality refers to the <strong>overall perception a guest forms</strong> about a hotel or service provider based on all interactions before, during, and after their stay. It is not limited to the physical product or service delivered, but extends to the emotional and psychological impression left on the customer.</p>
<p>In today's hospitality environment, customers are no longer satisfied with basic service delivery. They expect intentional, seamless, and memorable experiences. This means that every touchpoint — whether physical, digital, or human — must be carefully managed to ensure consistency and satisfaction.</p>
<h3>Key Stages of Customer Experience</h3>
<h4>1. Pre-Arrival Stage</h4>
<p>This includes how customers discover and interact with your brand before visiting.</p>
<ul>
  <li>Online presence (social media, website)</li>
  <li>Inquiry handling</li>
  <li>Booking process</li>
</ul>
<p><em>A slow or unprofessional response at this stage can discourage potential guests.</em></p>
<h4>2. Arrival Stage (First Impression)</h4>
<p>This is where perception is instantly formed.</p>
<ul>
  <li>Reception greeting</li>
  <li>Staff appearance</li>
  <li>Environment</li>
</ul>
<p><em>Research shows guests form judgements within seconds.</em></p>
<h4>3. Stay Stage (Core Experience)</h4>
<p>This is where expectations must be met or exceeded.</p>
<ul>
  <li>Room condition</li>
  <li>Service delivery</li>
  <li>Staff responsiveness</li>
</ul>
<h4>4. Service Recovery Stage (Problem Handling)</h4>
<p>Mistakes are inevitable, but response defines the outcome.</p>
<ul>
  <li>Speed of response</li>
  <li>Professionalism</li>
  <li>Solution delivery</li>
</ul>
<p><em>A well-handled issue can increase loyalty.</em></p>
<h4>5. Departure Stage (Last Impression)</h4>
<ul>
  <li>Check-out process</li>
  <li>Final communication</li>
</ul>
<h4>6. Post-Stay Stage (Retention)</h4>
<ul>
  <li>Follow-ups</li>
  <li>Feedback</li>
  <li>Promotions</li>
</ul>
<blockquote><strong>Key Insight:</strong> Customer experience is not accidental — it is designed, structured, and consistently delivered.</blockquote>`
          },
          {
            id: 'fde-m1-quiz',
            title: 'Module 1 Quiz',
            duration: '10 min',
            type: 'quiz',
            content: '',
            quizQuestions: [
              {
                id: 'fde-m1-q1',
                question: 'Customer experience refers to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Only the service delivered' },
                  { id: 'b', text: 'The total perception formed by customers' },
                  { id: 'c', text: 'The price of the service' },
                  { id: 'd', text: 'The building structure' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m1-q2',
                question: 'Which stage involves first physical interaction?',
                type: 'single',
                options: [
                  { id: 'a', text: 'Pre-arrival' },
                  { id: 'b', text: 'Stay' },
                  { id: 'c', text: 'Arrival' },
                  { id: 'd', text: 'Post-stay' },
                ],
                correctAnswers: ['c'],
              },
              {
                id: 'fde-m1-q3',
                question: 'What is the most critical stage for first impression?',
                type: 'single',
                options: [
                  { id: 'a', text: 'Departure' },
                  { id: 'b', text: 'Arrival' },
                  { id: 'c', text: 'Post-stay' },
                  { id: 'd', text: 'Booking' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m1-q4',
                question: 'Service recovery refers to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Marketing' },
                  { id: 'b', text: 'Complaint handling' },
                  { id: 'c', text: 'Staff recruitment' },
                  { id: 'd', text: 'Pricing strategy' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m1-q5',
                question: 'Post-stay engagement helps to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Reduce cost' },
                  { id: 'b', text: 'Build customer loyalty' },
                  { id: 'c', text: 'Increase workload' },
                  { id: 'd', text: 'Avoid communication' },
                ],
                correctAnswers: ['b'],
              },
            ]
          }
        ]
      },
      {
        id: 'fde-mod2',
        title: 'Module 2: The Psychology of Guests & Expectations',
        description: 'Understand how guests think, what they expect, and how emotion drives satisfaction',
        lessons: [
          {
            id: 'fde-m2-l1',
            title: 'How Guests Think and Feel',
            duration: '20 min',
            type: 'text',
            content: `<h2>The Psychology of Guests & Expectations</h2>
<p>Understanding customer psychology is critical in hospitality because service is people-driven and emotion-based. Guests do not only evaluate <em>what</em> they receive — they evaluate <em>how it makes them feel</em>.</p>
<p>Customers arrive with expectations shaped by past experiences, brand reputation, and personal standards. When these expectations are:</p>
<ul>
  <li><strong>Met</strong> → Satisfaction</li>
  <li><strong>Exceeded</strong> → Loyalty</li>
  <li><strong>Not met</strong> → Dissatisfaction</li>
</ul>
<h3>Core Guest Expectations</h3>
<h4>1. Respect and Recognition</h4>
<p>Guests expect to be treated with dignity and importance. Simple gestures like greeting by name and maintaining eye contact make a significant difference.</p>
<h4>2. Speed and Efficiency</h4>
<p>Time is highly valued by guests. Delays — even small ones — create frustration that can overshadow an otherwise good experience.</p>
<h4>3. Personalization</h4>
<p>Guests want to feel unique, not treated like numbers.</p>
<ul>
  <li>Use of names</li>
  <li>Remembering preferences</li>
</ul>
<h4>4. Consistency</h4>
<p>Customers expect the same quality of service every single time they interact with your brand.</p>
<h4>5. Emotional Comfort</h4>
<p>Guests want to feel relaxed, safe, and appreciated throughout their entire stay.</p>
<h3>Emotional Triggers in Hospitality</h3>
<p>Positive emotional triggers include a warm welcome, using a guest's name, proactive assistance, and genuine smiles. Negative triggers include being ignored, long wait times, dismissive responses, and inconsistency.</p>
<blockquote><strong>Key Insight:</strong> Customer satisfaction is not just logical — it is emotional.</blockquote>`
          },
          {
            id: 'fde-m2-quiz',
            title: 'Module 2 Quiz',
            duration: '10 min',
            type: 'quiz',
            content: '',
            quizQuestions: [
              {
                id: 'fde-m2-q1',
                question: 'Customer expectations are mainly based on:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Weather' },
                  { id: 'b', text: 'Past experiences' },
                  { id: 'c', text: 'Building size' },
                  { id: 'd', text: 'Staff salary' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m2-q2',
                question: 'When expectations are exceeded, the result is:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Complaint' },
                  { id: 'b', text: 'Loyalty' },
                  { id: 'c', text: 'Delay' },
                  { id: 'd', text: 'Confusion' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m2-q3',
                question: 'Which of the following creates frustration?',
                type: 'single',
                options: [
                  { id: 'a', text: 'Quick response' },
                  { id: 'b', text: 'Personalization' },
                  { id: 'c', text: 'Delay' },
                  { id: 'd', text: 'Recognition' },
                ],
                correctAnswers: ['c'],
              },
              {
                id: 'fde-m2-q4',
                question: 'Personalization means:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Treating everyone the same' },
                  { id: 'b', text: 'Ignoring guests' },
                  { id: 'c', text: 'Tailoring service to individuals' },
                  { id: 'd', text: 'Increasing price' },
                ],
                correctAnswers: ['c'],
              },
              {
                id: 'fde-m2-q5',
                question: 'Emotional connection leads to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Reduced service' },
                  { id: 'b', text: 'Customer loyalty' },
                  { id: 'c', text: 'Poor communication' },
                  { id: 'd', text: 'Confusion' },
                ],
                correctAnswers: ['b'],
              },
            ]
          }
        ]
      },
      {
        id: 'fde-mod3',
        title: 'Module 3: Service Standards & Consistency',
        description: 'Learn how defined service standards create reliability and trust',
        lessons: [
          {
            id: 'fde-m3-l1',
            title: 'Building a Foundation of Consistency',
            duration: '20 min',
            type: 'text',
            content: `<h2>Service Standards & Consistency</h2>
<p>Service standards are clearly defined guidelines that determine how service should be delivered. They ensure that every guest receives a consistent experience regardless of time, staff, or situation.</p>
<p>Without service standards, service delivery becomes:</p>
<ul>
  <li>Unpredictable</li>
  <li>Inconsistent</li>
  <li>Unreliable</li>
</ul>
<h3>Key Components of Service Standards</h3>
<h4>1. Standard Operating Procedures (SOPs)</h4>
<p>SOPs provide step-by-step instructions for key processes:</p>
<ul>
  <li>Greeting process</li>
  <li>Check-in process</li>
  <li>Complaint handling</li>
</ul>
<h4>2. Communication Standards</h4>
<ul>
  <li>Tone of voice</li>
  <li>Language and vocabulary</li>
  <li>Professionalism in all interactions</li>
</ul>
<h4>3. Appearance Standards</h4>
<ul>
  <li>Dress code and uniform</li>
  <li>Grooming</li>
  <li>Body language</li>
</ul>
<h4>4. Response Time Standards</h4>
<p>Defining the acceptable time taken to respond to requests, queries, and complaints.</p>
<h4>5. Monitoring & Evaluation</h4>
<ul>
  <li>Performance tracking</li>
  <li>Feedback analysis</li>
</ul>
<h3>Why Consistency Matters</h3>
<p>Consistency builds:</p>
<ul>
  <li><strong>Trust</strong> — guests know what to expect</li>
  <li><strong>Brand reputation</strong> — you become known for quality</li>
  <li><strong>Customer confidence</strong> — guests feel safe choosing you</li>
</ul>
<p>Inconsistency leads to confusion, complaints, and loss of customers.</p>
<blockquote><strong>Key Insight:</strong> Consistency transforms a business from average to professional.</blockquote>`
          },
          {
            id: 'fde-m3-quiz',
            title: 'Module 3 Quiz',
            duration: '10 min',
            type: 'quiz',
            content: '',
            quizQuestions: [
              {
                id: 'fde-m3-q1',
                question: 'Service standards are:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Random actions' },
                  { id: 'b', text: 'Defined service guidelines' },
                  { id: 'c', text: 'Marketing tools' },
                  { id: 'd', text: 'Financial plans' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m3-q2',
                question: 'SOP stands for:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Service Operation Plan' },
                  { id: 'b', text: 'Standard Operating Procedure' },
                  { id: 'c', text: 'Staff Organisation Policy' },
                  { id: 'd', text: 'Service Output Plan' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m3-q3',
                question: 'Consistency helps to build:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Confusion' },
                  { id: 'b', text: 'Trust' },
                  { id: 'c', text: 'Delay' },
                  { id: 'd', text: 'Errors' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m3-q4',
                question: 'Lack of standards leads to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Structure' },
                  { id: 'b', text: 'Consistency' },
                  { id: 'c', text: 'Poor service delivery' },
                  { id: 'd', text: 'Customer loyalty' },
                ],
                correctAnswers: ['c'],
              },
              {
                id: 'fde-m3-q5',
                question: 'Monitoring service helps to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Ignore issues' },
                  { id: 'b', text: 'Track performance' },
                  { id: 'c', text: 'Reduce communication' },
                  { id: 'd', text: 'Avoid customers' },
                ],
                correctAnswers: ['b'],
              },
            ]
          }
        ]
      },
      {
        id: 'fde-mod4',
        title: 'Module 4: Communication & Professional Conduct in Hospitality',
        description: 'Master verbal, non-verbal, and empathetic communication skills',
        lessons: [
          {
            id: 'fde-m4-l1',
            title: 'Communicating with Professionalism',
            duration: '20 min',
            type: 'text',
            content: `<h2>Communication & Professional Conduct in Hospitality</h2>
<p>Communication is one of the most critical components of customer experience in hospitality. It is not just about exchanging information — it is about <strong>creating clarity, building trust, and managing emotions</strong>.</p>
<p>Poor communication is responsible for a significant percentage of customer complaints, even when the actual service delivered is acceptable.</p>
<h3>Core Elements of Effective Communication</h3>
<h4>1. Verbal Communication</h4>
<p>This includes choice of words, tone of voice, and clarity of message. Staff must avoid:</p>
<ul>
  <li>Harsh or dismissive tone</li>
  <li>Slang or overly informal language</li>
  <li>Defensive responses</li>
</ul>
<h4>2. Non-Verbal Communication</h4>
<p>Often more powerful than words. This includes:</p>
<ul>
  <li>Eye contact — shows attentiveness</li>
  <li>Facial expressions — a smile alone can improve perception</li>
  <li>Posture — open and welcoming</li>
  <li>Gestures — deliberate and professional</li>
</ul>
<h4>3. Active Listening</h4>
<p>Listening to understand, not just to respond:</p>
<ul>
  <li>Allow the guest to speak fully without interruption</li>
  <li>Acknowledge their concerns</li>
  <li>Clarify when necessary</li>
</ul>
<h4>4. Empathy</h4>
<p>Understanding and acknowledging the guest's feelings:</p>
<ul>
  <li><em>"I understand how that must feel."</em></li>
  <li><em>"I apologise for the inconvenience."</em></li>
</ul>
<h4>5. Professional Language</h4>
<p>Staff should always be polite, respectful, and use structured communication. Avoid slang, avoid arguing, and always remain calm.</p>
<blockquote><strong>Key Insight:</strong> "Customers may forget what you said, but they will never forget how you made them feel through your communication."</blockquote>`
          },
          {
            id: 'fde-m4-quiz',
            title: 'Module 4 Quiz',
            duration: '10 min',
            type: 'quiz',
            content: '',
            quizQuestions: [
              {
                id: 'fde-m4-q1',
                question: 'Effective communication includes:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Only speaking' },
                  { id: 'b', text: 'Speaking and listening' },
                  { id: 'c', text: 'Ignoring guests' },
                  { id: 'd', text: 'Delaying response' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m4-q2',
                question: 'Non-verbal communication includes:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Emails' },
                  { id: 'b', text: 'Tone only' },
                  { id: 'c', text: 'Body language' },
                  { id: 'd', text: 'Pricing' },
                ],
                correctAnswers: ['c'],
              },
              {
                id: 'fde-m4-q3',
                question: 'Active listening means:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Interrupting' },
                  { id: 'b', text: 'Listening to respond' },
                  { id: 'c', text: 'Listening to understand' },
                  { id: 'd', text: 'Ignoring' },
                ],
                correctAnswers: ['c'],
              },
              {
                id: 'fde-m4-q4',
                question: 'Empathy involves:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Arguing' },
                  { id: 'b', text: 'Understanding feelings' },
                  { id: 'c', text: 'Ignoring complaints' },
                  { id: 'd', text: 'Delaying response' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m4-q5',
                question: 'Poor communication leads to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Loyalty' },
                  { id: 'b', text: 'Satisfaction' },
                  { id: 'c', text: 'Complaints' },
                  { id: 'd', text: 'Profit' },
                ],
                correctAnswers: ['c'],
              },
            ]
          }
        ]
      },
      {
        id: 'fde-mod5',
        title: 'Module 5: Handling Difficult Guests & Service Recovery',
        description: 'Learn how to resolve complaints professionally and turn problems into loyalty',
        lessons: [
          {
            id: 'fde-m5-l1',
            title: 'The L.E.A.R.N Framework',
            duration: '20 min',
            type: 'text',
            content: `<h2>Handling Difficult Guests & Service Recovery</h2>
<p>In hospitality, service failure is inevitable. However, what differentiates a professional organisation is <strong>how effectively it responds</strong> to these failures.</p>
<p>Service recovery is the process of resolving customer complaints in a way that restores trust and satisfaction.</p>
<h3>The L.E.A.R.N Framework</h3>
<h4>L — Listen</h4>
<p>Allow the guest to express themselves fully without interruption. Do not get defensive. Give them your complete attention.</p>
<h4>E — Empathize</h4>
<p>Acknowledge their feelings genuinely. <em>"I completely understand how frustrating that must be."</em></p>
<h4>A — Apologize</h4>
<p>Take responsibility, even if the issue is not entirely your fault. A sincere apology goes a long way in de-escalating tension.</p>
<h4>R — Resolve</h4>
<p>Provide a clear, fast, and practical solution. Where possible, offer options so the guest feels in control.</p>
<h4>N — Notify / Follow-Up</h4>
<p>Ensure the issue has been fully resolved. Check back with the guest to confirm their satisfaction.</p>
<h3>Types of Difficult Guests</h3>
<ul>
  <li><strong>Angry guests</strong> — require calm, non-defensive responses</li>
  <li><strong>Demanding guests</strong> — require clear communication of what is possible</li>
  <li><strong>Impatient guests</strong> — require speed and efficiency</li>
  <li><strong>Confused guests</strong> — require patience and clear explanations</li>
</ul>
<p>Each type requires calmness and professionalism above all else.</p>
<blockquote><strong>Key Insight:</strong> "A complaint is not a threat — it is an opportunity to build stronger customer loyalty."</blockquote>`
          },
          {
            id: 'fde-m5-quiz',
            title: 'Module 5 Quiz',
            duration: '10 min',
            type: 'quiz',
            content: '',
            quizQuestions: [
              {
                id: 'fde-m5-q1',
                question: 'Service recovery refers to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Marketing' },
                  { id: 'b', text: 'Complaint resolution' },
                  { id: 'c', text: 'Pricing' },
                  { id: 'd', text: 'Staffing' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m5-q2',
                question: 'The first step in handling complaints is:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Argue' },
                  { id: 'b', text: 'Listen' },
                  { id: 'c', text: 'Ignore' },
                  { id: 'd', text: 'Delay' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m5-q3',
                question: 'Empathy helps to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Increase conflict' },
                  { id: 'b', text: 'Calm the guest' },
                  { id: 'c', text: 'Delay service' },
                  { id: 'd', text: 'Avoid responsibility' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m5-q4',
                question: 'A fast solution leads to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'More complaints' },
                  { id: 'b', text: 'Customer satisfaction' },
                  { id: 'c', text: 'Confusion' },
                  { id: 'd', text: 'Delay' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m5-q5',
                question: 'Difficult guests should be handled with:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Anger' },
                  { id: 'b', text: 'Patience' },
                  { id: 'c', text: 'Ignorance' },
                  { id: 'd', text: 'Silence' },
                ],
                correctAnswers: ['b'],
              },
            ]
          }
        ]
      },
      {
        id: 'fde-mod6',
        title: 'Module 6: Using Feedback & Data to Improve Service',
        description: 'Understand how to collect, analyse, and act on customer feedback',
        lessons: [
          {
            id: 'fde-m6-l1',
            title: 'Turning Feedback into Improvement',
            duration: '20 min',
            type: 'text',
            content: `<h2>Using Feedback & Data to Improve Service</h2>
<p>Feedback is one of the most valuable tools for business improvement. It provides direct insight into customer expectations, satisfaction levels, and service gaps.</p>
<p>Organisations that ignore feedback remain stagnant, while those that analyse and act on it <strong>continuously improve</strong>.</p>
<h3>Sources of Feedback</h3>
<ul>
  <li>Customer complaints</li>
  <li>Online reviews (Google, TripAdvisor, social media)</li>
  <li>Guest satisfaction surveys</li>
  <li>Direct conversations at check-out</li>
</ul>
<h3>Using Feedback Effectively</h3>
<ol>
  <li><strong>Collect data consistently</strong> — make it easy for guests to share feedback</li>
  <li><strong>Identify patterns</strong> — look for recurring themes across multiple responses</li>
  <li><strong>Take corrective action</strong> — assign responsibility and set timelines</li>
  <li><strong>Monitor improvement</strong> — track whether changes have had the desired effect</li>
</ol>
<h3>Data-Driven Decision Making</h3>
<p>Using data helps organisations to:</p>
<ul>
  <li>Improve service processes with evidence</li>
  <li>Identify recurring issues before they escalate</li>
  <li>Measure team and individual performance objectively</li>
</ul>
<h3>Responding to Online Reviews</h3>
<p>Whether a review is positive or negative, always respond professionally. Thank guests for positive feedback and address negative feedback with empathy and a clear resolution.</p>
<blockquote><strong>Key Insight:</strong> "Feedback is not criticism — it is direction for improvement."</blockquote>`
          },
          {
            id: 'fde-m6-quiz',
            title: 'Module 6 Quiz',
            duration: '10 min',
            type: 'quiz',
            content: '',
            quizQuestions: [
              {
                id: 'fde-m6-q1',
                question: 'Feedback helps to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Increase confusion' },
                  { id: 'b', text: 'Improve service' },
                  { id: 'c', text: 'Reduce customers' },
                  { id: 'd', text: 'Delay operations' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m6-q2',
                question: 'One source of feedback is:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Weather' },
                  { id: 'b', text: 'Online reviews' },
                  { id: 'c', text: 'Salary' },
                  { id: 'd', text: 'Furniture' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m6-q3',
                question: 'Data helps to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Ignore issues' },
                  { id: 'b', text: 'Track performance' },
                  { id: 'c', text: 'Delay service' },
                  { id: 'd', text: 'Reduce effort' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m6-q4',
                question: 'Ignoring feedback leads to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Growth' },
                  { id: 'b', text: 'Improvement' },
                  { id: 'c', text: 'Stagnation' },
                  { id: 'd', text: 'Loyalty' },
                ],
                correctAnswers: ['c'],
              },
              {
                id: 'fde-m6-q5',
                question: 'Feedback should be:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Ignored' },
                  { id: 'b', text: 'Collected and used' },
                  { id: 'c', text: 'Deleted' },
                  { id: 'd', text: 'Avoided' },
                ],
                correctAnswers: ['b'],
              },
            ]
          }
        ]
      },
      {
        id: 'fde-mod7',
        title: 'Module 7: Building High-Performing Service Teams',
        description: 'Learn how to recruit, train, motivate, and retain great hospitality staff',
        lessons: [
          {
            id: 'fde-m7-l1',
            title: 'People Are Your Greatest Asset',
            duration: '20 min',
            type: 'text',
            content: `<h2>Building High-Performing Service Teams</h2>
<p>A business is only as good as its people. In hospitality, staff are the <strong>direct representation of the brand</strong>. No amount of infrastructure or marketing can compensate for a poorly trained or unmotivated team.</p>
<p>High-performing teams are built through proper recruitment, continuous training, clear expectations, and meaningful motivation.</p>
<h3>Key Elements</h3>
<h4>1. Hiring for Attitude</h4>
<p>Skills can be taught — attitude is much harder to change. When recruiting for front desk and guest-facing roles, prioritise candidates who demonstrate:</p>
<ul>
  <li>Warmth and genuine care for people</li>
  <li>Patience and emotional resilience</li>
  <li>A positive, solutions-focused mindset</li>
</ul>
<h4>2. Continuous Training</h4>
<p>Regular development improves performance and keeps staff aligned with your service standards. Training should not be a one-off event — it should be an ongoing culture.</p>
<ul>
  <li>On-the-job coaching</li>
  <li>Structured learning programmes</li>
  <li>Role-play and scenario practice</li>
</ul>
<h4>3. Performance Monitoring</h4>
<p>Tracking performance ensures accountability and helps identify both high performers and those who need additional support.</p>
<ul>
  <li>Guest satisfaction scores</li>
  <li>Mystery guest evaluations</li>
  <li>Peer and supervisor feedback</li>
</ul>
<h4>4. Motivation & Recognition</h4>
<p>Employees perform better when they feel appreciated. Recognition does not have to be financial — public acknowledgement, growth opportunities, and genuine praise go a long way.</p>
<blockquote><strong>Key Insight:</strong> "Train your staff well enough so they can perform, and treat them well enough so they <em>want</em> to perform."</blockquote>`
          },
          {
            id: 'fde-m7-quiz',
            title: 'Module 7 Quiz',
            duration: '10 min',
            type: 'quiz',
            content: '',
            quizQuestions: [
              {
                id: 'fde-m7-q1',
                question: 'High-performing teams require:',
                type: 'single',
                options: [
                  { id: 'a', text: 'No training' },
                  { id: 'b', text: 'Structure and support' },
                  { id: 'c', text: 'Ignorance' },
                  { id: 'd', text: 'Delay' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m7-q2',
                question: 'Hiring should focus on:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Salary' },
                  { id: 'b', text: 'Attitude' },
                  { id: 'c', text: 'Location' },
                  { id: 'd', text: 'Age' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m7-q3',
                question: 'Training helps to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Reduce performance' },
                  { id: 'b', text: 'Improve skills' },
                  { id: 'c', text: 'Increase confusion' },
                  { id: 'd', text: 'Delay work' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m7-q4',
                question: 'Motivation leads to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Low productivity' },
                  { id: 'b', text: 'High performance' },
                  { id: 'c', text: 'Confusion' },
                  { id: 'd', text: 'Complaints' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m7-q5',
                question: 'Staff represent:',
                type: 'single',
                options: [
                  { id: 'a', text: 'The building' },
                  { id: 'b', text: 'The brand' },
                  { id: 'c', text: 'The furniture' },
                  { id: 'd', text: 'The system' },
                ],
                correctAnswers: ['b'],
              },
            ]
          }
        ]
      },
      {
        id: 'fde-mod8',
        title: 'Module 8: Turning Service into a Competitive Advantage',
        description: 'Discover how exceptional service drives loyalty, referrals, and revenue growth',
        lessons: [
          {
            id: 'fde-m8-l1',
            title: 'Service as a Business Strategy',
            duration: '20 min',
            type: 'text',
            content: `<h2>Turning Service into a Competitive Advantage</h2>
<p>In today's competitive market, service quality is one of the most powerful differentiators available to any hospitality business. Products and facilities can be copied — but a culture of exceptional service is very hard to replicate.</p>
<p>Businesses that deliver exceptional experiences gain:</p>
<ul>
  <li><strong>Customer loyalty</strong> — guests choose you repeatedly</li>
  <li><strong>Repeat business</strong> — lower cost to maintain than acquiring new guests</li>
  <li><strong>Positive referrals</strong> — your satisfied guests become your best marketers</li>
</ul>
<h3>Key Concepts</h3>
<h4>1. Customer Retention vs Acquisition</h4>
<p>It costs significantly more to acquire a new customer than to retain an existing one. Investing in the experience of current guests yields a higher return on investment.</p>
<h4>2. Word-of-Mouth Marketing</h4>
<p>Satisfied customers promote your business to their networks — often more effectively than paid advertising. One exceptional experience can generate multiple new guests.</p>
<h4>3. Brand Reputation</h4>
<p>Consistency in service delivery builds a strong, recognisable brand reputation. Over time, this reputation becomes a business asset that attracts both guests and talent.</p>
<h4>4. Revenue Growth</h4>
<p>Better service leads to higher guest satisfaction scores, better reviews, increased occupancy, and ultimately more revenue. Service excellence is not a cost — it is an investment.</p>
<h3>Course Conclusion</h3>
<p>Delivering exceptional customer experience in hospitality is not accidental — it is <strong>intentional, structured, and consistently practised</strong>. Throughout this course, we have explored the critical elements that transform ordinary service into memorable experiences.</p>
<p>Customer experience is built across multiple touchpoints — from the first interaction to the final departure — and each of these moments plays a vital role in shaping customer perception. By applying the principles discussed in this course, you can improve customer satisfaction, strengthen brand reputation, and drive business growth.</p>
<blockquote><strong>Key Insight:</strong> "Your best marketing strategy is a satisfied customer."</blockquote>`
          },
          {
            id: 'fde-m8-quiz',
            title: 'Module 8 Quiz',
            duration: '10 min',
            type: 'quiz',
            content: '',
            quizQuestions: [
              {
                id: 'fde-m8-q1',
                question: 'Competitive advantage comes from:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Poor service' },
                  { id: 'b', text: 'Exceptional service' },
                  { id: 'c', text: 'Delay' },
                  { id: 'd', text: 'Complaints' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m8-q2',
                question: 'Retaining customers is:',
                type: 'single',
                options: [
                  { id: 'a', text: 'More expensive' },
                  { id: 'b', text: 'Cheaper than acquiring new ones' },
                  { id: 'c', text: 'Impossible' },
                  { id: 'd', text: 'Unnecessary' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m8-q3',
                question: 'Happy customers lead to:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Complaints' },
                  { id: 'b', text: 'Referrals' },
                  { id: 'c', text: 'Loss' },
                  { id: 'd', text: 'Confusion' },
                ],
                correctAnswers: ['b'],
              },
              {
                id: 'fde-m8-q4',
                question: 'Good service improves:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Reputation' },
                  { id: 'b', text: 'Delay' },
                  { id: 'c', text: 'Confusion' },
                  { id: 'd', text: 'Errors' },
                ],
                correctAnswers: ['a'],
              },
              {
                id: 'fde-m8-q5',
                question: 'Customer experience impacts:',
                type: 'single',
                options: [
                  { id: 'a', text: 'Nothing' },
                  { id: 'b', text: 'Revenue' },
                  { id: 'c', text: 'Weather' },
                  { id: 'd', text: 'Furniture' },
                ],
                correctAnswers: ['b'],
              },
            ]
          }
        ]
      }
    ]
  }
];

export default coursesData;
