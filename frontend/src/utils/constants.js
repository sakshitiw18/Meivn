export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large' },
  { id: 'newproject', label: 'New Project', icon: 'fa-plus-circle' },
  { id: 'workflow', label: 'Agent Workflow', icon: 'fa-diagram-project' },
  { id: 'projects', label: 'Projects', icon: 'fa-folder' },
  { id: 'settings', label: 'Settings', icon: 'fa-sliders-h' }
]

export const FEATURES = [
  { icon: 'fa-brain', title: 'Intelligent Planning', desc: 'Break complex requirements into manageable subtasks.' },
  { icon: 'fa-arrows-alt-h', title: 'Agent Orchestration', desc: 'Coordinate multiple specialized AI agents through a structured workflow.' },
  { icon: 'fa-code', title: 'Code Generation', desc: 'Generate and improve software code using AI.' },
  { icon: 'fa-database', title: 'Database Intelligence', desc: 'Design schemas and database structures based on project requirements.' },
  { icon: 'fa-search', title: 'AI Review', desc: 'Review generated outputs and identify potential issues.' },
  { icon: 'fa-file-alt', title: 'Automated Documentation', desc: 'Generate structured project documentation and reports.' }
]

export const TECH_STACK = [
  { name: 'React.js', label: 'Frontend' },
  { name: 'Python', label: 'Backend / AI' },
  { name: 'FastAPI', label: 'REST API' },
  { name: 'LangGraph', label: 'Agent Workflow' },
  { name: 'LangChain', label: 'LLM / Agent Integration' },
  { name: 'Gemini API', label: 'AI Model' },
  { name: 'MySQL', label: 'SQL Database' },
  { name: 'Vector Database', label: 'Semantic Retrieval' },
  { name: 'Memory Store', label: 'Shared Context' },
  { name: 'Git & GitHub', label: 'Version Control' }
]

export const WORKFLOW_STEPS = [
  'Describe', 'Plan', 'Collaborate', 'Review', 'Deliver'
]

export const WORKFLOW_STEP_DESCS = [
  'User provides requirement.',
  'Router breaks into subtasks.',
  'Agents perform tasks.',
  'Reviewer checks outputs.',
  'Documentation combines results.'
]

export const EXAMPLE_PROMPTS = [
  'Build an e-commerce website',
  'Create a student management system',
  'Build a spam email detector',
  'Create an AI chatbot'
]

export const DASHBOARD_STATS = [
  { label: 'Active Agents', value: '6', icon: 'fa-robot' },
  { label: 'Projects', value: '12', icon: 'fa-folder' },
  { label: 'Tasks Completed', value: '48', icon: 'fa-check' },
  { label: 'Workflow Success', value: '94%', icon: 'fa-chart-line' }
]