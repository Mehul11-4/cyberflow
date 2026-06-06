// src/pages/Labs/NetworkLab.jsx
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Play, Square, ChevronRight,
  ChevronLeft, Info, X, Layers
} from 'lucide-react'
import { deviceInfo, protocols } from '../../data/networkLab'
import NetworkNode from '../../components/ui/NetworkNode'

const nodeTypes = { networkNode: NetworkNode }

const initialNodes = [
  { id: 'internet',  type: 'networkNode', position: { x: 340, y: 20  }, data: { id: 'internet',  ...deviceInfo.internet,  selected: false, active: false } },
  { id: 'attacker',  type: 'networkNode', position: { x: 600, y: 20  }, data: { id: 'attacker',  ...deviceInfo.attacker,  selected: false, active: false } },
  { id: 'firewall',  type: 'networkNode', position: { x: 340, y: 160 }, data: { id: 'firewall',  ...deviceInfo.firewall,  selected: false, active: false } },
  { id: 'router',    type: 'networkNode', position: { x: 340, y: 300 }, data: { id: 'router',    ...deviceInfo.router,    selected: false, active: false } },
  { id: 'switch',    type: 'networkNode', position: { x: 340, y: 440 }, data: { id: 'switch',    ...deviceInfo.switch,    selected: false, active: false } },
  { id: 'server',    type: 'networkNode', position: { x: 160, y: 300 }, data: { id: 'server',    ...deviceInfo.server,    selected: false, active: false } },
  { id: 'computer',  type: 'networkNode', position: { x: 220, y: 580 }, data: { id: 'computer',  ...deviceInfo.computer,  selected: false, active: false } },
  { id: 'laptop',    type: 'networkNode', position: { x: 460, y: 580 }, data: { id: 'laptop',    ...deviceInfo.laptop,    selected: false, active: false } },
]

