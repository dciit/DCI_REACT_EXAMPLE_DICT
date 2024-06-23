import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Aps from './components/aps'

function App() {
  const [count, setCount] = useState(0)
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  return (
    <Aps/>
  )
}

export default App
