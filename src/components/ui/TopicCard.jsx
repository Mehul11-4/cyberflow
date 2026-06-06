// src/components/ui/TopicCard.jsx
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

function TopicCard({ title, description, tag, tagColor, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-cyan-500/30 hover:bg-gray-800/50 transition-all cursor-pointer group"
    >
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tagColor}`}>
        {tag}
      </span>
      <h3 className="text-white font-semibold mt-3 mb-1 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-1 mt-4 text-cyan-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Start Learning <ArrowRight size={14} />
      </div>
    </motion.div>
  )
}

export default TopicCard