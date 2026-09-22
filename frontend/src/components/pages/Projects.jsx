import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks, deleteTask } from '../../services/api'

const STATUS_LABELS = {
  pending: 'Pending',
  running: 'In Progress',
  completed: 'Completed',
  failed: 'Failed',
}

const getStatusColor = (status) => {
  if (status === 'completed') return 'bg-green-50 text-green-600'
  if (status === 'running' || status === 'pending') return 'bg-yellow-50 text-yellow-600'
  if (status === 'failed') return 'bg-red-50 text-red-600'
  return 'bg-gray-50 text-gray-500'
}

// Formats a created_at timestamp as "X minutes/hours/days ago", based on the
// real elapsed time between now and when the project was created.
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

const Projects = () => {
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [now, setNow] = useState(() => Date.now())

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const tasks = await getTasks()
      setProjects(tasks)
      setNow(Date.now())

    } catch (err) {
      console.error('Failed to load projects:', err)
      setError('Could not load your projects. Please make sure the backend is running.')

    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // Keep the "X ago" labels correct while the page stays open, without
  // needing a manual refresh — recompute "now" every minute.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const openProject = (project) => {
    navigate('/workflow', {
      state: {
        taskId: project.id,
        requirement: project.user_request,
      },
    })
  }

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.user_request}"? This can't be undone.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(project.id)
      await deleteTask(project.id)

      setProjects((prev) => prev.filter((item) => item.id !== project.id))

    } catch (err) {
      console.error('Failed to delete project:', err)
      alert('Could not delete the project. Please make sure the backend is running.')

    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>

        <button
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
          onClick={loadProjects}
        >
          <i className="fas fa-redo mr-1"></i> Refresh
        </button>
      </div>

      {loading && (
        <div className="text-sm text-gray-400">Loading your projects...</div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="bg-white p-10 rounded-2xl border border-subtle shadow-sm text-center">
          <p className="text-gray-500">
            You haven't built any projects yet.
          </p>
          <button
            className="btn-primary text-white px-6 py-3 rounded-full text-sm font-semibold mt-4"
            onClick={() => navigate('/newproject')}
          >
            Start a New Project
          </button>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-2xl border border-subtle shadow-sm card-hover">

              <div className="flex items-start justify-between gap-4">
                <h4 className="font-bold text-lg line-clamp-2">
                  {project.user_request}
                </h4>

                <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(project.status)}`}>
                  {STATUS_LABELS[project.status] || project.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                <span><i className="fas fa-robot mr-1"></i>5 agents</span>
                <span><i className="far fa-clock mr-1"></i>{timeAgo(project.created_at, now)}</span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition"
                  onClick={() => openProject(project)}
                >
                  Open →
                </button>

                <button
                  className="text-gray-400 text-sm font-medium hover:text-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => handleDelete(project)}
                  disabled={deletingId === project.id}
                >
                  <i className="fas fa-trash-alt mr-1"></i>
                  {deletingId === project.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Projects
