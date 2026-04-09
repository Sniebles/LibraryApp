import { useState } from 'react'
import './Box.css'

function Box({ children, width, height, className = '', Selectable = false, onClick}) {
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' })
  const boxClassName = ['box', className, Selectable ? '' : 'non-selectable'].filter(Boolean).join(' ')
  const computedWidth = width || '100%'
  const computedHeight = height || '100%'

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setMousePos({ x: `${x}%`, y: `${y}%` })
  }

  return (
    <div
      onClick={onClick}
      className={boxClassName}
      style={{
        '--mouse-x': mousePos.x,
        '--mouse-y': mousePos.y,
        '--width': computedWidth,
        '--height': computedHeight
       }}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  )
}

export default Box
