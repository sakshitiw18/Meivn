import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../common/Navbar'

function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: 'fa-brain',
      title: 'Intelligent Planning',
      desc: 'Break complex requirements into manageable subtasks.'
    },
    {
      icon: 'fa-arrows-alt-h',
      title: 'Agent Orchestration',
      desc: 'Coordinate multiple specialized AI agents through a structured workflow.'
    },
    {
      icon: 'fa-code',
      title: 'Code Generation',
      desc: 'Generate and improve software code using AI.'
    },
    {
      icon: 'fa-database',
      title: 'Database Intelligence',
      desc: 'Design schemas and database structures based on project requirements.'
    },
    {
      icon: 'fa-search',
      title: 'AI Review',
      desc: 'Review generated outputs and identify potential issues.'
    },
    {
      icon: 'fa-file-alt',
      title: 'Automated Documentation',
      desc: 'Generate structured project documentation and reports.'
    }
  ]

  const tech = [
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

  return (
    <div className="min-h-screen bg-[#fafbff]">

      {/* =====================================================
          HEADER / NAVBAR
          THIS IS THE TOP SECTION OF THE LANDING PAGE
      ====================================================== */}

      <Navbar />

      {/* =====================================================
          LANDING PAGE CONTENT
      ====================================================== */}

      <div className="space-y-24 pb-24">

        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 pt-12 grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">

            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              Build software with a
              <br />
              <span className="text-indigo-600">
                team of AI agents.
              </span>
            </h1>

            <p className="text-lg text-gray-500 max-w-lg">
              Multi-Agent Dev Platform orchestrates specialized AI agents to
              plan, research, code, review and document software projects
              from a single workspace.
            </p>

            <div className="flex flex-wrap gap-4">

              <button
                type="button"
                className="btn-primary text-white px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2"
                onClick={() => navigate('/newproject')}
              >
                Start Building

                <i className="fas fa-arrow-right"></i>
              </button>

            </div>

          </div>

          {/* AGENT WORKFLOW PREVIEW */}

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-subtle space-y-4">

            <div className="bg-indigo-50 rounded-xl p-4 text-sm font-medium text-gray-700">

              <i className="fas fa-quote-left text-indigo-400 mr-2"></i>

              Build an e-commerce platform with authentication,
              products, cart and payments.

            </div>

            <div className="space-y-2">

              {[
                'Router Agent',
                'Research Agent',
                'Coding Agent',
                'Reviewer Agent',
                'Documentation Agent'
              ].map((name, index) => (

                <div
                  key={name}
                  className="flex items-center gap-3 text-sm"
                >

                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? 'bg-indigo-500'
                        : index < 3
                          ? 'bg-indigo-300'
                          : 'bg-indigo-100'
                    }`}
                  ></div>

                  <span
                    className={`font-medium ${
                      index === 0
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {name}
                  </span>

                  {index < 4 && (
                    <i className="fas fa-arrow-down text-gray-300 text-xs ml-auto"></i>
                  )}

                </div>

              ))}

            </div>

            <div className="mt-4 pt-4 border-t border-subtle flex items-center gap-2 text-sm font-medium text-green-600">

              <i className="fas fa-check-circle"></i>

              Final Solution Generated

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold">
              One platform. Multiple specialized agents.
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="card-hover bg-white p-6 rounded-2xl border border-subtle shadow-sm"
              >

                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl mb-4">

                  <i className={`fas ${feature.icon}`}></i>

                </div>

                <h3 className="font-bold text-lg">
                  {feature.title}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {feature.desc}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* PROCESS */}

        <section className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold">
              From idea to software, automatically.
            </h2>

          </div>

          <div className="grid md:grid-cols-5 gap-4">

            {[
              {
                title: 'Describe',
                desc: 'User provides requirement.'
              },
              {
                title: 'Plan',
                desc: 'Router breaks into subtasks.'
              },
              {
                title: 'Collaborate',
                desc: 'Agents perform tasks.'
              },
              {
                title: 'Review',
                desc: 'Reviewer checks outputs.'
              },
              {
                title: 'Deliver',
                desc: 'Documentation combines results.'
              }
            ].map((step, index) => (

              <div
                key={step.title}
                className="text-center"
              >

                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mx-auto mb-3">

                  0{index + 1}

                </div>

                <h4 className="font-bold">
                  {step.title}
                </h4>

                <p className="text-xs text-gray-400 mt-1">
                  {step.desc}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* TECHNOLOGY */}

        <section className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-3xl font-bold">
              Built for modern AI development.
            </h2>

          </div>

          <div className="flex flex-wrap gap-3 justify-center">

            {tech.map((item) => (

              <div
                key={item.name}
                className="bg-white border border-subtle rounded-xl px-5 py-3 shadow-sm"
              >

                <div className="font-medium text-sm">
                  {item.name}
                </div>

                <div className="text-xs text-gray-400">
                  {item.label}
                </div>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  )
}

export default Landing