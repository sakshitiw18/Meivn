import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../hooks/useWorkflow';

const AGENTS = [
  {
    id: 'planner',
    name: 'Planner Agent',
    role: 'Orchestrator',
    icon: '🔀',
  },
  {
    id: 'researcher',
    name: 'Research Agent',
    role: 'Research Specialist',
    icon: '🔍',
  },
  {
    id: 'coder',
    name: 'Coding Agent',
    role: 'Development Specialist',
    icon: '💻',
  },
  {
    id: 'reviewer',
    name: 'Reviewer Agent',
    role: 'Quality Specialist',
    icon: '🔎',
  },
  {
    id: 'reporter',
    name: 'Reporter Agent',
    role: 'Documentation Specialist',
    icon: '📄',
  },
];

const getInitialAgents = () =>
  AGENTS.map((agent) => ({
    ...agent,
    status: 'pending',
    output: '',
  }));

// Renders inline markdown (bold + inline code) inside a line of text.
const renderInline = (str, keyPrefix) => {
  const parts = String(str).split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={`${keyPrefix}-${i}`}
          className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
};

// Lightweight markdown -> JSX renderer for the agent's final report
// (handles headings, bullet/numbered lists, code fences, bold/inline code).
const renderMarkdown = (text) => {
  if (!text) {
    return null;
  }

  const lines = String(text).split('\n');
  const blocks = [];

  let listItems = [];
  let listType = null;
  let codeLines = null;
  let paragraphLines = [];

  const flushParagraph = () => {
    if (paragraphLines.length) {
      blocks.push({ type: 'p', content: paragraphLines.join(' ') });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: listType, items: listItems });
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (line.startsWith('```')) {
      if (codeLines === null) {
        flushParagraph();
        flushList();
        codeLines = [];
      } else {
        blocks.push({ type: 'code', content: codeLines.join('\n') });
        codeLines = null;
      }
      return;
    }

    if (codeLines !== null) {
      codeLines.push(rawLine);
      return;
    }

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2],
      });
      return;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      if (listType && listType !== 'ul') {
        flushList();
      }
      listType = 'ul';
      listItems.push(bulletMatch[1]);
      return;
    }

    const numberedMatch = line.match(/^\d+[.)]\s+(.*)$/);
    if (numberedMatch) {
      flushParagraph();
      if (listType && listType !== 'ol') {
        flushList();
      }
      listType = 'ol';
      listItems.push(numberedMatch[1]);
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();
  if (codeLines !== null) {
    blocks.push({ type: 'code', content: codeLines.join('\n') });
  }

  return blocks.map((block, idx) => {
    if (block.type === 'heading') {
      const sizeClass =
        block.level <= 2
          ? 'text-base font-bold mt-4 mb-2'
          : 'text-sm font-semibold mt-3 mb-1';

      return (
        <div key={idx} className={`${sizeClass} text-gray-800`}>
          {renderInline(block.content, idx)}
        </div>
      );
    }

    if (block.type === 'ul') {
      return (
        <ul key={idx} className="list-disc pl-5 space-y-1 my-2">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item, `${idx}-${i}`)}</li>
          ))}
        </ul>
      );
    }

    if (block.type === 'ol') {
      return (
        <ol key={idx} className="list-decimal pl-5 space-y-1 my-2">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item, `${idx}-${i}`)}</li>
          ))}
        </ol>
      );
    }

    if (block.type === 'code') {
      return (
        <pre
          key={idx}
          className="bg-gray-900 text-gray-100 text-xs p-3 rounded-lg overflow-x-auto my-2"
        >
          <code>{block.content}</code>
        </pre>
      );
    }

    return (
      <p key={idx} className="my-2 leading-relaxed">
        {renderInline(block.content, idx)}
      </p>
    );
  });
};

// Strips markdown symbols for the plain-text (.txt) download.
const stripMarkdown = (text) => {
  if (!text) {
    return '';
  }

  return String(text)
    .replace(/```([\s\S]*?)```/g, (_, code) => code.trim())
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*]\s+/gm, '- ')
    .trim();
};

