import React from 'react'

const WorkflowAgent = ({ agent, index }) => {
  let statusClass = 'border-subtle'
  let statusLabel = 'Waiting'
  let iconHtml = <span className="text-xs">{index + 1}</span>
  let iconColor = 'bg-gray-100 text-gray-400'
  let checkmark = ''

  if (agent.status === 'completed') {
    statusClass = 'completed border-green-200'
    statusLabel = 'Completed ✓'
    iconHtml = <i className="fas fa-check"></i>
    iconColor = 'bg-green-100 text-green-600'
    checkmark = <span className="text-green-600 text-sm">✓</span>
  } else if (agent.status === 'running') {
    statusClass = 'active border-indigo-200'
    statusLabel = 'Running...'
    iconHtml = <i className="fas fa-spinner fa-spin"></i>
    iconColor = 'bg-indigo-100 text-indigo-600'
  } else if (agent.status === 'failed') {
    statusClass = 'failed border-red-200'
    statusLabel = 'Failed'
    iconHtml = <i className="fas fa-times"></i>
    iconColor = 'bg-red-100 text-red-600'
  }

  return (
    <div className={`agent-step p-4 rounded-xl border ${statusClass} transition`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
            {iconHtml}
          </div>

          <div>
            <div className="font-bold">{agent.name}</div>
            <div className="text-sm text-gray-400">{statusLabel}</div>
          </div>
        </div>

        {checkmark}
      </div>

      {agent.output && (
        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {agent.output}
        </div>
      )}

      {agent.error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {agent.error}
        </div>
      )}
    </div>
  )
}

export default WorkflowAgent