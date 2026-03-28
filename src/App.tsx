import { useContext, useEffect } from 'react'
import './App.css'
import { Routes } from './routes'
import { AuthContext } from './contexts/AuthContext'
import { LocalStorageEventTarget } from './utils/http'

function App() {
  const { resetAuthenticated } = useContext(AuthContext)
  useEffect(() => {
    const handleReset = () => {
      resetAuthenticated()
    }
    LocalStorageEventTarget.addEventListener('logout', handleReset)
    return () => {
      LocalStorageEventTarget.removeEventListener('logout', handleReset)
    }
  }, [resetAuthenticated])
  return (
    <>
      <Routes />
    </>
  )
}

export default App