const initialEdges = [
  { id: 'e-internet-firewall',  source: 'internet',  target: 'firewall', style: { stroke: '#374151', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#374151' } },
  { id: 'e-attacker-firewall',  source: 'attacker',  target: 'firewall', style: { stroke: '#374151', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#374151' } },
  { id: 'e-firewall-router',    source: 'firewall',  target: 'router',   style: { stroke: '#374151', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#374151' } },
  { id: 'e-router-switch',      source: 'router',    target: 'switch',   style: { stroke: '#374151', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#374151' } },
  { id: 'e-router-server',      source: 'router',    target: 'server',   style: { stroke: '#374151', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#374151' } },
  { id: 'e-switch-computer',    source: 'switch',    target: 'computer', style: { stroke: '#374151', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#374151' } },
  { id: 'e-switch-laptop',      source: 'switch',    target: 'laptop',   style: { stroke: '#374151', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#374151' } },
  { id: 'e-computer-router',    source: 'computer',  target: 'router',   style: { stroke: '#374151', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#374151' } },
]

function getEdgeId(src, dst) {
  const pairs = [
    [src, dst], [dst, src]
  ]
  for (const [a, b] of pairs) {
    const id = `e-${a}-${b}`
    if (initialEdges.find(e => e.id === id)) return id
  }
  return null
}

function NetworkLab() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [activeProtocol, setActiveProtocol] = useState(null)
  const [currentStep, setCurrentStep]       = useState(-1)
  const [isPlaying, setIsPlaying]           = useState(false)
  const [isPaused, setIsPaused]             = useState(false)
  const timerRef = useRef(null)

  const totalSteps = activeProtocol?.steps?.length ?? 0

  // ── Highlight helpers ────────────────────────────────────────
  function highlightStep(protocol, stepIndex) {
    const step     = protocol.steps[stepIndex]
    const deviceId = step.device
    const path     = protocol.path
    const color    = protocol.color

    // Highlight active node
    setNodes(nds => nds.map(n => ({
      ...n,
      data: {
        ...n.data,
        active:   n.id === deviceId,
        selected: n.id === deviceId,
      },
    })))

    // Highlight edges up to current step
    setEdges(eds => eds.map(e => {
      let isActive = false
      for (let i = 0; i < stepIndex; i++) {
        const edgeId = getEdgeId(path[i], path[i + 1])
        if (edgeId === e.id) { isActive = true; break }
      }
      const isCurrent = getEdgeId(
        path[stepIndex - 1] ?? '',
        path[stepIndex] ?? ''
      ) === e.id

      return {
        ...e,
        animated: isCurrent,
        style: {
          ...e.style,
          stroke: isCurrent ? color
                : isActive  ? color + '60'
                : '#374151',
          strokeWidth: isCurrent ? 4 : isActive ? 2 : 2,
        },
        markerEnd: {
          type:  MarkerType.ArrowClosed,
          color: isCurrent ? color : isActive ? color + '60' : '#374151',
        },
      }
    }))
  }

  function resetDiagram() {
    clearTimeout(timerRef.current)
    setNodes(nds => nds.map(n => ({
      ...n,
      data: { ...n.data, selected: false, active: false },
    })))
    setEdges(initialEdges)
    setCurrentStep(-1)
    setIsPlaying(false)
    setIsPaused(false)
  }

  // ── Start simulation ─────────────────────────────────────────
  function startSimulation(protocol) {
    resetDiagram()
    setActiveProtocol(protocol)
    setCurrentStep(0)
    setIsPlaying(true)
    setIsPaused(false)
    highlightStep(protocol, 0)
  }

  // ── Auto-advance ─────────────────────────────────────────────
  function scheduleNext(protocol, nextStep) {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (nextStep < protocol.steps.length) {
        setCurrentStep(nextStep)
        highlightStep(protocol, nextStep)
        scheduleNext(protocol, nextStep + 1)
      } else {
        setIsPlaying(false)
      }
    }, 3000)
  }

  function playAuto() {
    if (!activeProtocol) return
    setIsPaused(false)
    setIsPlaying(true)
    const next = currentStep + 1
    scheduleNext(activeProtocol, next)
  }

  function pauseSim() {
    clearTimeout(timerRef.current)
    setIsPaused(true)
    setIsPlaying(false)
  }

  function goNext() {
    if (!activeProtocol || currentStep >= totalSteps - 1) return
    clearTimeout(timerRef.current)
    const next = currentStep + 1
    setCurrentStep(next)
    highlightStep(activeProtocol, next)
    if (next >= totalSteps - 1) setIsPlaying(false)
  }

  function goPrev() {
    if (!activeProtocol || currentStep <= 0) return
    clearTimeout(timerRef.current)
    const prev = currentStep - 1
    setCurrentStep(prev)
    highlightStep(activeProtocol, prev)
    setIsPlaying(false)
    setIsPaused(true)
  }

  const selectDevice = useCallback((id) => {
    setSelectedDevice(deviceInfo[id])
    setNodes(nds => nds.map(n => ({
      ...n,
      data: { ...n.data, selected: n.id === id },
    })))
  }, [setNodes])

  const nodesWithHandler = nodes.map(n => ({
    ...n,
    data: { ...n.data, onSelect: selectDevice },
  }))

  const currentStepData = activeProtocol && currentStep >= 0
    ? activeProtocol.steps[currentStep]
    : null

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">🌐 Network Visualization Lab</h1>
        <p className="text-gray-400 mt-1">
          Simulate packet flow step by step. Click any device to learn what it does.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left Panel ─────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Protocol buttons */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 text-sm">
              Choose a Simulation
            </h3>
            <div className="space-y-2">
              {protocols.map(p => (
                <button
                  key={p.id}
                  onClick={() => startSimulation(p)}
                  className="w-full text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center gap-2"
                  style={{
                    backgroundColor: activeProtocol?.id === p.id ? p.color + '15' : 'transparent',
                    borderColor:     activeProtocol?.id === p.id ? p.color + '50' : '#374151',
                    color:           activeProtocol?.id === p.id ? p.color : '#9ca3af',
                  }}
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                  {activeProtocol?.id === p.id && (
                    <span className="ml-auto text-xs opacity-60">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step explanation card */}
          <AnimatePresence mode="wait">
            {currentStepData && (
              <motion.div
                key={`${activeProtocol.id}-${currentStep}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 border rounded-xl p-4 space-y-3"
                style={{ borderColor: activeProtocol.color + '40' }}
              >
                {/* Step counter */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: activeProtocol.color + '20', color: activeProtocol.color }}
                  >
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Layers size={11} /> {currentStepData.layer}
                  </span>
                </div>

                {/* Device + title */}
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {deviceInfo[currentStepData.device]?.icon}
                  </span>
                  <p className="text-white font-semibold text-sm">
                    {currentStepData.title}
                  </p>
                </div>

                {/* Explanation */}
                <p className="text-gray-400 text-xs leading-relaxed">
                  {currentStepData.explanation}
                </p>

                {/* Packet preview */}
                <div
                  className="rounded-lg p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                  style={{
                    backgroundColor: activeProtocol.color + '08',
                    borderLeft: `3px solid ${activeProtocol.color}`,
                    color: activeProtocol.color,
                  }}
                >
                  {currentStepData.packet}
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5 justify-center pt-1">
                  {activeProtocol.steps.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width:  i === currentStep ? 16 : 6,
                        height: 6,
                        backgroundColor: i <= currentStep
                          ? activeProtocol.color
                          : '#374151',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playback controls */}
          {activeProtocol && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <p className="text-gray-500 text-xs mb-3 text-center">Playback Controls</p>
              <div className="flex items-center justify-center gap-3">

                <button
                  onClick={goPrev}
                  disabled={currentStep <= 0}
                  className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>

                {isPlaying ? (
                  <button
                    onClick={pauseSim}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all"
                    style={{ backgroundColor: activeProtocol.color, color: '#000' }}
                  >
                    <Square size={14} />
                  </button>
                ) : (
                  <button
                    onClick={playAuto}
                    disabled={currentStep >= totalSteps - 1}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold disabled:opacity-30 transition-all"
                    style={{ backgroundColor: activeProtocol.color, color: '#000' }}
                  >
                    <Play size={14} />
                  </button>
                )}

                <button
                  onClick={goNext}
                  disabled={currentStep >= totalSteps - 1}
                  className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>

              </div>

              <div className="mt-3 flex gap-1">
                {activeProtocol.steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      clearTimeout(timerRef.current)
                      setCurrentStep(i)
                      highlightStep(activeProtocol, i)
                      setIsPlaying(false)
                      setIsPaused(true)
                    }}
                    className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i <= currentStep
                        ? activeProtocol.color
                        : '#374151',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={resetDiagram}
                className="mt-3 w-full text-xs text-gray-600 hover:text-gray-400 transition-colors text-center"
              >
                Reset
              </button>
            </motion.div>
          )}

          {/* Device info panel */}
          <AnimatePresence>
            {selectedDevice && !currentStepData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <Info size={14} className="text-cyan-400" /> Device Info
                  </h3>
                  <button onClick={() => setSelectedDevice(null)}>
                    <X size={14} className="text-gray-500 hover:text-white" />
                  </button>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 border"
                  style={{
                    backgroundColor: selectedDevice.color + '20',
                    borderColor: selectedDevice.color + '40',
                  }}
                >
                  {selectedDevice.icon}
                </div>
                <p className="font-bold text-sm mb-1" style={{ color: selectedDevice.color }}>
                  {selectedDevice.label}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  {selectedDevice.description}
                </p>
                <ul className="space-y-1.5">
                  {selectedDevice.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span
                        className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: selectedDevice.color }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How to use */}
          {!activeProtocol && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 text-sm">How to Use</h3>
              <ul className="space-y-2 text-xs text-gray-500">
                {[
                  'Choose a simulation from the list above',
                  'Use ▶ Play for auto-advance every 3 seconds',
                  'Use ‹ › arrows to step manually at your own pace',
                  'Click the timeline bar to jump to any step',
                  'Click any device on the diagram to learn about it',
                  'Drag devices to rearrange the diagram',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 flex-shrink-0">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* ── Right Panel — Diagram ───────────────────────────── */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl border border-gray-800 overflow-hidden"
            style={{ height: '700px', background: '#0a0c10' }}
          >
            <ReactFlow
              nodes={nodesWithHandler}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.25 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#1f2937" gap={28} size={1} />
              <Controls />
            </ReactFlow>
          </div>

          {/* Bottom status bar */}
          {activeProtocol && currentStepData && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-xl border px-4 py-3 flex items-center gap-3"
              style={{
                backgroundColor: activeProtocol.color + '08',
                borderColor: activeProtocol.color + '30',
              }}
            >
              <span className="text-xl">{activeProtocol.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold" style={{ color: activeProtocol.color }}>
                  {activeProtocol.label} — {currentStepData.title}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Currently at: {deviceInfo[currentStepData.device]?.icon} {deviceInfo[currentStepData.device]?.label}
                  {' · '}{currentStepData.layer}
                </p>
              </div>
              {isPlaying && (
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: activeProtocol.color }}
                />
              )}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  )
}

export default NetworkLab