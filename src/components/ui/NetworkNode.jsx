// src/components/ui/NetworkNode.jsx
import { Handle, Position } from '@xyflow/react'

function NetworkNode({ data }) {
  return (
    <div
      onClick={() => data.onSelect(data.id)}
      className="flex flex-col items-center cursor-pointer group"
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 group-hover:scale-110 border-2"
        style={{
          backgroundColor: data.color + '20',
          borderColor: data.selected ? data.color : data.color + '40',
          boxShadow: data.selected ? `0 0 20px ${data.color}40` : 'none',
        }}
      >
        {data.icon}
      </div>
      <p
        className="mt-2 text-xs font-semibold text-center"
        style={{ color: data.color }}
      >
        {data.label}
      </p>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  )
}

export default NetworkNode