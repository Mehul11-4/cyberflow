// src/components/layout/MainLayout.jsx
import Sidebar from './Sidebar'

function MainLayout({ children }) {
  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      {/* Desktop: margin-left for sidebar. Mobile: padding-top for top bar */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 p-4 lg:p-8 min-w-0">
        {children}
      </main>
    </div>
  )
}

export default MainLayout