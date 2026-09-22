export const DEMO_AGENTS = [
  { id: 'router', name: 'Router Agent', role: 'Orchestrator', desc: 'Coordinates the entire workflow.' },
  { id: 'research', name: 'Research Agent', role: 'Research Specialist', desc: 'Analyzes requirements and gathers relevant information.' },
  { id: 'coding', name: 'Coding Agent', role: 'Development Specialist', desc: 'Generates and improves code.' },
  { id: 'database', name: 'Database Agent', role: 'Data Specialist', desc: 'Designs database structures and SQL schemas.' },
  { id: 'reviewer', name: 'Reviewer Agent', role: 'Quality Specialist', desc: 'Checks generated outputs and identifies issues.' },
  { id: 'docs', name: 'Documentation Agent', role: 'Documentation Specialist', desc: 'Creates reports, documentation and summaries.' }
]
export const DASHBOARD_STATS = [
  {
    icon: 'fa-robot',
    value: '5',
    label: 'Active Agents'
  },
  {
    icon: 'fa-folder',
    value: '12',
    label: 'Projects'
  },
  {
    icon: 'fa-check',
    value: '48',
    label: 'Tasks Completed'
  },
  {
    icon: 'fa-chart-line',
    value: '94%',
    label: 'Workflow Success'
  }
]

export const DEMO_PROJECTS = [
  { id: 1, name: 'E-Commerce Platform', desc: 'Full-featured online store with payments.', status: 'Completed', agents: 6, updated: '2 days ago' },
  { id: 2, name: 'Student Management System', desc: 'Manage students, courses, and results.', status: 'In Progress', agents: 5, updated: '5 hours ago' },
  { id: 3, name: 'AI Chatbot', desc: 'Conversational AI using Gemini API.', status: 'Completed', agents: 4, updated: '1 week ago' },
  { id: 4, name: 'Spam Email Detector', desc: 'ML-based spam classification.', status: 'Draft', agents: 3, updated: '3 days ago' }
]

export const SETTINGS_NAV = [
  { id: 'account', icon: 'fa-user', label: 'Account' },
  { id: 'appearance', icon: 'fa-palette', label: 'Appearance' },
  { id: 'memory', icon: 'fa-database', label: 'Memory & Personalization' },
  { id: 'privacy', icon: 'fa-lock', label: 'Privacy & Data' },
  { id: 'security', icon: 'fa-shield-alt', label: 'Security' },
  { id: 'connected', icon: 'fa-plug', label: 'Connected Apps' },
  { id: 'accessibility', icon: 'fa-universal-access', label: 'Accessibility' },
  { id: 'help', icon: 'fa-question-circle', label: 'Help & Support' }
]