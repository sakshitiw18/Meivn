/**
 * Derives the solution focus / domain from a project requirement text.
 * Pure, deterministic helper with keyword-to-domain mapping.
 *
 * @param {string} requirement - The user request / project description
 * @returns {string} The project domain (e.g. "Education / Student Management")
 */
const DOMAIN_RULES = [
  {
    keywords: ['library', 'books'],
    domain: 'Education / Library Management',
  },
  {
    keywords: ['student', 'school', 'college', 'university', 'attendance', 'grading'],
    domain: 'Education / Student Management',
  },
  {
    keywords: ['spam', 'phishing', 'email security', 'fraud detection'],
    domain: 'Machine Learning / Email Security',
  },
  {
    keywords: ['chatbot', 'chat bot', 'conversational ai', 'nlp'],
    domain: 'Artificial Intelligence / Chatbot (NLP)',
  },
  {
    keywords: ['collaborative project', 'project management', 'collaboration'],
    domain: 'Project Management / Collaboration',
  },
  {
    keywords: ['to-do', 'todo', 'task management', 'task tracker'],
    domain: 'Productivity / Task Management',
  },
  {
    keywords: ['e-commerce', 'ecommerce', 'shopping cart', 'online store', 'marketplace'],
    domain: 'E-Commerce / Web Application',
  },
  {
    keywords: ['expense', 'budget', 'finance', 'invoice', 'accounting'],
    domain: 'Finance / Expense Tracking',
  },
  {
    keywords: ['resume', 'cv analyzer', 'job applicant', 'recruiting'],
    domain: 'Human Resources / AI Analysis',
  },
  {
    keywords: ['customer-support', 'customer support', 'support ticket', 'helpdesk'],
    domain: 'Customer Support / AI Automation',
  },
  {
    keywords: ['coding assistant', 'code assistant', 'code generator', 'code review'],
    domain: 'Developer Tools / AI Assistant',
  },
  {
    keywords: ['temperature converter', 'converter', 'cli tool', 'cli utility'],
    domain: 'Developer Tools / CLI Utility',
  },
  {
    keywords: ['hospital', 'healthcare', 'medical', 'patient', 'doctor', 'clinic'],
    domain: 'Healthcare / Medical Management',
  },
  {
    keywords: ['social media', 'social network', 'feed', 'post', 'followers'],
    domain: 'Social Media / Networking',
  },
  {
    keywords: ['weather', 'forecast'],
    domain: 'Weather / Data Analytics',
  },
  {
    keywords: ['machine learning', 'deep learning', 'computer vision', 'classifier'],
    domain: 'Machine Learning / Data Science',
  },
  {
    keywords: ['ai', 'artificial intelligence'],
    domain: 'Artificial Intelligence / Automation',
  },
  {
    keywords: ['rest api', 'api', 'backend', 'microservice'],
    domain: 'Backend / Web Services',
  },
  {
    keywords: ['website', 'web app', 'web application', 'portal', 'dashboard'],
    domain: 'Web Application / Frontend',
  },
  {
    keywords: ['mobile app', 'android', 'ios'],
    domain: 'Mobile Development / Application',
  },
]

export function getProjectDomain(requirement) {
  if (!requirement || typeof requirement !== 'string') {
    return 'Software Development'
  }

  const text = requirement.toLowerCase().trim()
  if (!text) {
    return 'Software Development'
  }

  for (const rule of DOMAIN_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return rule.domain
    }
  }

  return 'Software Development'
}
