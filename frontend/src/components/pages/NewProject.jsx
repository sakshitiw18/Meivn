import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../../hooks/useWorkflow'

const EXAMPLE_PROJECTS = [
  'Build an e-commerce website',
  'Create a student management system',
  'Build a spam email detector',
  'Create an AI chatbot'
]

const NewProject = () => {

  const navigate = useNavigate()

  const { startWorkflow } = useWorkflow()

  const [requirement, setRequirement] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleExampleClick = (example) => {
    setRequirement(example)
  }

  const handleRunWorkflow = async () => {

    const trimmedRequirement = requirement.trim()

    if (!trimmedRequirement) {
      return
    }

    try {

      setIsSubmitting(true)

      const task = await startWorkflow(trimmedRequirement)

      navigate('/workflow', {
        state: {
          taskId: task.id,
          requirement: trimmedRequirement
        }
      })

    } catch (error) {

      console.error('Failed to start workflow:', error)

      alert('Could not start the workflow. Please make sure the backend is running.')

    } finally {

      setIsSubmitting(false)

    }
  }

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#fafbff]">

      <div className="w-full max-w-5xl mx-auto px-6 py-10">

        {/* HEADER */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-[#0a1128]">
            What do you want to build?
          </h2>

          <p className="text-gray-500 mt-2">
            Describe your software project, requirements or development task.
          </p>

        </div>


        {/* REQUIREMENT CARD */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
          "
        >

          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Describe your software project, requirements or development task..."
            className="
              w-full
              min-h-[220px]
              p-5
              border
              border-gray-200
              rounded-2xl
              resize-y
              outline-none
              text-gray-800
              placeholder-gray-400
              focus:ring-2
              focus:ring-indigo-200
              focus:border-indigo-400
              transition
            "
          />


          {/* EXAMPLES */}

          <div className="mt-6">

            <p className="text-sm text-gray-400 mb-3">
              Or click a project you want to build:
            </p>

            <div className="flex flex-wrap gap-3">

              {EXAMPLE_PROJECTS.map((example) => (

                <button
                  key={example}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    border
                    transition

                    ${
                      requirement === example
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-600 font-medium'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                    }
                  `}
                >
                  {example}
                </button>

              ))}

            </div>

          </div>


          {/* SELECTED PROJECT */}

          {requirement.trim() && (

            <div
              className="
                mt-6
                p-4
                bg-indigo-50
                border
                border-indigo-100
                rounded-xl
              "
            >

              <div className="flex items-start gap-3">

                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-indigo-100
                    text-indigo-600
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >
                  <i className="fas fa-lightbulb"></i>
                </div>

                <div>

                  <p className="text-xs text-indigo-500 font-medium">
                    PROJECT TO BUILD
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    {requirement}
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* RUN BUTTON */}

          <div className="mt-8 flex justify-end">

            <button
              type="button"
              onClick={handleRunWorkflow}
              disabled={!requirement.trim() || isSubmitting}
              className="
                btn-primary
                text-white
                px-8
                py-3
                rounded-full
                text-sm
                font-semibold
                flex
                items-center
                gap-2
                disabled:opacity-40
                disabled:cursor-not-allowed
                disabled:transform-none
              "
            >

              {isSubmitting ? 'Starting Workflow...' : 'Run Multi-Agent Workflow'}

              <i className="fas fa-arrow-right"></i>

            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default NewProject