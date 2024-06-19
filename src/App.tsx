import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  return (
    <div className="flex flex-col overflow-x-hidden h-screen">
      <div className='h-[5%] bg-black'></div>
      <div className=" grow h-[90%]  bg-green-50 flex items-center justify-center border">
          <div className='h-full w-[90%] bg-blue-200  flex justify-center'>
            <svg  viewBox="0 0 1200 800" stroke='red' preserveAspectRatio="xMidYMid meet">
              <circle cx="46" cy="45" r="40"></circle>
            </svg>
          </div>
      </div>
      <div className="  flex-none h-[5%] flex flex-col border-r transition-all duration-300 " >
        <nav className="flex-1 flex  bg-red-50">
          <a href="#" className="p-2">Nav Link 1</a>
          <a href="#" className="p-2">Nav Link 2</a>
          <a href="#" className="p-2">Nav Link 3</a>
        </nav>
      </div>
    </div >
  )
}

export default App
