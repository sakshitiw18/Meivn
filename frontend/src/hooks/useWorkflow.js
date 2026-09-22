import { useState, useCallback, useRef, useEffect } from 'react'
import { DEMO_AGENTS } from '../data/demoData'
import { createTask, getTask } from '../services/api'

const WORKFLOW_OUTPUTS = [
  'Requirement analyzed and tasks distributed.',
  'Recommended React, FastAPI and MySQL.',
  'Application structure and API examples generated.',
  'Student, Course, Attendance and Result entities identified.',
  'Architecture reviewed. Minor improvements recommended.',
  'Project documentation generated.'
]

export const useWorkflow = () => {
  const [requirement, setRequirement] = useState('')
  const [status, setStatus] = useState('idle')
  const [agents, setAgents] = useState([])
  const [completed, setCompleted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [task, setTask] = useState(null)
  const intervalRef = useRef(null)

  const initializeAgents = useCallback(() => {
    return DEMO_AGENTS.map(agent => ({
      ...agent,
      status: 'pending',
      output: ''
    }))
  }, [])

  const startWorkflow = useCallback(async (req) => {
    if (!req || req.trim().length < 3) {
      alert('Please describe your project requirement (at least 3 characters).')
      return false
    }

    try {
      setRequirement(req)
      setStatus('running')
      setAgents(initializeAgents())
      setCompleted(false)
      setShowResult(false)

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      const task = await createTask(req.trim())

      return task

    } catch (error) {
      console.error('Failed to start workflow:', error)

      setStatus('idle')
      setCompleted(false)

      alert(
        'Could not start the workflow. Please make sure the backend is running.'
      )

      return false
    }
  }, [initializeAgents])

  const watchTask = useCallback((taskId) => {
    if (!taskId) {
      return
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const pollTask = async () => {
      try {
        const task = await getTask(taskId)

        setTask(task)
        setRequirement(task.user_request || '')
        setStatus(task.status)

        const backendSteps = task.steps || []

        setAgents(prev => {
          const baseAgents =
            prev.length > 0 ? prev : initializeAgents()

          return baseAgents.map((agent, index) => {
            const agentKey =
              agent.key ||
              agent.id ||
              agent.name?.toLowerCase()

            const step = backendSteps.find(
              backendStep => backendStep.agent_name === agentKey
            )

            if (!step) {
              return {
                ...agent,
                status: 'pending',
                output: ''
              }
            }

            return {
              ...agent,
              status: step.status,
              output: step.output_data || step.error || ''
            }
          })
        })

        if (task.status === 'completed') {
          setStatus('completed')
          setCompleted(true)
          setShowResult(true)

          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          return
        }

        if (task.status === 'failed') {
          setStatus('failed')
          setCompleted(false)

          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          return
        }

      } catch (error) {
        console.error('Failed to fetch workflow status:', error)
      }
    }

    pollTask()

    intervalRef.current = setInterval(() => {
      pollTask()
    }, 2000)

  }, [initializeAgents])

  const resetWorkflow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setRequirement('')
    setStatus('idle')
    setAgents([])
    setCompleted(false)
    setShowResult(false)
    setTask(null)
  }, [])

  const toggleResult = useCallback(() => {
    setShowResult(prev => !prev)
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    requirement,
    setRequirement,
    status,
    agents,
    completed,
    showResult,
    task,
    startWorkflow,
    watchTask,
    resetWorkflow,
    toggleResult
  }
}