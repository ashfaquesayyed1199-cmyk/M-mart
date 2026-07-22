import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/customer/HomePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