const Workflow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const taskId = location.state?.taskId;

  const requirement =
    location.state?.requirement || 'Build an e-commerce website';

  const [agents, setAgents] = useState(getInitialAgents);
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [workflowCompleted, setWorkflowCompleted] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const {
    task,
    watchTask,
    startWorkflow,
  } = useWorkflow();

  useEffect(() => {
    if (!taskId) {
      navigate('/new-project', { replace: true });
      return;
    }

    watchTask(taskId);
  }, [taskId, watchTask, navigate]);

  useEffect(() => {
    if (!task) {
      return;
    }

    setWorkflowRunning(
      task.status === 'pending' || task.status === 'running'
    );

    setWorkflowCompleted(task.status === 'completed');

    if (task.steps) {
      setAgents((prev) =>
        prev.map((agent) => {
          const step = task.steps.find(
            (item) => item.agent_name === agent.id
          );

          if (!step) {
            return agent;
          }

          return {
            ...agent,
            status: step.status,
            output:
              typeof step.output_data === 'string'
                ? step.output_data
                : step.output_data
                  ? JSON.stringify(step.output_data, null, 2)
                  : '',
          };
        })
      );
    }
  }, [task]);

  const getAgentOutput = (agent) => {
    if (agent.output) {
      return stripMarkdown(agent.output);
    }

    return '';
  };

  const downloadOutput = () => {
    const output = `
MEIVN - MULTI-AGENT DEV PLATFORM
================================

PROJECT REQUIREMENT
${task?.user_request || requirement}

WORKFLOW STATUS
${task?.status || 'Completed'}

AGENTS
------

1. Planner Agent
${getAgentOutput(agents[0])}

2. Research Agent
${getAgentOutput(agents[1])}

3. Coding Agent
${getAgentOutput(agents[2])}

4. Reviewer Agent
${getAgentOutput(agents[3])}

5. Reporter Agent
${getAgentOutput(agents[4])}

FINAL SOLUTION
--------------
${stripMarkdown(task?.final_report) || 'The multi-agent workflow has successfully completed.'}
`;

    const blob = new Blob([output], {
      type: 'text/plain',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'meivn-project-output.txt';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleRunAgain = async () => {
    try {
      setShowOutput(false);
      setWorkflowCompleted(false);
      setWorkflowRunning(true);
      setAgents(getInitialAgents());

      const newTask = await startWorkflow(
        task?.user_request || requirement
      );

      navigate('/workflow', {
        state: {
          taskId: newTask.id,
          requirement: task?.user_request || requirement,
        },
        replace: true,
      });
    } catch (error) {
      console.error('Failed to run workflow again:', error);
      setWorkflowRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate('/new-project')}
          className="text-gray-500 hover:text-gray-900 transition"
        >
          <i className="fas fa-arrow-left"></i>
        </button>

        <h2 className="text-2xl font-bold">
          Workflow Running
        </h2>

        <span className="text-sm text-gray-400 ml-auto">
          {workflowCompleted
            ? 'Completed'
            : workflowRunning
              ? 'Running'
              : 'Waiting'}
        </span>

      </div>


      {/* Project Requirement */}
      <div className="bg-white border border-subtle rounded-2xl p-6">

        <div className="text-sm text-gray-400 mb-2">
          Project Requirement
        </div>

        <div className="font-medium text-gray-800">
          {task?.user_request || requirement}
        </div>

      </div>


      {/* Agent Workflow */}
      <div className="space-y-3">

        {agents.map((agent, index) => {

          let statusClass = 'border-subtle';
          let statusLabel = 'Waiting';

          let iconContent = (
            <span className="text-xs">
              {index + 1}
            </span>
          );

          let iconColor = 'bg-gray-100 text-gray-400';
          let checkmark = '';

          if (agent.status === 'completed') {

            statusClass = 'completed border-green-200';
            statusLabel = 'Completed ✓';

            iconContent = (
              <i className="fas fa-check"></i>
            );

            iconColor = 'bg-green-100 text-green-600';

            checkmark = (
              <span className="text-green-600 text-sm">
                ✓
              </span>
            );

          } else if (agent.status === 'running') {

            statusClass = 'active border-indigo-200';
            statusLabel = 'Running...';

            iconContent = (
              <i className="fas fa-spinner fa-spin"></i>
            );

            iconColor = 'bg-indigo-100 text-indigo-600';

          } else if (agent.status === 'failed') {

            statusClass = 'border-red-200';
            statusLabel = 'Failed';

            iconContent = (
              <i className="fas fa-times"></i>
            );

            iconColor = 'bg-red-100 text-red-600';
          }

          return (
            <div
              key={agent.id}
              className={`agent-step p-4 rounded-xl border ${statusClass} transition`}
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}
                  >
                    {iconContent}
                  </div>

                  <div>

                    <div className="font-bold">
                      {agent.name}
                    </div>

                    <div className="text-sm text-gray-400">
                      {statusLabel}
                    </div>

                  </div>

                </div>

                {checkmark}

              </div>

            </div>
          );
        })}

      </div>


      {/* Workflow Completed */}
      {workflowCompleted && (

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-4">

          <div className="text-3xl font-bold text-green-700">
            ✓ Workflow Completed
          </div>

          <p className="text-gray-600">
            Final Solution Ready
          </p>

          <div className="flex flex-wrap gap-3 justify-center">

            <button
              className="btn-primary text-white px-6 py-2 rounded-full text-sm font-semibold"
              onClick={() => setShowOutput(!showOutput)}
            >
              {showOutput ? 'Hide Output' : 'View Output'}
            </button>

            <button
              className="border border-gray-200 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition"
              onClick={downloadOutput}
            >
              Download Output
            </button>

            <button
              className="border border-gray-200 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition"
              onClick={handleRunAgain}
            >
              Run Again
            </button>

          </div>

        </div>

      )}


      {/* Final Solution */}
      {showOutput && (

        <div className="bg-white border border-subtle rounded-2xl p-6 space-y-4 slide-up">

          <div className="flex items-center justify-between">

            <h3 className="font-bold text-xl">
              Final Solution
            </h3>

          </div>


          <div className="grid sm:grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-xl p-4">

              <div className="text-sm text-gray-400">
                Project
              </div>

              <div className="font-medium">
                {task?.user_request || requirement || 'E-Commerce Platform'}
              </div>

            </div>


            <div className="bg-gray-50 rounded-xl p-4">

              <div className="text-sm text-gray-400">
                Status
              </div>

              <div className="font-medium text-green-600">
                Completed
              </div>

            </div>


            <div className="bg-gray-50 rounded-xl p-4">

              <div className="text-sm text-gray-400">
                Agents
              </div>

              <div className="font-medium">
                5
              </div>

            </div>


            <div className="bg-gray-50 rounded-xl p-4">

              <div className="text-sm text-gray-400">
                Solution Focus
              </div>

              <div className="font-medium">
                Multi-Agent
              </div>

            </div>

          </div>


          <div className="bg-gray-50 rounded-xl p-4">

            <div className="text-sm text-gray-400 mb-2">
              Generated Solution
            </div>

            <div className="text-sm text-gray-600">
              {task?.final_report
                ? renderMarkdown(task.final_report)
                : 'The multi-agent workflow successfully analyzed the project requirement, researched the required technologies, generated the application structure, designed the database, reviewed the architecture, and prepared the project documentation.'}
            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Workflow;