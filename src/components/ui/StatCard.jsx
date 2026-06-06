// src/components/ui/StatCard.jsx
import { motion } from 'framer-motion'

function StatCard({ icon: Icon, label, value, color, suffix }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4 hover:border-gray-700 transition-all"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-white text-2xl font-bold mt-0.5">
          {value}<span className="text-gray-500 text-sm font-normal">{suffix}</span>
        </p>
      </div>
    </motion.div>
  )
}

export default StatCard