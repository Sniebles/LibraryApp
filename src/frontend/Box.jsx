import { useState } from 'react'
import './Box.css'

function Box({ children, width, height, className = '', Selectable = null, onClick, borderColor = 'var(--color-shadow)', clickable = true }) {
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' })
  Selectable = Selectable ? Selectable : !clickable
  const boxClassName = ['box', className, Selectable ? '' : 'non-selectable', clickable ? 'box_clickable' : ''].filter(Boolean).join(' ')
  const computedWidth = width || '100%'
  const computedHeight = height || '100%'

  const handleMouseMove = (event) => {
    if (!clickable) {
      return;
    }
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
        '--height': computedHeight,
        '--border-color': borderColor
       }}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  )
}

export default Box
