import React, { useState } from 'react'
import Header from './components/Header'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative max-w-5xl mx-auto p-6 sm:p-10 space-y-6">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <BookingForm onCreated={() => setRefreshKey(v=>v+1)} />
          </div>
          <div className="lg:col-span-2">
            <BookingList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
