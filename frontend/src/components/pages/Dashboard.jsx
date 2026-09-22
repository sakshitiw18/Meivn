import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DASHBOARD_STATS } from '../../data/demoData'
import { getTasks } from '../../services/api'

const STATUS_LABELS = {
  pending: 'Pending',
  running: 'In Progress',
  completed: 'Completed',
  failed: 'Failed',
}

// Formats a created_at timestamp as "X minutes/hours/days ago".
const timeAgo = (dateString, now) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const seconds = Math.max(0, Math.floor((now - date.getTime()) / 1000))

  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`

  const years = Math.floor(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

const Dashboard = () => {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [now, setNow] = useState(() => Date.now())

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks()
      setTasks(data)
      setNow(Date.now())
    } catch (err) {
      console.error('Failed to load projects for dashboard:', err)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Keep "Projects" / "Tasks Completed" counts and the "X ago" labels
  // correct while the page stays open, without needing a manual refresh.
  useEffect(() => {
    const interval = setInterval(() => {
      loadTasks()
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [loadTasks])

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-50 text-green-600'
    if (status === 'running' || status === 'pending') return 'bg-yellow-50 text-yellow-600'
    if (status === 'failed') return 'bg-red-50 text-red-600'
    return 'bg-gray-50 text-gray-500'
  }

  const totalProjects = tasks.length
  const totalTasksCompleted = tasks.reduce((sum, task) => sum + (task.completed_steps || 0), 0)
  const recentProjects = tasks.slice(0, 4)

  const stats = DASHBOARD_STATS.map((stat) => {
    if (stat.label === 'Projects') {
      return { ...stat, value: String(totalProjects) }
    }
    if (stat.label === 'Tasks Completed') {
      return { ...stat, value: String(totalTasksCompleted) }
    }
    return stat
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">AI Development Workspace</h2>
          <p className="text-gray-500">Turn software requirements into structured development workflows.</p>
        </div>
        <button 
          className="btn-primary text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2"
          onClick={() => navigate('/newproject')}
        >
          <i className="fas fa-plus"></i> New Project
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-subtle shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Recent Projects</h3>

        {recentProjects.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-subtle shadow-sm text-center text-sm text-gray-500">
            You haven't built any projects yet.
          </div>
        )}

        {recentProjects.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-5 rounded-2xl border border-subtle shadow-sm card-hover cursor-pointer"
                onClick={() => navigate('/workflow', { state: { taskId: project.id, requirement: project.user_request } })}
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-bold line-clamp-2">{project.user_request}</h4>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(project.status)}`}>
                    {STATUS_LABELS[project.status] || project.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                  <span><i className="fas fa-robot mr-1"></i>5 agents</span>
                  <span><i className="far fa-clock mr-1"></i>{timeAgo(project.created_at, now)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
