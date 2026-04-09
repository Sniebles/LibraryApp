import { useState } from 'react'
import './Box.css'

function Box({ children, width, height, className, Selectable = false, onClick}) {
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' })

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setMousePos({ x: `${x}%`, y: `${y}%` })
  }

  return (
    <div
      onClick={(onClick)}
      className={`box ${className + (Selectable ? "" : " non-selectable") || ''}`.trim()}
      style={{
        '--mouse-x': mousePos.x, '--mouse-y': mousePos.y,
        '--width': width, '--height': height
       }}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  )
}

export default Box
