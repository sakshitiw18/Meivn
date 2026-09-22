import React from 'react'

const WorkflowResult = ({ task, requirement }) => {
  return (
    <div className="bg-white border border-subtle rounded-2xl p-6 space-y-4 slide-up">
      <h3 className="font-bold text-xl">Project Solution</h3>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-400">Project</div>
          <div className="font-medium">
            {task?.user_request || requirement || 'E-Commerce Platform'}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-400">Status</div>
          <div className="font-medium text-green-600">
            {task?.status === 'completed' ? 'Completed' : task?.status || 'Processing'}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-400">Agents</div>
          <div className="font-medium">5</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-400">Framework</div>
          <div className="font-medium">LangGraph</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-gray-400 border-t border-subtle pt-4">
        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">Overview</span>
        <span className="px-3 py-1">Research</span>
        <span className="px-3 py-1">Code</span>
        <span className="px-3 py-1">Database</span>
        <span className="px-3 py-1">Review</span>
        <span className="px-3 py-1">Documentation</span>
      </div>
    </div>
  )
}

export default WorkflowResult