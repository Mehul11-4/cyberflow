// src/components/ui/DomainCard.jsx
import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle } from 'lucide-react'

const colorMap = {
  cyan:   'bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400',
  purple: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50 text-purple-400',
  blue:   'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50 text-blue-400',
  green:  'bg-green-500/10 border-green-500/20 hover:border-green-500/50 text-green-400',
  yellow: 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/50 text-yellow-400',
  red:    'bg-red-500/10 border-red-500/20 hover:border-red-500/50 text-red-400',
  orange: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50 text-orange-400',
  pink:   'bg-pink-500/10 border-pink-500/20 hover:border-pink-500/50 text-pink-400',
}

function DomainCard({ domain, onClick, completed, delay }) {
  const colors = colorMap[domain.color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={`relative border rounded-xl p-5 cursor-pointer transition-all duration-200 group ${colors}`}
    >
      {completed && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={16} className="text-green-400" />
        </div>
      )}

      <div className="text-3xl mb-3">{domain.icon}</div>
      <h3 className="text-white font-semibold text-base mb-1 group-hover:text-inherit transition-colors">
        {domain.title}
      </h3>
      <p className="text-gray-500 text-xs leading-relaxed mb-4">
        {domain.summary}
      </p>
      <div className="flex items-center gap-1 text-xs font-medium opacity-60 group-hover:opacity-100 transition-opacity">
        Explore <ChevronRight size={12} />
      </div>
    </motion.div>
  )
}

export default DomainCard